import { pool } from '../db/index';
import { Registration } from '../models/types';

export const addRegistration = async (client: any, r: Registration): Promise<void> => {
  await client.query('INSERT INTO registrations(event_id,user_id) VALUES($1,$2)', [r.event_id, r.user_id]);
};

export const removeRegistration = async (eventId: string, userId: string): Promise<boolean> => {
  const { rowCount } = await pool.query('DELETE FROM registrations WHERE event_id=$1 AND user_id=$2', [eventId, userId]);
  if(!rowCount) return false
  return rowCount > 0;
};

export const isUserRegistered = async (eventId: string, userId: string): Promise<boolean> => {
  const { rows } = await pool.query<{ exists: boolean }>('SELECT true as exists FROM registrations WHERE event_id=$1 AND user_id=$2', [eventId, userId]);
  return rows.length > 0;
};

export const listRegistrationsForEvent = async (eventId: string) => {
  const { rows } = await pool.query(
    `SELECT u.id, u.name, u.email, r.registered_at
     FROM registrations r
     JOIN users u ON u.id = r.user_id
     WHERE r.event_id = $1
     ORDER BY r.registered_at ASC`,
    [eventId]
  );
  return rows;
};
