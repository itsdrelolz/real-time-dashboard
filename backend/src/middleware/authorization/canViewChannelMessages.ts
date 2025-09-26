import prisma from "@/utils/prismaClient";
import { AuthenticatedRequest } from "../authMiddleware";
import { Response, NextFunction } from "express";

export const canViewChannelMessages = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.uid;
  const channelId = req.params.channelId;

  if (!userId || !channelId) {
    return res
      .status(400)
      .json({ error: "Invalid channel ID or missing user ID." });
  }

  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
    include: {
      workspace: {
        include: {
          members: true,
        },
      },
    },
  });

  if (!channel) {
    return res.status(404).json({ error: "Channel not found." });
  }

  const isWorkspaceMember = channel.workspace.members.some(
    (member) => member.userId === userId,
  );
  const isWorkspaceOwner = channel.workspace.creatorId === userId;

  if (!isWorkspaceMember && !isWorkspaceOwner) {
    return res.status(403).json({
      error:
        "Forbidden: You must be a member of the workspace to view channel messages.",
    });
  }

  next();
};
