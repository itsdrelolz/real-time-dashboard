import { Server, Socket } from "socket.io";
import { registerMessageHandlers } from "./messageHandlers";
import { getUserFromToken, AuthenticatedUser } from "../services/auth.service";

export interface AuthenticatedSocket extends Socket {
  user?: AuthenticatedUser | null;
}

/*
 * This function is used to initialize the socket.io server.
 * It is used to initialize the socket.io server.
 */

export const initializeSocketIO = (io: Server) => {
  io.use(async (socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;
    console.log("Socket authentication attempt:", {
      token: !!token,
      socketId: socket.id,
    });

    if (!token) {
      console.log("Socket auth failed: No token provided");
      return next(new Error("Authentication error: No token provided."));
    }

    try {
      const userProfile = await getUserFromToken(token);
      if (!userProfile) {
        console.log("Socket auth failed: Invalid token");
        return next(new Error("Authentication error: Invalid token."));
      }
      socket.user = userProfile;
      console.log(
        "Socket authenticated successfully:",
        userProfile.profile?.username || userProfile.uid,
      );
      next();
    } catch (error) {
      console.error("Socket authentication failed:", error);
      return next(new Error("Authentication error."));
    }
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    console.log(
      `User connected: ${socket.user?.profile?.username || socket.user?.uid} (${socket.id})`,
    );

    registerMessageHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(
        `User disconnected: ${socket.user?.profile?.username || socket.user?.uid}`,
      );
    });
  });
};
