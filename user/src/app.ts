import  express  from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api/users", userRoutes);

export default app;