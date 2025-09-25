import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import {
  createConversationMessage,
  getMessagesForConversation,
  deleteMessage,
} from "./message.service";
import prisma from "../../utils/prismaClient";

/**
 * Create a message in a conversation (DM)
 */
export async function createConversationMessageController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { conversationId, content } = req.body;
    const authorId = req.user?.id;

    if (!authorId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!conversationId || !content) {
      return res
        .status(400)
        .json({ error: "Conversation ID and content are required" });
    }

    const message = await createConversationMessage({
      conversationId,
      content,
      authorId,
    });

    return res.status(201).json({ message });
  } catch (error) {
    console.error("Error creating conversation message:", error);

    if (error instanceof Error) {
      if (
        error.message.includes("not found") ||
        error.message.includes("not authorized")
      ) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes("must share at least one project")) {
        return res.status(403).json({ error: error.message });
      }
    }

    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get messages for a conversation
 */
export async function getConversationMessagesController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { conversationId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "Conversation ID is required" });
    }

    // TODO: Add authorization check to ensure user is participant in conversation
    const messages = await getMessagesForConversation(conversationId);

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Error getting conversation messages:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Delete a message
 */
export async function deleteMessageController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { messageId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!messageId) {
      return res.status(400).json({ error: "Message ID is required" });
    }

    await deleteMessage(messageId, userId);

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting message:", error);

    if (
      error instanceof Error &&
      (error.message.includes("not found") ||
        error.message.includes("not authorized"))
    ) {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get messages for a channel
 */
export async function getMessagesForChannelController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { channelId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Channel ID is required" });
    }

    // Verify user has access to this channel (is member of the project)
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      include: {
        project: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const isMember = channel.project.members.some(
      (member) => member.profileId === userId,
    );
    if (!isMember) {
      return res
        .status(403)
        .json({ error: "You don't have access to this channel" });
    }

    const messages = await prisma.message.findMany({
      where: { channelId },
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

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Error getting channel messages:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
