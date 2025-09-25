import prisma from "@/utils/prismaClient";
import { AuthenticatedRequest } from "../authMiddleware";
import { Response, NextFunction } from "express";

/*
 * any user who is a member of the project can create a task
 */

// You can create a function like this:
export const canEditTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.uid;
  const taskId = req.params.taskId;

  // Get the task with its project info
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: true },
  });

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  // Check if user is either:
  // 1. The task creator, OR
  // 2. The project owner
  const isTaskCreator = task.creatorId === userId;
  const isProjectOwner = task.project.creatorId === userId;

  if (!isTaskCreator && !isProjectOwner) {
    return res.status(403).json({
      error:
        "Forbidden: You can only edit tasks you created or tasks in projects you own",
    });
  }

  next();
};
