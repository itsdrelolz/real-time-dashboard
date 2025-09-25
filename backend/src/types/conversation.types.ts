import { Conversation, User } from "@prisma/client";

type PublicUser = Pick<User, "id" | "username" | "photoURL">;

// Base conversation type
export type ConversationWithParticipants = Conversation & {
  participants: PublicUser[];
};

// For creating a new conversation
export type CreateConversationBody = {
  participantIds: string[];
};

// Basic conversation response (without participants)
export type BasicConversationResponse = Pick<
  Conversation,
  "id" | "createdAt" | "updatedAt"
>;

// Full conversation response with participants
export type ConversationResponse = BasicConversationResponse & {
  participants: PublicUser[];
  messageCount?: number;
  lastMessage?: {
    id: string;
    content: string;
    createdAt: Date;
    author: PublicUser;
  };
};

// For conversation list views
export type ConversationListItem = BasicConversationResponse & {
  participants: PublicUser[];
  lastMessage?: {
    content: string;
    createdAt: Date;
    author: PublicUser;
  };
  unreadCount?: number;
};
