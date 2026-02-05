import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import connectDB from "./db/db"

connectDB();
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});