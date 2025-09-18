import dotenv from "dotenv";
dotenv.config();

import app from "./api/app";
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import {initializeSocketIO} from "@/sockets";
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  }
})


initializeSocketIO(io);



const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});