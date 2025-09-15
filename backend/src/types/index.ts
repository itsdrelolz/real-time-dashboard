export * from "./auth.types";
export * from "./error.types";
export * from "./profile.types";
export * from "./project.types";
export * from "./task.types";


import { Server } from 'socket.io';

declare global {
    namespace Express {
        export interface Request {
            io: Server;
        }
    }
}

// Add the new channel and message types
export * from "./channel.types";
export * from "./message.types";

export type { Role, Status, Priority } from "@prisma/client";
