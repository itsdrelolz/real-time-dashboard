import prisma from "@/utils/prismaClient";
import { AuthenticatedRequest } from "../authMiddleware";
import { Response, NextFunction } from "express";

export const canManageNotification = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.uid;
  const notificationId = req.params.notificationId;

  if (!userId || !notificationId) {
    return res
      .status(400)
      .json({ error: "Invalid notification ID or missing user ID." });
  }

  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    return res.status(404).json({ error: "Notification not found." });
  }

  if (notification.recipientId !== userId) {
    return res.status(403).json({
      error: "Forbidden: You can only manage your own notifications.",
    });
  }

  next();
};
