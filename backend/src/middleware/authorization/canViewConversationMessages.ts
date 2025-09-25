import prisma from "@/utils/prismaClient";
import { AuthenticatedRequest } from "../authMiddleware";
import { Response, NextFunction } from "express";

export const canViewConversationMessages = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.uid;
  const conversationId = req.params.conversationId;

  if (!userId || !conversationId) {
    return res
      .status(400)
      .json({ error: "Invalid conversation ID or missing user ID." });
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      participants: true,
    },
  });

  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found." });
  }

  const isParticipant = conversation.participants.some(
    (participant) => participant.id === userId,
  );

  if (!isParticipant) {
    return res.status(403).json({
      error:
        "Forbidden: You must be a participant of the conversation to view messages.",
    });
  }

  next();
};
