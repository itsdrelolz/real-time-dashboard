import prisma from "@/utils/prismaClient";
import { AuthenticatedRequest } from "../authMiddleware";
import { Response, NextFunction } from "express";

/*
 * For conversation messages: Only message creator can delete
 * Conversation messages are independent, no project owner override
 */

export const canDeleteConversationMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.uid;
  const messageId = req.params.id;

  if (!userId || !messageId) {
    return res
      .status(400)
      .json({ error: "Invalid message ID or missing user ID." });
  }

  // Get message with author info
  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: {
      author: true,
      conversation: true,
    },
  });

  if (!message) {
    return res.status(404).json({ error: "Message not found." });
  }

  // Check if this is actually a conversation message
  if (!message.conversation) {
    return res
      .status(400)
      .json({ error: "This is not a conversation message." });
  }

  // Check if user is message creator
  const isMessageCreator = message.authorId === userId;

  if (!isMessageCreator) {
    return res.status(403).json({
      error: "Forbidden: You can only delete your own messages.",
    });
  }

  next();
};
