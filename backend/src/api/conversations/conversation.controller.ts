import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import {
  createConversation,
  getDMEligibleUsers,
  getUserConversations,
  canCreateDM,
} from "./conversation.service";

/**
 * Get users eligible for DM (share at least one project)
 */
export async function getDMEligibleUsersController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const eligibleUsers = await getDMEligibleUsers(userId);

    return res.status(200).json({ users: eligibleUsers });
  } catch (error) {
    console.error("Error getting DM eligible users:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Create a new conversation/DM between two users
 */
export async function createConversationController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const userId = req.user?.id;
    const { otherUserId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!otherUserId) {
      return res.status(400).json({ error: "Other user ID is required" });
    }

    if (userId === otherUserId) {
      return res
        .status(400)
        .json({ error: "Cannot create conversation with yourself" });
    }

    const conversation = await createConversation(userId, otherUserId);

    return res.status(201).json({
      message: "Conversation created successfully",
      conversation,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);

    if (
      error instanceof Error &&
      error.message.includes("must share at least one project")
    ) {
      return res.status(403).json({
        error: "Users must share at least one project to create a DM",
      });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get all conversations for the current user
 */
export async function getUserConversationsController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const conversations = await getUserConversations(userId);

    return res.status(200).json({ conversations });
  } catch (error) {
    console.error("Error getting user conversations:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Check if two users can create a DM (share at least one project)
 */
export async function canCreateDMController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const userId = req.user?.id;
    const { otherUserId } = req.query;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!otherUserId || typeof otherUserId !== "string") {
      return res.status(400).json({ error: "Other user ID is required" });
    }

    const canCreate = await canCreateDM(userId, otherUserId);

    return res.status(200).json({ canCreate });
  } catch (error) {
    console.error("Error checking DM eligibility:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
