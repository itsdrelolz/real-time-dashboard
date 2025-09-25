import dotenv from "dotenv";
dotenv.config();
import "./firebaseAdmin";

import app from "./api/app";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { initializeSocketIO } from "./sockets";
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

initializeSocketIO(io);

const PORT = process.env.PORT || 3000;

// Add error handling for server startup
httpServer.on("error", (error: any) => {
  console.error("Server error:", error);
  process.exit(1);
});

httpServer.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || "not set"}`);
  console.log(`Database URL: ${process.env.DATABASE_URL ? "set" : "not set"}`);
});
