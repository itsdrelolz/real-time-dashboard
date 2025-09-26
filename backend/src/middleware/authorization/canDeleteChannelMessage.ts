import prisma from "@/utils/prismaClient";
import { AuthenticatedRequest } from "../authMiddleware";
import { Response, NextFunction } from "express";

/*
 * For channel messages: Only workspace owner OR message creator can delete
 * Channel messages belong to a workspace, so workspace owner has override rights
 */

export const canDeleteChannelMessage = async (
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

  // Get message with author and channel info (including workspace)
  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: {
      author: true,
      channel: {
        include: {
          workspace: true,
        },
      },
    },
  });

  if (!message) {
    return res.status(404).json({ error: "Message not found." });
  }

  // Check if this is actually a channel message
  if (!message.channel) {
    return res.status(400).json({ error: "This is not a channel message." });
  }

  // Check if user is message creator
  const isMessageCreator = message.authorId === userId;

  // Check if user is workspace owner
  const isWorkspaceOwner = message.channel.workspace.creatorId === userId;

  if (!isMessageCreator && !isWorkspaceOwner) {
    return res.status(403).json({
      error:
        "Forbidden: You can only delete your own messages or messages in channels of workspaces you own.",
    });
  }

  next();
};
