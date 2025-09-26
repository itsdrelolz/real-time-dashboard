import prisma from "@/utils/prismaClient";
import { AuthenticatedRequest } from "../authMiddleware";
import { Response, NextFunction } from "express";

/*
 * if the user is a member of the workspace, they can view the workspace
 *
 */

export const isUserWorkspaceMember = async (
  userId: string,
  workspaceId: string,
) => {
  try {
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        members: { some: { userId: userId } },
      },
    });
    return !!workspace;
  } catch (error) {
    console.error("Failed to check workspace membership", error);
    return false;
  }
};

export const canViewWorkspace = async (
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

  const isMember = await isUserWorkspaceMember(userId, workspaceId);
  if (!isMember) {
    return res
      .status(403)
      .json({ error: "Forbidden: You are not a member of this workspace." });
  }
  next();
};
