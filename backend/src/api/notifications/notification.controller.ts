import { Response } from "express";
import { notificationService } from "./notification.service";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";

// Save FCM token
export const saveTokenController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.uid;
    const { token } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!token || typeof token !== "string") {
      return res.status(400).json({ error: "Invalid token" });
    }

    const updatedUser = await notificationService.saveUserNotificationToken(
      userId,
      token,
    );
    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Error saving user notification token:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get user's notifications
export const getNotificationsController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.uid;
    const { limit = 20, offset = 0, unreadOnly = false } = req.query;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await notificationService.getUserNotifications(
      userId,
      Number(limit),
      Number(offset),
      unreadOnly === "true",
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error getting notifications:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get unread count
export const getUnreadCountController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const count = await notificationService.getUnreadCount(userId);
    return res.status(200).json({ unreadCount: count });
  } catch (error) {
    console.error("Error getting unread count:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Mark notification as read
export const markAsReadController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.uid;
    const { notificationId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!notificationId) {
      return res.status(400).json({ error: "Notification ID is required" });
    }

    await notificationService.markNotificationAsRead(notificationId, userId);
    return res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Mark all notifications as read
export const markAllAsReadController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await notificationService.markAllNotificationsAsRead(userId);
    return res
      .status(200)
      .json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Delete notification
export const deleteNotificationController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.uid;
    const { notificationId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!notificationId) {
      return res.status(400).json({ error: "Notification ID is required" });
    }

    await notificationService.deleteNotification(notificationId, userId);
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
