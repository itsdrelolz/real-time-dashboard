import { authenticateMiddleware } from "@/middleware/authMiddleware";
import { Router } from "express";
import {
  saveTokenController,
  getNotificationsController,
  getUnreadCountController,
  markAsReadController,
  markAllAsReadController,
  deleteNotificationController,
} from "./notification.controller";
import { canManageNotification } from "@/middleware/authorization/canManageNotification";

const router: Router = Router();

router.use(authenticateMiddleware);

// FCM token management
router.post("/save-token", saveTokenController);

// Notification management
router.get("/", getNotificationsController);
router.get("/unread-count", getUnreadCountController);
router.put(
  "/:notificationId/read",
  canManageNotification,
  markAsReadController,
);
router.put("/mark-all-read", markAllAsReadController);
router.delete(
  "/:notificationId",
  canManageNotification,
  deleteNotificationController,
);

export default router;
