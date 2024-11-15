// server/src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';

export const validateCarInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }
  
  next();
};