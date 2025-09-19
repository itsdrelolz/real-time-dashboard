import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import { default as authRouter } from "./auth/auth.routes";
import { default as projectRouter } from "./projects/project.routes";
import { default as taskRouter } from "./tasks/task.routes";
import helmet from "helmet";
import { errorHandler } from "../middleware/errorHandler";

const app: Application = express();
app.use(helmet());

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    optionsSuccessStatus: 200,
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});

app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);
app.use("/api", taskRouter);
app.get("/api", (_req, res) => {
    res.send("API is running");
});

app.use(errorHandler);

export default app;