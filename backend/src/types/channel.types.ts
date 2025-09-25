import { Channel, Message, User } from "@prisma/client";

type PublicUser = Pick<User, "id" | "username" | "photoURL">;

export type MessageWithAuthor = Message & {
  author: PublicUser;
};

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
  "id" | "name" | "description" | "createdAt" | "projectId"
>;

export type CreateMessageBody = {
  content: string;
};

/**
 * Include the messages for the channel along with author details for the messages
 */
export type ChannelDetailsResponse = BasicChannelResponse & {
  messages: MessageWithAuthor[];
};
