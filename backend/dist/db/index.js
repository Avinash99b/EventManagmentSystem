"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/eventdb';
exports.pool = new pg_1.Pool({ connectionString });
exports.default = exports.pool;
