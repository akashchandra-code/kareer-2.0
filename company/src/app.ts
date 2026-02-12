import  express  from "express";
import cookieParser from "cookie-parser";
import companyRoutes from "./routes/company.routes";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api/company", companyRoutes);

export default app;