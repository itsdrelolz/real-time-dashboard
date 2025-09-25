import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import { messageService } from "./message.service";
import { requireAuth } from "../../utils/authUtils";

// Get conversation messages
export async function getConversationMessagesController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { conversationId } = req.params;
    const userId = requireAuth(req, res);
    const { limit = 50, offset = 0 } = req.query;

    if (!userId) return; // Response already sent by requireAuth

    if (!conversationId) {
      return res.status(400).json({ error: "Conversation ID is required" });
    }

    const messages = await messageService.getConversationMessages(
      conversationId,
      userId,
      Number(limit),
      Number(offset),
    );

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Error getting conversation messages:", error);
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Send message to conversation
export async function sendConversationMessageController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    const userId = requireAuth(req, res);

    if (!userId) return; // Response already sent by requireAuth

    if (!conversationId || !content) {
      return res
        .status(400)
        .json({ error: "Conversation ID and content are required" });
    }

    const message = await messageService.createMessage(
      { content },
      userId,
      undefined,
      conversationId,
    );

    return res
      .status(201)
      .json({ message: "Message sent successfully", data: message });
  } catch (error) {
    console.error("Error sending conversation message:", error);
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Get channel messages
export async function getChannelMessagesController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { channelId } = req.params;
    const userId = requireAuth(req, res);
    const { limit = 50, offset = 0 } = req.query;

    if (!userId) return; // Response already sent by requireAuth

    if (!channelId) {
      return res.status(400).json({ error: "Channel ID is required" });
    }

    const messages = await messageService.getChannelMessages(
      channelId,
      userId,
      Number(limit),
      Number(offset),
    );

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Error getting channel messages:", error);
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Send message to channel
export async function sendChannelMessageController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { channelId } = req.params;
    const { content } = req.body;
    const userId = requireAuth(req, res);

    if (!userId) return; // Response already sent by requireAuth

    if (!channelId || !content) {
      return res
        .status(400)
        .json({ error: "Channel ID and content are required" });
    }

    const message = await messageService.createMessage(
      { content },
      userId,
      channelId,
      undefined,
    );

    return res
      .status(201)
      .json({ message: "Message sent successfully", data: message });
  } catch (error) {
    console.error("Error sending channel message:", error);
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Edit a message
export async function editMessageController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = requireAuth(req, res);

    if (!userId) return; // Response already sent by requireAuth

    if (!id || !content) {
      return res
        .status(400)
        .json({ error: "Message ID and content are required" });
    }

    const message = await messageService.updateMessage(id, content, userId);

    return res
      .status(200)
      .json({ message: "Message updated successfully", data: message });
  } catch (error) {
    console.error("Error updating message:", error);
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({ error: error.message });
    }
    if (error instanceof Error && error.message.includes("not the author")) {
      return res.status(403).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Delete a message
export async function deleteMessageController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { id } = req.params;
    const userId = requireAuth(req, res);

    if (!userId) return; // Response already sent by requireAuth

    if (!id) {
      return res.status(400).json({ error: "Message ID is required" });
    }

    await messageService.deleteMessage(id, userId);

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting message:", error);
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({ error: error.message });
    }
    if (error instanceof Error && error.message.includes("not the author")) {
      return res.status(403).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Mark message as read
export async function markMessageAsReadController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { id } = req.params;
    const userId = requireAuth(req, res);

    if (!userId) return; // Response already sent by requireAuth

    if (!id) {
      return res.status(400).json({ error: "Message ID is required" });
    }

    await messageService.markMessageAsRead(id, userId);

    return res.status(200).json({ message: "Message marked as read" });
  } catch (error) {
    console.error("Error marking message as read:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
