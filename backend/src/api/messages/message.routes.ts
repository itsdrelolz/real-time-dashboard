import { authMiddleware } from "@/middleware/authMiddleware";
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

const router: Router = Router();

router.use(authMiddleware);

// Specific routes first (to avoid conflicts with generic :id routes)
// Conversation messages
router.get("/conversations/:conversationId", getConversationMessagesController);
router.post(
  "/conversations/:conversationId",
  sendConversationMessageController,
);

// Channel messages
router.get("/channels/:channelId", getChannelMessagesController);
router.post("/channels/:channelId", sendChannelMessageController);

// Generic message management routes last (to avoid conflicts)
router.put("/:id", editMessageController);
router.delete("/:id", deleteMessageController);
router.post("/:id/read", markMessageAsReadController);

export default router;
