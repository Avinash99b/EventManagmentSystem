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
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancel = exports.register = exports.getStats = exports.listUpcoming = exports.getEvent = exports.createEvent = void 0;
const express_validator_1 = require("express-validator");
const service = __importStar(require("../services/eventService.js"));
const handleValidation = (req) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const msg = errors.array().map((e) => `${e.param}: ${e.msg}`).join(', ');
        throw { status: 400, message: msg };
    }
};
const createEvent = async (req, res) => {
    handleValidation(req);
    const { title, starts_at, location, capacity } = req.body;
    const result = await service.createEvent({ title, starts_at, location, capacity });
    return res.status(201).json({ id: result.id });
};
exports.createEvent = createEvent;
const getEvent = async (req, res) => {
    const result = await service.getEventDetails(req.params.id);
    return res.json(result);
};
exports.getEvent = getEvent;
const listUpcoming = async (_req, res) => {
    const list = await service.listUpcoming();
    return res.json(list);
};
exports.listUpcoming = listUpcoming;
const getStats = async (req, res) => {
    const stats = await service.getStats(req.params.id);
    return res.json(stats);
};
exports.getStats = getStats;
const register = async (req, res) => {
    handleValidation(req);
    const { name, email } = req.body;
    const result = await service.registerUser(req.params.id, name, email);
    return res.status(201).json(result);
};
exports.register = register;
const cancel = async (req, res) => {
    const { userId } = req.body;
    if (!userId)
        throw { status: 400, message: 'userId required' };
    const result = await service.cancelRegistration(req.params.id, userId);
    return res.json(result);
};
exports.cancel = cancel;
