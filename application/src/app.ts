import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import applicationRoutes from "./routes/application.routes";

//middlewares
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api/applications", applicationRoutes);

export default app;
