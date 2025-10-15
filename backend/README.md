n# Event Management API - Backend

This directory contains the backend for the Event Management API built with Node.js, Express and TypeScript using an MVC architecture. PostgreSQL is used as the database. A Docker Compose setup is provided to run Postgres locally.

Features implemented in this scaffold:
- Project structure (MVC)
- PostgreSQL Docker Compose and initialization SQL
- TypeScript setup and scripts
- Basic routes and controllers for events and registrations
- Validation, error handling and concurrency-safe registration (transaction + row locking)

Quick start (local with Docker):

1. Copy environment variables:

```bash
cp backend/.env.example backend/.env
```

2. Start Postgres with Docker Compose:

```bash
docker compose -f backend/docker-compose.yml up -d
```

3. Install dependencies and build/run the server:

```bash
cd backend
npm install
npm run build
npm start
```

4. The server will run on http://localhost:4000 by default.

Endpoints (high level):
- POST /api/events - create an event
- GET /api/events/:id - get event details
- POST /api/events/:id/register - register a user for an event
- POST /api/events/:id/cancel - cancel a user's registration
- GET /api/events - list upcoming events (sorted)
- GET /api/events/:id/stats - event statistics

Notes and next steps:
- Add authentication (not included in scaffold)
- Add tests (unit/integration) — recommended next step
- Add migrations (e.g., with Knex or TypeORM) for production

Integration tests and metrics dashboard
-------------------------------------

This project includes an integration test suite that uses testcontainers to start a PostgreSQL container, runs the built server against that DB, executes API flows (including concurrent registration checks), and produces simple performance metrics.

How it works:
- Tests are implemented with Jest and Supertest under `backend/tests`.
- A small metrics server is started during tests which receives summaries posted by the test runner (autocannon results) and serves them at `/metrics` so you can inspect them while tests run.
- Tests exercise edge cases: duplicate registrations, full events, past-event registration prevention, concurrent registration stress.

Run tests:

```bash
cd backend
npm install
npm test
```

Notes:
- Tests will download Docker images (Postgres) via Testcontainers — ensure Docker is running and available to your user.
- The test run will build the project first and then start the server; this requires `npm run build` to succeed.
- Metrics are kept in-memory in the test-run metrics server; for persistent or production metrics consider Prometheus/Grafana.

