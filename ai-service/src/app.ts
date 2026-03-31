import express from 'express';
const app =express();
import cookieParser from 'cookie-parser';
import aiRoutes from './routes/ai.routes'


app.use(express.json());
app.use(cookieParser());

app.use('/api/ai',aiRoutes);

export default app;