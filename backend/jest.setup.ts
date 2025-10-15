import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Pool } from 'pg';

// Load .env.test explicitly
dotenv.config({ path: path.resolve(__dirname, '.env.test') });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.warn('No DATABASE_URL found in .env.test - skipping test DB setup');
} else {
  const pool = new Pool({ connectionString });
  const sqlPath = path.resolve(__dirname, 'initdb', '01_schema.sql');
  if (fs.existsSync(sqlPath)) {
    const sql = fs.readFileSync(sqlPath, 'utf8');
    // run the schema to ensure tables exist
    (async () => {
      const client = await pool.connect();
      try {
        await client.query(sql);
      } catch (err) {
        console.error('Failed to initialize test database schema:', err);
      } finally {
        client.release();
        await pool.end();
      }
    })();
  } else {
    console.warn('Schema file not found at', sqlPath);
  }
}
