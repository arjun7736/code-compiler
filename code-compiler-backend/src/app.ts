import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import compilerRoutes from "./routes/compilerRoutes";
import cors from "cors"
import prePullImages from "./utils/pre-pull-images";
import { whySlow } from "why-api-slow";

dotenv.config();

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(whySlow())

app.use("/api/compiler",compilerRoutes);

// Call pre-pull images on startup
prePullImages();
export default app;
