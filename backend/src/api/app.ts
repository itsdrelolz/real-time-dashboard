import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./auth/auth.router";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", router);
app.get("/api", (_req, res) => {
  res.send("API is running");
});

export default app;
