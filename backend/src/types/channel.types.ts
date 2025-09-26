import { Channel, Message } from "@prisma/client";

export type CreateChannelBody = {
  name: string;
  description?: string;
};

export type UpdateChannelBody = {
  name?: string;
  description?: string;
};

export type BasicChannelResponse = Pick<
  Channel,
  "id" | "name" | "description" | "createdAt" | "workspaceId"
>;

/**
 * Include the messages for the channel along with author details for the messages
 */
export type ChannelDetailsResponse = BasicChannelResponse & {
  messages: Message[];
};
