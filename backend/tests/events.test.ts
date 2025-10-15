// Provide minimal ambient declarations for Jest globals so this test file
// typechecks without requiring @types/jest to be installed.
declare function describe(name: string, fn: () => void): void;
declare function test(name: string, fn: () => Promise<void> | void): void;
declare function beforeAll(fn: () => Promise<void> | void): void;
declare function afterAll(fn: () => Promise<void> | void): void;
declare function beforeEach(fn: () => Promise<void> | void): void;
declare var expect: any;

import * as supertest from 'supertest';
const request = (supertest as any).default ?? supertest;
import app from '../src/app';
import dotenv from 'dotenv';
import path from 'path';
import { Pool } from 'pg';
dotenv.config({ path: path.resolve(__dirname, '..', '.env.test') });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const clearAll = async () => {
  await pool.query('TRUNCATE TABLE registrations, users, events RESTART IDENTITY CASCADE');
};

beforeAll(async () => {
  // ensure schema was applied in jest.setup.ts but double-check connectivity
  const client = await pool.connect();
  // immediately release the client so pool.end() can terminate cleanly
  client.release();
});

afterAll(async () => {
  await clearAll();
  await pool.end();
});

beforeEach(async () => {
  await clearAll();
});

describe('Events API', () => {
  let eventId: string;

  test('create event -> 201 and returns id', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({ title: 'Test event', starts_at: new Date(Date.now() + 1000 * 60 * 60).toISOString(), location: 'Hall A', capacity: 10 });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeTruthy();
    eventId = res.body.id;
  });

  test('get event details and list upcoming', async () => {
    // Create event first
    const create = await request(app)
      .post('/api/events')
      .send({ title: 'List event', starts_at: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), location: 'Hall B', capacity: 5 });
    expect(create.status).toBe(201);
    const id = create.body.id;

    const get = await request(app).get(`/api/events/${id}`);
    expect(get.status).toBe(200);
    expect(get.body.id).toBe(id);

    const list = await request(app).get('/api/events');
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.find((e: any) => e.id === id)).toBeTruthy();
  });

  test('get stats, register and cancel flow', async () => {
    const create = await request(app)
      .post('/api/events')
      .send({ title: 'Reg event', starts_at: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(), location: 'Hall C', capacity: 2 });
    expect(create.status).toBe(201);
    const id = create.body.id;

    const stats1 = await request(app).get(`/api/events/${id}/stats`);
    expect(stats1.status).toBe(200);
    expect(stats1.body.total_registrations).toBe(0);

    // register a user
    const reg = await request(app).post(`/api/events/${id}/register`).send({ name: 'Alice', email: 'alice@example.com' });
    expect(reg.status).toBe(201);
    expect(reg.body.user_id).toBeTruthy();
    const userId = reg.body.user_id;

    const stats2 = await request(app).get(`/api/events/${id}/stats`);
    expect(stats2.body.total_registrations).toBe(1);

    // duplicate registration should fail
    const dup = await request(app).post(`/api/events/${id}/register`).send({ name: 'Alice', email: 'alice@example.com' });
    expect(dup.status).toBe(400);

    // cancel
    const cancel = await request(app).post(`/api/events/${id}/cancel`).send({ userId });
    expect(cancel.status).toBe(200);
    expect(cancel.body.ok).toBe(true);

    const stats3 = await request(app).get(`/api/events/${id}/stats`);
    expect(stats3.body.total_registrations).toBe(0);
  });
});
