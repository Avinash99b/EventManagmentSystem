import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import eventsRouter from './routes/events';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/events', eventsRouter);

app.get('/', (_req: Request, res: Response) => res.json({ ok: true, service: 'Event Management API' }));

// global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
	const status = err?.status || 500;
	const message = err?.message || 'Internal Server Error';
	res.status(status).json({ error: message });
});

export default app;
