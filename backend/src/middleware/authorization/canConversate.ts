import prisma from "@/utils/prismaClient";
import { AuthenticatedRequest } from "../authMiddleware";
import { Response, NextFunction } from "express";

/*
 * if the user is a participant of the conversation, they can conversate
 * this function will work for messages as well
 */

export const isUserConversationParticipant = async (
  userId: string,
  conversationId: string,
) => {
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, participants: { some: { id: userId } } },
  });
  return !!conversation;
};

export const canConversate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { conversationId } = req.params;
  const userId = req.user?.uid;

  if (!userId || !conversationId) {
    return res
      .status(400)
      .json({ error: "Invalid conversation ID or missing user ID." });
  }

  const isParticipant = await isUserConversationParticipant(
    userId,
    conversationId,
  );
  if (!isParticipant) {
    return res.status(403).json({
      error: "Forbidden: You are not a participant of this conversation.",
    });
  }
  next();
};
