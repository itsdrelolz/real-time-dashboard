import { authenticateMiddleware } from "@/middleware/authMiddleware";
import { Router } from "express";
import {
  getConversationMessagesController,
  sendConversationMessageController,
  getChannelMessagesController,
  sendChannelMessageController,
  editMessageController,
  deleteMessageController,
  markMessageAsReadController,
} from "./message.controller";
import { sanitizeFields } from "@/middleware/sanitizer";
import { canDeleteChannelMessage } from "@/middleware/authorization/canDeleteChannelMessage";
import { canDeleteConversationMessage } from "@/middleware/authorization/canDeleteConversationMessage";
import { canEditMessage } from "@/middleware/authorization/canEditMessage";
import { canViewChannelMessages } from "@/middleware/authorization/canViewChannelMessages";
import { canViewConversationMessages } from "@/middleware/authorization/canViewConversationMessages";

const router: Router = Router();

router.use(authenticateMiddleware);

// Specific routes first (to avoid conflicts with generic :id routes)
// Conversation messages
router.get(
  "/conversations/:conversationId",
  canViewConversationMessages,
  getConversationMessagesController,
);
router.post(
  "/conversations/:conversationId",
  canViewConversationMessages,
  sanitizeFields(["content"]),
  sendConversationMessageController,
);

// Channel messages
router.get(
  "/channels/:channelId",
  canViewChannelMessages,
  getChannelMessagesController,
);
router.post(
  "/channels/:channelId",
  canViewChannelMessages,
  sanitizeFields(["content"]),
  sendChannelMessageController,
);

// Generic message management routes last (to avoid conflicts)
router.put(
  "/:id",
  canEditMessage,
  sanitizeFields(["content"]),
  editMessageController,
);

// Separate delete routes for different message types
router.delete(
  "/channels/:id",
  canDeleteChannelMessage,
  deleteMessageController,
);
router.delete(
  "/conversations/:id",
  canDeleteConversationMessage,
  deleteMessageController,
);

router.post("/:id/read", markMessageAsReadController);

export default router;
