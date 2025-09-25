import prisma from "../../utils/prismaClient";
import type { CreateConversationMessageData } from "../../types/message.types";
import { canCreateDM } from "../conversations/conversation.service";

/**
 * Create a message in a conversation (validates shared project membership)
 */
export async function createConversationMessage(
  data: CreateConversationMessageData,
) {
  // Get the conversation and its participants
  const conversation = await prisma.conversation.findUnique({
    where: { id: data.conversationId! },
    include: {
      participants: {
        include: {
          profile: true,
        },
      },
    },
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  // Validate that the author is a participant
  const authorIsParticipant = conversation.participants.some(
    (p: any) => p.profileId === data.authorId,
  );

  if (!authorIsParticipant) {
    throw new Error("You are not a participant in this conversation");
  }

  // Validate that participants share at least one project
  const participantIds = conversation.participants.map((p: any) => p.profileId);
  if (participantIds.length >= 2) {
    const canDM = await canCreateDM(participantIds[0], participantIds[1]);
    if (!canDM) {
      throw new Error("Users must share at least one project to send DMs");
    }
  }

  return await prisma.message.create({
    data: {
      content: data.content,
      authorId: data.authorId,
      conversationId: data.conversationId,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

/**
 * Get messages for a conversation
 */
export async function getMessagesForConversation(conversationId: string) {
  return await prisma.message.findMany({
    where: { conversationId },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

/**
 * Delete a message
 */
export async function deleteMessage(messageId: string, authorId: string) {
  // Verify the message exists and belongs to the author
  const message = await prisma.message.findFirst({
    where: {
      id: messageId,
      authorId: authorId,
    },
  });

  if (!message) {
    throw new Error("Message not found or you are not authorized to delete it");
  }

  return await prisma.message.delete({
    where: { id: messageId },
  });
}
