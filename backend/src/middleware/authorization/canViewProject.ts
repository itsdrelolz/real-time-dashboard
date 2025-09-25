import prisma from "@/utils/prismaClient";
import { AuthenticatedRequest } from "../authMiddleware";
import { Response, NextFunction } from "express";

/*
 * if the user is a member of the project, they can view the project
 *
 */

export const isUserProjectMember = async (
  userId: string,
  projectId: string,
) => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        members: { some: { id: userId } },
      },
    });
    return !!project;
  } catch (error) {
    console.error("Failed to check project membership", error);
    return false;
  }
};

export const canViewProject = async (
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

  const isMember = await isUserProjectMember(userId, projectId);
  if (!isMember) {
    return res
      .status(403)
      .json({ error: "Forbidden: You are not a member of this project." });
  }
  next();
};
