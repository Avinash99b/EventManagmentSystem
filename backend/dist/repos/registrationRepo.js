"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRegistrationsForEvent = exports.isUserRegistered = exports.removeRegistration = exports.addRegistration = void 0;
const index_js_1 = require("../db/index.js");
const addRegistration = async (client, r) => {
    await client.query('INSERT INTO registrations(event_id,user_id) VALUES($1,$2)', [r.event_id, r.user_id]);
};
exports.addRegistration = addRegistration;
const removeRegistration = async (eventId, userId) => {
    const { rowCount } = await index_js_1.pool.query('DELETE FROM registrations WHERE event_id=$1 AND user_id=$2', [eventId, userId]);
    if (!rowCount)
        return false;
    return rowCount > 0;
};
exports.removeRegistration = removeRegistration;
const isUserRegistered = async (eventId, userId) => {
    const { rows } = await index_js_1.pool.query('SELECT true as exists FROM registrations WHERE event_id=$1 AND user_id=$2', [eventId, userId]);
    return rows.length > 0;
};
exports.isUserRegistered = isUserRegistered;
const listRegistrationsForEvent = async (eventId) => {
    const { rows } = await index_js_1.pool.query(`SELECT u.id, u.name, u.email, r.registered_at
     FROM registrations r
     JOIN users u ON u.id = r.user_id
     WHERE r.event_id = $1
     ORDER BY r.registered_at ASC`, [eventId]);
    return rows;
};
exports.listRegistrationsForEvent = listRegistrationsForEvent;
