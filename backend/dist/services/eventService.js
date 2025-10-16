"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelRegistration = exports.registerUser = exports.getStats = exports.listUpcoming = exports.getEventDetails = exports.createEvent = void 0;
const index_js_1 = __importDefault(require("../db/index.js"));
const eventRepo = __importStar(require("../repos/eventRepo.js"));
const userRepo = __importStar(require("../repos/userRepo.js"));
const regRepo = __importStar(require("../repos/registrationRepo.js"));
const createEvent = async (data) => {
    // Validate capacity
    if (!Number.isInteger(data.capacity) || data.capacity <= 0 || data.capacity > 1000) {
        throw { status: 400, message: 'Capacity must be a positive integer ≤ 1000' };
    }
    // basic date validation
    const d = new Date(data.starts_at);
    if (isNaN(d.getTime()))
        throw { status: 400, message: 'Invalid starts_at value' };
    return await eventRepo.createEvent(data);
};
exports.createEvent = createEvent;
const getEventDetails = async (id) => {
    const event = await eventRepo.getEventById(id);
    if (!event)
        throw { status: 404, message: 'Event not found' };
    const registrations = await regRepo.listRegistrationsForEvent(id);
    return { ...event, registrations };
};
exports.getEventDetails = getEventDetails;
const listUpcoming = async () => {
    const events = await eventRepo.listUpcomingEvents();
    // custom comparator: date asc, then location alpha
    events.sort((a, b) => {
        const da = new Date(a.starts_at).getTime();
        const db = new Date(b.starts_at).getTime();
        if (da !== db)
            return da - db;
        return a.location.localeCompare(b.location);
    });
    return events;
};
exports.listUpcoming = listUpcoming;
const getStats = async (id) => {
    const event = await eventRepo.getEventById(id);
    if (!event)
        throw { status: 404, message: 'Event not found' };
    const total = await eventRepo.getRegistrationCount(id);
    const remaining = Math.max(0, event.capacity - total);
    const percent = event.capacity === 0 ? 0 : Math.round((total / event.capacity) * 10000) / 100;
    return { total_registrations: total, remaining_capacity: remaining, percentage_used: percent };
};
exports.getStats = getStats;
const registerUser = async (eventId, name, email) => {
    // create or get user
    if (!name || !email)
        throw { status: 400, message: 'Name and email required' };
    const client = await index_js_1.default.connect();
    try {
        await client.query('BEGIN');
        // Lock event row
        const ev = await eventRepo.lockEventForUpdate(client, eventId);
        if (!ev)
            throw { status: 404, message: 'Event not found' };
        const now = new Date();
        if (new Date(ev.starts_at) <= now)
            throw { status: 400, message: 'Cannot register for past events' };
        const regCountRes = await client.query('SELECT count(*)::int as cnt FROM registrations WHERE event_id=$1', [eventId]);
        const current = parseInt(regCountRes.rows[0].cnt, 10);
        if (current >= ev.capacity)
            throw { status: 400, message: 'Event is full' };
        // ensure user exists
        const user = await userRepo.createUser(name, email);
        // check duplicate registration (should be zero rows before insert)
        const existsRes = await client.query('SELECT 1 FROM registrations WHERE event_id=$1 AND user_id=$2', [eventId, user.id]);
        if ((existsRes?.rowCount ?? 0) > 0)
            throw { status: 400, message: 'User already registered' };
        // insert registration
        await client.query('INSERT INTO registrations(event_id, user_id) VALUES($1,$2)', [eventId, user.id]);
        await client.query('COMMIT');
        return { user_id: user.id };
    }
    catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }
    finally {
        client.release();
    }
};
exports.registerUser = registerUser;
const cancelRegistration = async (eventId, userId) => {
    const removed = await regRepo.removeRegistration(eventId, userId);
    if (!removed)
        throw { status: 404, message: 'Registration not found' };
    return { ok: true };
};
exports.cancelRegistration = cancelRegistration;
