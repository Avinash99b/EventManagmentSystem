import express from 'express';
import cors from 'cors';
import eventsRouter from './routes/events.js';
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/events', eventsRouter);
app.get('/', (_req, res) => res.json({ ok: true, service: 'Event Management API' }));
// global error handler
app.use((err, _req, res, _next) => {
    const status = err?.status || 500;
    const message = err?.message || 'Internal Server Error';
    res.status(status).json({ error: message });
});
export default app;
