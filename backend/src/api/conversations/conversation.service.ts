import prisma from "../../utils/prismaClient";
import { 
  ConversationWithParticipants,
  CreateConversationBody,
  ConversationResponse,
  ConversationListItem
} from "../../types/conversation.types";

class ConversationService {
  // Create a new conversation
  public async createConversation(
    conversationData: CreateConversationBody,
    creatorId: string
  ): Promise<ConversationResponse> {
    try {
      // Verify all participants exist
      const participants = await prisma.user.findMany({
        where: {
          id: { in: conversationData.participantIds }
        },
        select: {
          id: true,
          username: true,
          photoURL: true,
        }
      });

      if (participants.length !== conversationData.participantIds.length) {
        throw new Error("One or more participants not found");
      }

      // Add creator to participants if not already included
      const allParticipantIds = [...new Set([creatorId, ...conversationData.participantIds])];

      const conversation = await prisma.conversation.create({
        data: {
          participants: {
            connect: allParticipantIds.map(id => ({ id }))
          }
        },
        include: {
          participants: {
            select: {
              id: true,
              username: true,
              photoURL: true,
            }
          }
        }
      });

      return conversation as ConversationResponse;
    } catch (error) {
      console.error("Failed to create conversation", error);
      throw error;
    }
  }

  // Get all conversations for a user
  public async getUserConversations(userId: string): Promise<ConversationListItem[]> {
    try {
      const conversations = await prisma.conversation.findMany({
        where: {
          participants: {
            some: { id: userId }
          }
        },
        include: {
          participants: {
            select: {
              id: true,
              username: true,
              photoURL: true,
            }
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  photoURL: true,
                }
              }
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });

      return conversations.map(conv => ({
        id: conv.id,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
        participants: conv.participants,
        lastMessage: conv.messages[0] ? {
          content: conv.messages[0].content,
          createdAt: conv.messages[0].createdAt,
          author: conv.messages[0].author
        } : undefined
      }));
    } catch (error) {
      console.error("Failed to get user conversations", error);
      throw error;
    }
  }

  // Get conversation by ID
  public async getConversationById(
    conversationId: string, 
    userId: string
  ): Promise<ConversationResponse | null> {
    try {
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          participants: {
            some: { id: userId }
          }
        },
        include: {
          participants: {
            select: {
              id: true,
              username: true,
              photoURL: true,
            }
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  photoURL: true,
                }
              }
            }
          }
        }
      });

      if (!conversation) {
        return null;
      }

      return {
        id: conversation.id,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        participants: conversation.participants,
        messageCount: await prisma.message.count({
          where: { conversationId: conversationId }
        }),
        lastMessage: conversation.messages[0] ? {
          id: conversation.messages[0].id,
          content: conversation.messages[0].content,
          createdAt: conversation.messages[0].createdAt,
          author: conversation.messages[0].author
        } : undefined
      };
    } catch (error) {
      console.error("Failed to get conversation by id", error);
      throw error;
    }
  }

  // Update conversation (mainly for updating participants)
  public async updateConversation(
    conversationId: string,
    userId: string,
    updateData: Partial<CreateConversationBody>
  ): Promise<ConversationResponse> {
    try {
      // Verify user is participant
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          participants: {
            some: { id: userId }
          }
        }
      });

      if (!conversation) {
        throw new Error("Conversation not found or access denied");
      }

      const updatedConversation = await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          participants: updateData.participantIds ? {
            set: updateData.participantIds.map(id => ({ id }))
          } : undefined
        },
        include: {
          participants: {
            select: {
              id: true,
              username: true,
              photoURL: true,
            }
          }
        }
      });

      return updatedConversation as ConversationResponse;
    } catch (error) {
      console.error("Failed to update conversation", error);
      throw error;
    }
  }

  // Delete conversation
  public async deleteConversation(
    conversationId: string,
    userId: string
  ): Promise<void> {
    try {
      // Verify user is participant
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          participants: {
            some: { id: userId }
          }
        }
      });

      if (!conversation) {
        throw new Error("Conversation not found or access denied");
      }

      await prisma.conversation.delete({
        where: { id: conversationId }
      });
    } catch (error) {
      console.error("Failed to delete conversation", error);
      throw error;
    }
  }

  // Add participant to conversation
  public async addParticipant(
    conversationId: string,
    userId: string,
    participantId: string
  ): Promise<ConversationResponse> {
    try {
      // Verify user is participant
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          participants: {
            some: { id: userId }
          }
        }
      });

      if (!conversation) {
        throw new Error("Conversation not found or access denied");
      }

      // Verify new participant exists
      const newParticipant = await prisma.user.findUnique({
        where: { id: participantId }
      });

      if (!newParticipant) {
        throw new Error("Participant not found");
      }

      const updatedConversation = await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          participants: {
            connect: { id: participantId }
          }
        },
        include: {
          participants: {
            select: {
              id: true,
              username: true,
              photoURL: true,
            }
          }
        }
      });

      return updatedConversation as ConversationResponse;
    } catch (error) {
      console.error("Failed to add participant", error);
      throw error;
    }
  }

  // Remove participant from conversation
  public async removeParticipant(
    conversationId: string,
    userId: string,
    participantId: string
  ): Promise<ConversationResponse> {
    try {
      // Verify user is participant
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          participants: {
            some: { id: userId }
          }
        }
      });

      if (!conversation) {
        throw new Error("Conversation not found or access denied");
      }

      const updatedConversation = await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          participants: {
            disconnect: { id: participantId }
          }
        },
        include: {
          participants: {
            select: {
              id: true,
              username: true,
              photoURL: true,
            }
          }
        }
      });

      return updatedConversation as ConversationResponse;
    } catch (error) {
      console.error("Failed to remove participant", error);
      throw error;
    }
  }
}

export const conversationService = new ConversationService();
