import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import compilerRoutes from "./routes/compilerRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/compiler",compilerRoutes);

export default app;
