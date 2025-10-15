# Event Management API - Backend

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
