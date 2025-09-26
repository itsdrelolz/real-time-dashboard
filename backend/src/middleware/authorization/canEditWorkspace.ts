import prisma from "@/utils/prismaClient";
import { AuthenticatedRequest } from "../authMiddleware";
import { Response, NextFunction } from "express";

export const isUserWorkspaceOwner = async (userId: string, workspaceId: string) => {
  const workspace = await prisma.workspace.findFirst({
    where: { id: workspaceId, creatorId: userId },
    include: {
      creator: true,
    },
  });
  return !!workspace;
};

export const canEditWorkspace = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.uid;
  const workspaceId = req.params.workspaceId;

  if (!userId || !workspaceId) {
    return res
      .status(400)
      .json({ error: "Invalid workspace ID or missing user ID." });
  }

  const isOwner = await isUserWorkspaceOwner(userId, workspaceId);
  if (!isOwner) {
    return res
      .status(403)
      .json({ error: "Forbidden: You are not the owner of this workspace." });
  }
  next();
};
