import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import {
  getDMEligibleUsersController,
  createConversationController,
  getUserConversationsController,
  canCreateDMController
} from "./conversation.controller";
import conversationMessageRouter from "../messages/conversation-message.routes";

const router: Router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get users eligible for DM (share at least one project)
router.get("/dm-eligible", getDMEligibleUsersController);

// Check if two users can create a DM
router.get("/can-create-dm", canCreateDMController);

// Create a new conversation/DM
router.post("/", createConversationController);

// Get all conversations for the current user
router.get("/", getUserConversationsController);

// Conversation messages routes
router.use("/:conversationId/messages", conversationMessageRouter);

export default router;
