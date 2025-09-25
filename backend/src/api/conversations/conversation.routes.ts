import { authenticateMiddleware } from "@/middleware/authMiddleware";
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
import { sanitizeFields } from "@/middleware/sanitizer";
import { canConversate } from "@/middleware/authorization/canConversate";
import { validateConversationId } from "@/validators/indexValidator";

const router: Router = Router();

router.use(authenticateMiddleware);

// Conversation management routes
router.get("/", getConversationsController);
router.post(
  "/",
  sanitizeFields(["name", "description"]),
  createConversationController,
);
router.get(
  "/:id",
  validateConversationId,
  canConversate,
  getConversationController,
);
router.put(
  "/:id",
  validateConversationId,
  canConversate,
  sanitizeFields(["name", "description"]),
  updateConversationController,
);
router.delete(
  "/:id",
  validateConversationId,
  canConversate,
  deleteConversationController,
);

// Participant management
router.post(
  "/:id/participants",
  validateConversationId,
  canConversate,
  sanitizeFields(["userId"]),
  addParticipantController,
);
router.delete(
  "/:id/participants/:userId",
  validateConversationId,
  canConversate,
  removeParticipantController,
);

export default router;
