import { Request, Response, NextFunction } from 'express';

export const validateCarInput = (req: Request, res: Response, next: NextFunction) => {
  const { title, description } = req.body;
  const errors: string[] = [];

  if (!title || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }

  if (!description || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters long');
  }

  let tags;
  try {
    tags = JSON.parse(req.body.tags);
    if (typeof tags !== 'object' || !tags.carType || !tags.company) {
      errors.push('Tags must include at least carType and company');
    }
  } catch {
    errors.push('Invalid tags format');
  }

  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    errors.push('At least one image is required');
  }

  if (files && files.length > 10) {
    errors.push('Maximum 10 images allowed');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validateUserInput = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name } = req.body;
  const errors: string[] = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Invalid email address');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }


  if (req.path === '/signup' && (!name || name.trim().length < 2)) {
    errors.push('Name must be at least 2 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  next();
};
