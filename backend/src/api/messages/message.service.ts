import {ChannelMessageResponse, ConversationMessageResponse, CreateMessageBody,} from "../../types/message.types";
import prisma from "../../utils/prismaClient";
import {Message} from "@prisma/client";

class MessageService {
  public async createMessage(
    messageData: CreateMessageBody,
    authorId: string,
    channelId?: string,
    conversationId?: string,
  ): Promise<Message> {
    try {
        return await prisma.message.create({
          data: {
              content: messageData.content,
              authorId: authorId,
              channelId: channelId,
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
          },
      });
    } catch (error) {
      console.error("Failed to create message", error);
      throw error;
    }
  }

  public async getMessageById(messageId: string): Promise<Message | null> {
    try {
        return await prisma.message.findUnique({
          where: {id: messageId},
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
    } catch (error) {
      console.error("Failed to get message by id", error);
      throw error;
    }
  }

  public async updateMessage(
    messageId: string,
    userId: string,
    messageData: CreateMessageBody,
  ): Promise<Message> {
    try {
        return await prisma.message.update({
          where: {id: messageId},
          data: {
              content: messageData.content,
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
    } catch (error) {
      console.error("Failed to update message", error);
      throw error;
    }
  }

  public async deleteMessage(messageId: string): Promise<Message> {
    try {
        return await prisma.message.delete({
          where: {id: messageId},
      });
    } catch (error) {
      console.error("Failed to delete message", error);
      throw error;
    }
  }

  public async getChannelMessages(
    channelId: string,
    userId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<ChannelMessageResponse[]> {
    try {
      // Verify user has access to channel through workspace membership
      const channel = await prisma.channel.findFirst({
        where: {
          id: channelId,
          workspace: {
            members: {
              some: { userId: userId },
            },
          },
        },
        include: {
          workspace: true,
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
              workspaceId: true,
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

  public async getConversationMessages(
    conversationId: string,
    userId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<ConversationMessageResponse[]> {
    try {
      // Verify user is a participant in the conversation
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          participants: {
            some: { userId: userId },
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

      return messages as ConversationMessageResponse[];
    } catch (error) {
      console.error("Failed to get conversation messages", error);
      throw error;
    }
  }

  public async getMessagesForUser(
    userId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<Message[]> {
    try {
        return await prisma.message.findMany({
          where: {
              OR: [
                  {
                      channel: {
                          workspace: {
                              members: {
                                  some: {userId: userId},
                              },
                          },
                      },
                  },
                  {
                      conversation: {
                          participants: {
                              some: {userId: userId},
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
                      workspaceId: true,
                  },
              },
          },
          orderBy: {createdAt: "desc"},
          take: limit,
          skip: offset,
      });
    } catch (error) {
      console.error("Failed to get messages for user", error);
      throw error;
    }
  }
}

export const messageService = new MessageService();