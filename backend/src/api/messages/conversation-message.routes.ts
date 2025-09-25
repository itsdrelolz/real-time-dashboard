import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import {
  createConversationMessageController,
  getConversationMessagesController,
  deleteMessageController,
} from "./message.controller";

const router: Router = Router();

// All routes require authentication
router.use(authMiddleware);

// Create a message in a conversation
router.post("/", createConversationMessageController);

// Get messages for a conversation
router.get("/:conversationId", getConversationMessagesController);

// Delete a message
router.delete("/:messageId", deleteMessageController);

export default router;
