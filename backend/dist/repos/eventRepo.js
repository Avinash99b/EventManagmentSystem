"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lockEventForUpdate = exports.getRegistrationCount = exports.listUpcomingEvents = exports.getEventById = exports.createEvent = void 0;
const index_js_1 = require("../db/index.js");
const createEvent = async (e) => {
    const { rows } = await index_js_1.pool.query('INSERT INTO events(title, starts_at, location, capacity) VALUES($1,$2,$3,$4) RETURNING id', [e.title, e.starts_at, e.location, e.capacity]);
    return rows[0];
};
exports.createEvent = createEvent;
const getEventById = async (id) => {
    const { rows } = await index_js_1.pool.query('SELECT * FROM events WHERE id=$1', [id]);
    return rows[0] ?? null;
};
exports.getEventById = getEventById;
const listUpcomingEvents = async () => {
    const now = new Date().toISOString();
    const { rows } = await index_js_1.pool.query('SELECT * FROM events WHERE starts_at > $1', [now]);
    return rows;
};
exports.listUpcomingEvents = listUpcomingEvents;
const getRegistrationCount = async (eventId) => {
    const { rows } = await index_js_1.pool.query('SELECT count(*)::text as count FROM registrations WHERE event_id=$1', [eventId]);
    return parseInt(rows[0]?.count ?? '0', 10);
};
exports.getRegistrationCount = getRegistrationCount;
// Lock event row FOR UPDATE to safely check remaining capacity inside a transaction
const lockEventForUpdate = async (client, eventId) => {
    const { rows } = await client.query('SELECT * FROM events WHERE id=$1 FOR UPDATE', [eventId]);
    return rows[0] ?? null;
};
exports.lockEventForUpdate = lockEventForUpdate;
