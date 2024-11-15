import express from 'express';
import cors from 'cors';
import carRoutes from './routes/carRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/cars', carRoutes);
app.use('/api/auth', authRoutes);

export default app;
