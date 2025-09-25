import { Request, Response, NextFunction } from "express";
import { validate as isUuid } from "uuid";

export const validateProjectId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { projectId } = req.params;
  if (!isUuid(projectId)) {
    return res.status(400).json({ error: "Invalid project ID format" });
  }
  next();
};

export const validateChannelId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { channelId } = req.params;
  if (!isUuid(channelId)) {
    return res.status(400).json({ error: "Invalid channel ID format" });
  }
  next();
};

export const validateTaskId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { taskId } = req.params;
  if (!isUuid(taskId)) {
    return res.status(400).json({ error: "Invalid task ID format" });
  }
  next();
};

export const validateConversationId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid conversation ID format" });
  }
  next();
};
