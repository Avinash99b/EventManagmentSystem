import { Router, Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import * as ctrl from '../controllers/eventController.js';

const router = Router();

router.post(
  '/',
  [
    body('title').isString().notEmpty(),
    body('starts_at').isISO8601(),
    body('location').isString().notEmpty(),
    body('capacity').isInt({ min: 1, max: 1000 }),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ctrl.createEvent(req, res);
    } catch (err) {
      next(err);
    }
  }
);

router.get('/:id', [param('id').isUUID()], async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ctrl.getEvent(req, res);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ctrl.listUpcoming(req, res);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/stats', [param('id').isUUID()], async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ctrl.getStats(req, res);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/register', [param('id').isUUID(), body('name').isString(), body('email').isEmail()], async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ctrl.register(req, res);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/cancel', [param('id').isUUID(), body('userId').isUUID()], async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ctrl.cancel(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
