import { Message, User } from "@prisma/client";
import { BasicChannelResponse } from "./channel.types";
import { BasicConversationResponse } from "./conversation.types";

type PublicUser = Pick<User, "id" | "username" | "photoURL">;

// Base message with author
export type MessageWithAuthor = Message & {
  author: PublicUser;
};

// For creating messages
export type CreateMessageBody = {
  content: string;
};

// Base message response (common fields)
export type BasicMessageResponse = Pick<
  Message,
  "id" | "content" | "createdAt" | "authorId"
>;

// Channel message response (includes channel info)
export type ChannelMessageResponse = BasicMessageResponse & {
  channelId: string;
  channel: BasicChannelResponse;
  author: PublicUser;
};

// Direct message response (includes conversation info)
export type DirectMessageResponse = BasicMessageResponse & {
  conversationId: string;
  conversation: BasicConversationResponse;
  author: PublicUser;
};

// Union type for any message response
export type MessageResponse = ChannelMessageResponse | DirectMessageResponse;

// For message details (when you need both channel and conversation context)
export type MessageDetailsResponse = BasicMessageResponse & {
  author: PublicUser;
  channel?: BasicChannelResponse;
  conversation?: BasicConversationResponse;
};

export type ConversationMessageResponse = BasicMessageResponse & {
    conversation: BasicConversationResponse;
}



