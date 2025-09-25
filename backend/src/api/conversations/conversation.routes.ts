import { authMiddleware } from "@/middleware/authMiddleware";
import { Router } from "express";
import {
  createConversationController,
  getConversationsController,
  getConversationController,
  updateConversationController,
  deleteConversationController,
  addParticipantController,
  removeParticipantController,
} from "./conversation.controller";

const router: Router = Router();

router.use(authMiddleware);

// Conversation management routes
router.get("/", getConversationsController);
router.post("/", createConversationController);
router.get("/:id", getConversationController);
router.put("/:id", updateConversationController);
router.delete("/:id", deleteConversationController);

// Participant management
router.post("/:id/participants", addParticipantController);
router.delete("/:id/participants/:userId", removeParticipantController);

export default router;
