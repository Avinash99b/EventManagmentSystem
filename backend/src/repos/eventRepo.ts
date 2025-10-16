import { pool } from '../db/index';
import { Event } from '../models/types';

export const createEvent = async (e: Omit<Event, 'id'>): Promise<{ id: string }> => {
  const { rows } = await pool.query<{ id: string }>(
    'INSERT INTO events(title, starts_at, location, capacity) VALUES($1,$2,$3,$4) RETURNING id',
    [e.title, e.starts_at, e.location, e.capacity]
  );
  return rows[0];
};

export const getEventById = async (id: string): Promise<Event | null> => {
  const { rows } = await pool.query<Event>('SELECT * FROM events WHERE id=$1', [id]);
  return rows[0] ?? null;
};

export const listUpcomingEvents = async (): Promise<Event[]> => {
  const now = new Date().toISOString();
  const { rows } = await pool.query<Event>('SELECT * FROM events WHERE starts_at > $1', [now]);
  return rows;
};

export const getRegistrationCount = async (eventId: string): Promise<number> => {
  const { rows } = await pool.query<{ count: string }>('SELECT count(*)::text as count FROM registrations WHERE event_id=$1', [eventId]);
  return parseInt(rows[0]?.count ?? '0', 10);
};

// Lock event row FOR UPDATE to safely check remaining capacity inside a transaction
export const lockEventForUpdate = async (client: any, eventId: string): Promise<Event | null> => {
  const { rows } = await client.query('SELECT * FROM events WHERE id=$1 FOR UPDATE', [eventId]);
  return rows[0] ?? null;
};
