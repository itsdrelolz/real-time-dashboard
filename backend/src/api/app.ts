import express from "express";
import cors from "cors";
import morgan from "morgan";
import { default as authRouter } from './auth/auth.routes';
import { default as projectRouter } from './projects/project.routes';
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);
app.get("/api", (_req, res) => {
  res.send("API is running");
});

export default app;
