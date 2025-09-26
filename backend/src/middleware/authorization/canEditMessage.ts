import prisma from "@/utils/prismaClient";
import { AuthenticatedRequest } from "../authMiddleware";
import { Response, NextFunction } from "express";

export const canEditMessage = async (
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

  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: {
      author: true,
      channel: {
        include: {
          workspace: true,
        },
      },
      conversation: true,
    },
  });

  if (!message) {
    return res.status(404).json({ error: "Message not found." });
  }

  const isMessageCreator = message.authorId === userId;

  // For channel messages, workspace owner can also edit
  const isWorkspaceOwner = message.channel?.workspace?.creatorId === userId;

  if (!isMessageCreator && !isWorkspaceOwner) {
    return res.status(403).json({
      error:
        "Forbidden: You can only edit your own messages or messages in channels of workspaces you own.",
    });
  }

  next();
};
