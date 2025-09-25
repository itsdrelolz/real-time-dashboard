import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import { conversationService } from "./conversation.service";

// Create a new conversation
export async function createConversationController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { participantIds } = req.body;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (
      !participantIds ||
      !Array.isArray(participantIds) ||
      participantIds.length === 0
    ) {
      return res.status(400).json({ error: "Participant IDs are required" });
    }

    const conversation = await conversationService.createConversation(
      { participantIds },
      userId,
    );

    return res.status(201).json({
      message: "Conversation created successfully",
      conversation,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Get all conversations for user
export async function getConversationsController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const conversations =
      await conversationService.getUserConversations(userId);

    return res.status(200).json({ conversations });
  } catch (error) {
    console.error("Error getting conversations:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Get conversation by ID
export async function getConversationController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { id } = req.params;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!id) {
      return res.status(400).json({ error: "Conversation ID is required" });
    }

    const conversation = await conversationService.getConversationById(
      id,
      userId,
    );

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    return res.status(200).json({ conversation });
  } catch (error) {
    console.error("Error getting conversation:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Update conversation
export async function updateConversationController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { id } = req.params;
    const { participantIds } = req.body;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!id) {
      return res.status(400).json({ error: "Conversation ID is required" });
    }

    const conversation = await conversationService.updateConversation(
      id,
      userId,
      { participantIds },
    );

    return res.status(200).json({
      message: "Conversation updated successfully",
      conversation,
    });
  } catch (error) {
    console.error("Error updating conversation:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Delete conversation
export async function deleteConversationController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { id } = req.params;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!id) {
      return res.status(400).json({ error: "Conversation ID is required" });
    }

    await conversationService.deleteConversation(id, userId);

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Add participant to conversation
export async function addParticipantController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { id } = req.params;
    const { participantId } = req.body;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!id || !participantId) {
      return res
        .status(400)
        .json({ error: "Conversation ID and participant ID are required" });
    }

    const conversation = await conversationService.addParticipant(
      id,
      userId,
      participantId,
    );

    return res.status(200).json({
      message: "Participant added successfully",
      conversation,
    });
  } catch (error) {
    console.error("Error adding participant:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Remove participant from conversation
export async function removeParticipantController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { id, userId: participantId } = req.params;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!id || !participantId) {
      return res
        .status(400)
        .json({ error: "Conversation ID and participant ID are required" });
    }

    const conversation = await conversationService.removeParticipant(
      id,
      userId,
      participantId,
    );

    return res.status(200).json({
      message: "Participant removed successfully",
      conversation,
    });
  } catch (error) {
    console.error("Error removing participant:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
