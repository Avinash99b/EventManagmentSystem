import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as service from '../services/eventService';

const handleValidation = (req: Request) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors.array().map((e) => `${e.param}: ${e.msg}`).join(', ');
    throw { status: 400, message: msg };
  }
};

export const createEvent = async (req: Request, res: Response) => {
  handleValidation(req);
  const { title, starts_at, location, capacity } = req.body;
  const result = await service.createEvent({ title, starts_at, location, capacity });
  return res.status(201).json({ id: result.id });
};

export const getEvent = async (req: Request, res: Response) => {
  const result = await service.getEventDetails(req.params.id);
  return res.json(result);
};

export const listUpcoming = async (_req: Request, res: Response) => {
  const list = await service.listUpcoming();
  return res.json(list);
};

export const getStats = async (req: Request, res: Response) => {
  const stats = await service.getStats(req.params.id);
  return res.json(stats);
};

export const register = async (req: Request, res: Response) => {
  handleValidation(req);
  const { name, email } = req.body;
  const result = await service.registerUser(req.params.id, name, email);
  return res.status(201).json(result);
};

export const cancel = async (req: Request, res: Response) => {
  const { userId } = req.body;
  if (!userId) throw { status: 400, message: 'userId required' };
  const result = await service.cancelRegistration(req.params.id, userId);
  return res.json(result);
};
