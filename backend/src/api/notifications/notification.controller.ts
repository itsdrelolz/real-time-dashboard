import { Response } from "express";
import { notificationService } from "./notification.service";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import { requireAuth } from "../../utils/authUtils";

// Save FCM token
export const saveTokenController = async (req: AuthenticatedRequest, res: Response) => {
  const userId = requireAuth(req, res);
  const { token } = req.body;

  if (!userId) return; // Response already sent by requireAuth

  if (!token || typeof token !== "string") {
    return res.status(400).json({ error: "Invalid token" });
  }

  try {
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
export const getNotificationsController = async (req: AuthenticatedRequest, res: Response) => {
  const userId = requireAuth(req, res);
  const { limit = 20, offset = 0, unreadOnly = false } = req.query;

  if (!userId) return; // Response already sent by requireAuth

  try {
    const result = await notificationService.getUserNotifications(
      userId,
      Number(limit),
      Number(offset),
      unreadOnly === 'true'
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error getting notifications:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get unread count
export const getUnreadCountController = async (req: AuthenticatedRequest, res: Response) => {
  const userId = requireAuth(req, res);

  if (!userId) return; // Response already sent by requireAuth

  try {
    const count = await notificationService.getUnreadCount(userId);
    return res.status(200).json({ unreadCount: count });
  } catch (error) {
    console.error("Error getting unread count:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Mark notification as read
export const markAsReadController = async (req: AuthenticatedRequest, res: Response) => {
  const userId = requireAuth(req, res);
  const { notificationId } = req.params;

  if (!userId) return; // Response already sent by requireAuth

  if (!notificationId) {
    return res.status(400).json({ error: "Notification ID is required" });
  }

  try {
    await notificationService.markNotificationAsRead(notificationId, userId);
    return res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Mark all notifications as read
export const markAllAsReadController = async (req: AuthenticatedRequest, res: Response) => {
  const userId = requireAuth(req, res);

  if (!userId) return; // Response already sent by requireAuth

  try {
    await notificationService.markAllNotificationsAsRead(userId);
    return res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Delete notification
export const deleteNotificationController = async (req: AuthenticatedRequest, res: Response) => {
  const userId = requireAuth(req, res);
  const { notificationId } = req.params;

  if (!userId) return; // Response already sent by requireAuth

  if (!notificationId) {
    return res.status(400).json({ error: "Notification ID is required" });
  }

  try {
    await notificationService.deleteNotification(notificationId, userId);
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
