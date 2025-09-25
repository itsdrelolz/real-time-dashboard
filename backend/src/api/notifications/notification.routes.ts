import { authMiddleware } from "@/middleware/authMiddleware";
import { Router } from "express";
import {
  saveTokenController,
  getNotificationsController,
  getUnreadCountController,
  markAsReadController,
  markAllAsReadController,
  deleteNotificationController,
} from "./notification.controller";

const router: Router = Router();

router.use(authMiddleware);

// FCM token management
router.post("/save-token", saveTokenController);

// Notification management
router.get("/", getNotificationsController);
router.get("/unread-count", getUnreadCountController);
router.put("/:notificationId/read", markAsReadController);
router.put("/mark-all-read", markAllAsReadController);
router.delete("/:notificationId", deleteNotificationController);

export default router;
