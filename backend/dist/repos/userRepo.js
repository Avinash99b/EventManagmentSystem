"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmail = exports.getUserById = exports.createUser = void 0;
const index_js_1 = require("../db/index.js");
const createUser = async (name, email) => {
    const { rows } = await index_js_1.pool.query('INSERT INTO users(name,email) VALUES($1,$2) ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name RETURNING *', [name, email]);
    return rows[0];
};
exports.createUser = createUser;
const getUserById = async (id) => {
    const { rows } = await index_js_1.pool.query('SELECT * FROM users WHERE id=$1', [id]);
    return rows[0] ?? null;
};
exports.getUserById = getUserById;
const getUserByEmail = async (email) => {
    const { rows } = await index_js_1.pool.query('SELECT * FROM users WHERE email=$1', [email]);
    return rows[0] ?? null;
};
exports.getUserByEmail = getUserByEmail;
