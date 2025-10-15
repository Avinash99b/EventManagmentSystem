import { pool } from '../db/index.js';
import { User } from '../models/types';

export const createUser = async (name: string, email: string): Promise<User> => {
  const { rows } = await pool.query<User>(
    'INSERT INTO users(name,email) VALUES($1,$2) ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name RETURNING *',
    [name, email]
  );
  return rows[0];
};

export const getUserById = async (id: string): Promise<User | null> => {
  const { rows } = await pool.query<User>('SELECT * FROM users WHERE id=$1', [id]);
  return rows[0] ?? null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const { rows } = await pool.query<User>('SELECT * FROM users WHERE email=$1', [email]);
  return rows[0] ?? null;
};
