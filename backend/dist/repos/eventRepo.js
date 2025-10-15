import { pool } from '../db/index.js';
export const createEvent = async (e) => {
    const { rows } = await pool.query('INSERT INTO events(title, starts_at, location, capacity) VALUES($1,$2,$3,$4) RETURNING id', [e.title, e.starts_at, e.location, e.capacity]);
    return rows[0];
};
export const getEventById = async (id) => {
    const { rows } = await pool.query('SELECT * FROM events WHERE id=$1', [id]);
    return rows[0] ?? null;
};
export const listUpcomingEvents = async () => {
    const now = new Date().toISOString();
    const { rows } = await pool.query('SELECT * FROM events WHERE starts_at > $1', [now]);
    return rows;
};
export const getRegistrationCount = async (eventId) => {
    const { rows } = await pool.query('SELECT count(*)::text as count FROM registrations WHERE event_id=$1', [eventId]);
    return parseInt(rows[0]?.count ?? '0', 10);
};
// Lock event row FOR UPDATE to safely check remaining capacity inside a transaction
export const lockEventForUpdate = async (client, eventId) => {
    const { rows } = await client.query('SELECT * FROM events WHERE id=$1 FOR UPDATE', [eventId]);
    return rows[0] ?? null;
};
