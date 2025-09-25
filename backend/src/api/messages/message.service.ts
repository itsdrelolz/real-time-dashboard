import prisma from "../../utils/prismaClient";
import {
  MessageWithAuthor,
  CreateMessageBody,
  ChannelMessageResponse,
  DirectMessageResponse,
  MessageResponse,
} from "../../types/message.types";

class MessageService {
  // Create a message (generic - can be for channel or conversation)
  public async createMessage(
    messageData: CreateMessageBody,
    authorId: string,
    channelId?: string,
    conversationId?: string,
  ): Promise<MessageWithAuthor> {
    try {
      // Validate that message belongs to either channel or conversation, not both
      if (channelId && conversationId) {
        throw new Error(
          "Message cannot belong to both channel and conversation",
        );
      }
      if (!channelId && !conversationId) {
        throw new Error(
          "Message must belong to either channel or conversation",
        );
      }

      const newMessage = await prisma.message.create({
        data: {
          content: messageData.content,
          authorId: authorId,
          channelId: channelId || null,
          conversationId: conversationId || null,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              photoURL: true,
            },
          },
        },
      });
      return newMessage;
    } catch (error) {
      console.error("Failed to create message", error);
      throw error;
    }
  }

  // Get messages for a conversation
  public async getConversationMessages(
    conversationId: string,
    userId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<DirectMessageResponse[]> {
    try {
      // Verify user is participant in conversation
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          participants: {
            some: { id: userId },
          },
        },
      });

      if (!conversation) {
        throw new Error("Conversation not found or access denied");
      }

      const messages = await prisma.message.findMany({
        where: {
          conversationId: conversationId,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              photoURL: true,
            },
          },
          conversation: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      });

      return messages as DirectMessageResponse[];
    } catch (error) {
      console.error("Failed to get conversation messages", error);
      throw error;
    }
  }

  // Get messages for a channel
  public async getChannelMessages(
    channelId: string,
    userId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<ChannelMessageResponse[]> {
    try {
      // Verify user has access to channel through project membership
      const channel = await prisma.channel.findFirst({
        where: {
          id: channelId,
          project: {
            members: {
              some: { id: userId },
            },
          },
        },
        include: {
          project: true,
        },
      });

      if (!channel) {
        throw new Error("Channel not found or access denied");
      }

      const messages = await prisma.message.findMany({
        where: {
          channelId: channelId,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              photoURL: true,
            },
          },
          channel: {
            select: {
              id: true,
              name: true,
              description: true,
              createdAt: true,
              projectId: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      });

      return messages as ChannelMessageResponse[];
    } catch (error) {
      console.error("Failed to get channel messages", error);
      throw error;
    }
  }

  // Get a single message by ID
  public async getMessageById(
    messageId: string,
    userId: string,
  ): Promise<MessageResponse | null> {
    try {
      const message = await prisma.message.findFirst({
        where: {
          id: messageId,
          OR: [
            {
              channel: {
                project: {
                  members: {
                    some: { id: userId },
                  },
                },
              },
            },
            {
              conversation: {
                participants: {
                  some: { id: userId },
                },
              },
            },
          ],
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              photoURL: true,
            },
          },
          channel: {
            select: {
              id: true,
              name: true,
              description: true,
              createdAt: true,
              projectId: true,
            },
          },
          conversation: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      return message as MessageResponse;
    } catch (error) {
      console.error("Failed to get message by id", error);
      throw error;
    }
  }

  // Update a message
  public async updateMessage(
    messageId: string,
    content: string,
    userId: string,
  ): Promise<MessageWithAuthor> {
    try {
      // Verify user is the author of the message
      const message = await prisma.message.findFirst({
        where: {
          id: messageId,
          authorId: userId,
        },
      });

      if (!message) {
        throw new Error("Message not found or you are not the author");
      }

      const updatedMessage = await prisma.message.update({
        where: { id: messageId },
        data: { content },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              photoURL: true,
            },
          },
        },
      });

      return updatedMessage;
    } catch (error) {
      console.error("Failed to update message", error);
      throw error;
    }
  }

  // Delete a message
  public async deleteMessage(messageId: string, userId: string): Promise<void> {
    try {
      // Verify user is the author of the message
      const message = await prisma.message.findFirst({
        where: {
          id: messageId,
          authorId: userId,
        },
      });

      if (!message) {
        throw new Error("Message not found or you are not the author");
      }

      await prisma.message.delete({
        where: { id: messageId },
      });
    } catch (error) {
      console.error("Failed to delete message", error);
      throw error;
    }
  }

  // Mark message as read
  public async markMessageAsRead(
    messageId: string,
    userId: string,
  ): Promise<void> {
    try {
      await prisma.messageReadStatus.upsert({
        where: {
          userId_messageId: {
            userId: userId,
            messageId: messageId,
          },
        },
        update: {
          readAt: new Date(),
        },
        create: {
          userId: userId,
          messageId: messageId,
          readAt: new Date(),
        },
      });
    } catch (error) {
      console.error("Failed to mark message as read", error);
      throw error;
    }
  }
}

export const messageService = new MessageService();
