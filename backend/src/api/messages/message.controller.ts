import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import { messageService } from "./message.service";
import { validateMessage } from "@/validators/messageValidator";

// Get conversation messages

export async function getConversationMessagesController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { conversationId } = req.params;
    const userId = req.user?.uid;
    const { limit = 50, offset = 0 } = req.query;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

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
    const validationResult = validateMessage(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Invalid message payload",
        details: validationResult.error.message,
      });
    }
    const validatedData = validationResult.data;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "Conversation ID is required" });
    }

    const message = await messageService.createMessage(
      validatedData,
      userId,
      undefined,
      conversationId,
    );

    return res
      .status(201)
      .json({ message: "Message sent successfully", data: message });
  } catch (error) {
    console.error("Error sending conversation message:", error);
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
    const userId = req.user?.uid;
    const { limit = 50, offset = 0 } = req.query;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

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
    const validationResult = validateMessage(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Invalid message payload",
        details: validationResult.error.message,
      });
    }
    const validatedData = validationResult.data;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Channel ID is required" });
    }

    const message = await messageService.createMessage(
      validatedData,
      userId,
      channelId,
      undefined,
    );

    return res
      .status(201)
      .json({ message: "Message sent successfully", data: message });
  } catch (error) {
    console.error("Error sending channel message:", error);
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
    const validationResult = validateMessage(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Invalid message payload",
        details: validationResult.error.message,
      });
    }
    const validatedData = validationResult.data;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!id) {
      return res.status(400).json({ error: "Message ID is required" });
    }

    const message = await messageService.updateMessage(
      id,
      validatedData.content,
      userId,
    );

    return res
      .status(200)
      .json({ message: "Message updated successfully", data: message });
  } catch (error) {
    console.error("Error updating message:", error);
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
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!id) {
      return res.status(400).json({ error: "Message ID is required" });
    }

    await messageService.deleteMessage(id, userId);

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting message:", error);
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
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

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
