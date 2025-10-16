# Event Management API — Backend

This folder contains the backend for the Event Management API. It's a Node.js + Express app written in TypeScript and structured with a simple MVC-style layout. PostgreSQL is the database and a Docker Compose file is provided to run a local Postgres instance for development.

What this backend provides
- REST endpoints to create/list events, register/cancel attendees, and fetch per-event stats
- Concurrency-safe registration logic using a DB transaction and row locking
- Initialization SQL to create the schema in `initdb/01_schema.sql`
- An integration test suite using Jest + Supertest and Testcontainers to run a real Postgres instance during tests

Quick start (local with Docker)

1. Copy example environment variables into the backend folder:

```bash
cp backend/.env.example backend/.env
```

2. Start Postgres with Docker Compose (this runs the DB used by the app during development):

```bash
docker compose -f backend/docker-compose.yml up -d
```

3. Install dependencies, build and start the server:

```bash
cd backend
npm install
npm run build
npm start
```

By default the server listens on http://localhost:4000 (see `.env` for PORT/DATABASE_URL overrides).

Available endpoints (high level)
- POST /api/events — create a new event. Body: { title, starts_at, location, capacity }
- GET /api/events — list upcoming events (sorted)
- GET /api/events/:id — get event details
- GET /api/events/:id/stats — get registration statistics for an event
- POST /api/events/:id/register — register a user for an event. Body: { name, email }
- POST /api/events/:id/cancel — cancel a registration. Body: { userId }

Integration tests (Jest + Supertest)

The project includes integration tests under `backend/tests`. These tests:
- Build and run the compiled server against a Postgres instance referenced by `backend/.env.test`
- Use Supertest to exercise the public HTTP API and verify behavior (including concurrent registration scenarios)

Run the tests locally (Docker required if you use the provided docker-compose DB)

```bash
cd backend
npm install
npm test
```

Important notes for tests
- Tests do not depend on Testcontainers. Instead they expect a reachable Postgres database whose connection string is provided in `backend/.env.test` (the test suite loads this file).
- You can start a local Postgres for tests using the repository's docker-compose (from the repo root):

```bash
docker compose -f backend/docker-compose.yml up -d
```

- Tests will create and truncate tables — they expect the schema from `initdb/01_schema.sql` to be available to the test DB or to be applied prior to running tests.

Development tips and next steps
- Add authentication (JWT or sessions) to protect endpoints
- Add a proper migration tool (Knex, TypeORM, Flyway) and convert the SQL in `initdb/` into migration files
- Increase test coverage with unit tests (logic in `services/`) and more integration tests (edge/error cases)
- Consider persisting metrics (Prometheus/Grafana) rather than the in-memory metrics used only for test runs

Troubleshooting
- If tests fail due to DB connection errors: verify Docker is running and `DATABASE_URL`/`.env.test` are correct
- If port 4000 is already in use: change PORT in `.env` or stop the conflicting service
- If TypeScript build fails: run `npm run build` and address any reported type errors

Files of interest
- `src/` — application source (controllers, services, repos)
- `initdb/01_schema.sql` — DB schema used for local/dev DB initialization
- `docker-compose.yml` — starts a Postgres DB for development
- `tests/` — integration tests that exercise the API

License / Notes
- This scaffold focuses on demonstrating patterns and edge-case handling (e.g., concurrent registration). It is not production-ready and lacks authentication, migrations, and other hardening steps.
