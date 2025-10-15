import { pool } from '../db/index.js';
export const createUser = async (name, email) => {
    const { rows } = await pool.query('INSERT INTO users(name,email) VALUES($1,$2) ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name RETURNING *', [name, email]);
    return rows[0];
};
export const getUserById = async (id) => {
    const { rows } = await pool.query('SELECT * FROM users WHERE id=$1', [id]);
    return rows[0] ?? null;
};
export const getUserByEmail = async (email) => {
    const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    return rows[0] ?? null;
};
