import type { Message as PrismaMessage } from "@prisma/client";
import type { PublicProfile } from "./profile.types";

export type Message = PrismaMessage;

export type MessageWithAuthor = Message & {
  author: PublicProfile;
};

export type CreateChannelMessageData = Pick<
  Message,
  "content" | "authorId" | "channelId"
>;

export type CreateConversationMessageData = Pick<
  Message,
  "content" | "authorId" | "conversationId"
>;


