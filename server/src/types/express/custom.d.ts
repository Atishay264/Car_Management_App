import { Request } from 'express';
import { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user: IUser; 
  [x: string]: any; 
  files?: Express.Multer.File[];
}