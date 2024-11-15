import { Request, Response, NextFunction } from 'express';
import app from '../app';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
};

app.use(errorHandler);