import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import connectDB from "./db/db"
import { env } from "./config/env";
connectDB();
app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});