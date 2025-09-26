import { authenticateMiddleware } from "@/middleware/authMiddleware";
import { Router } from "express";
import {
  saveTokenController,
  removeTokenController,
  validateTokenController,
  getNotificationsController,
  getUnreadCountController,
  markAsReadController,
  markAllAsReadController,
  deleteNotificationController,
  getNotificationSettingsController,
  updateNotificationSettingsController,
  resetNotificationSettingsController,
} from "./notification.controller";
import { canManageNotification } from "@/middleware/authorization/canManageNotification";

const router: Router = Router();

router.use(authenticateMiddleware);

// FCM token management
router.post("/save-token", saveTokenController);
router.delete("/remove-token", removeTokenController);
router.get("/validate-token", validateTokenController);

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

// Notification settings
router.get("/settings", getNotificationSettingsController);
router.put("/settings", updateNotificationSettingsController);
router.post("/settings/reset", resetNotificationSettingsController);

export default router;
