import type { Channel as PrismaChannel } from "@prisma/client";

export type Channel = PrismaChannel;

export type CreateChannelData = Pick<
  Channel,
  "name" | "projectId" | "description"
>;

export type CreateTaskChannelData = Pick<
  Channel,
  "name" | "projectId" | "taskId"
>;
