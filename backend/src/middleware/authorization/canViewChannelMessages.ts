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
      project: {
        include: {
          members: true,
        },
      },
    },
  });

  if (!channel) {
    return res.status(404).json({ error: "Channel not found." });
  }

  const isProjectMember = channel.project.members.some(
    (member) => member.id === userId,
  );
  const isProjectOwner = channel.project.creatorId === userId;

  if (!isProjectMember && !isProjectOwner) {
    return res.status(403).json({
      error:
        "Forbidden: You must be a member of the project to view channel messages.",
    });
  }

  next();
};
