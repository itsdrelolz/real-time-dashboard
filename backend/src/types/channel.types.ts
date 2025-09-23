import type { Channel as PrismaChannel } from "@prisma/client";

export type Channel = PrismaChannel;


export type CreateChannelData = Pick<Channel, "name" | "projectId" | "topic">;



export type UpdateChannelData = 
    | { name: string; topic?: string }
    | { name?: string; topic: string }
    | { name: string; topic: string };




