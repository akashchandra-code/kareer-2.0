import mongoose from "mongoose";
import { env } from "../config/env";

 const  connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("Mongo connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;