import prisma from "@/utils/prismaClient";
import { AuthenticatedRequest } from "../authMiddleware";
import { Response, NextFunction } from "express";

export const isUserProjectOwner = async (userId: string, projectId: string) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, creatorId: userId },
    include: {
      creator: true,
    },
  });
  return !!project;
};

export const canEditProject = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.uid;
  const projectId = req.params.projectId;

  if (!userId || !projectId) {
    return res
      .status(400)
      .json({ error: "Invalid project ID or missing user ID." });
  }

  const isOwner = await isUserProjectOwner(userId, projectId);
  if (!isOwner) {
    return res
      .status(403)
      .json({ error: "Forbidden: You are not the owner of this project." });
  }
  next();
};
