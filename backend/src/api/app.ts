import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import { default as workspaceRouter } from "@/api/workspaces/workspace.routes";
import { default as conversationRouter } from "./conversations/conversation.routes";
import { default as messageRouter } from "./messages/message.routes";
import helmet from "helmet";
import { errorHandler } from "../middleware/errorHandler";
import { globalLimiter } from "../middleware/rateLimit";

const app: Application = express();



app.disable('x-powered-by');
app.use(helmet());

// App wide rate limiting
app.use(globalLimiter);

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/workspaces", workspaceRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);

app.get("/api", (_req, res) => {
  res.send("API is running");
});

app.use(errorHandler);

export default app;
