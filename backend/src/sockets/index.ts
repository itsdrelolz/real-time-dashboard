import { Server, Socket } from 'socket.io';
import { registerMessageHandlers } from './messageHandlers';
import { getUserFromToken } from '@/api/auth/auth.service';
import type { Profile } from '@/types';

export interface AuthenticatedSocket extends Socket {
  user?: Profile | null;
}

export const initializeSocketIO = (io: Server) => {
  io.use(async (socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error: No token provided.'));
    }

    try {
      const userProfile = await getUserFromToken(token);
      if (!userProfile) {
        return next(new Error('Authentication error: Invalid token.'));
      }
      socket.user = userProfile;
      next();
    } catch (error) {
      console.error("Socket authentication failed:", error);
      return next(new Error('Authentication error.'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.user?.displayName} (${socket.id})`);

    registerMessageHandlers(io, socket);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user?.displayName}`);
    });
  });
};
