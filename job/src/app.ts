import express from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import jobRoutes from './routes/job.routes';

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/jobs', jobRoutes);


export default app;