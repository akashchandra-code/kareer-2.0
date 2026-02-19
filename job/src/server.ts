import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { connectDB } from './db/db';
import { env } from './config/env';

// Connect to the database
connectDB();

const PORT = env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});