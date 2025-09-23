import type { Connection as PrismaConnection, ConnectionStatus as PrismaConnectionStatus } from "@prisma/client";

export type Connection = PrismaConnection;

export type CreateConnectionData = Pick<Connection, "requesterId" | "addresseeId">;

export type ConnectionStatus = PrismaConnectionStatus;



