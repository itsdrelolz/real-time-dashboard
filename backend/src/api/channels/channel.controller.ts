import { Response } from "express";
import { channelService } from "./channel.service";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import { validateChannel } from "@/validators/channelValidator";

export async function createChannelController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const workspaceId = req.params.workspaceId;
    const validationResult = validateChannel(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Invalid channel payload",
        details: validationResult.error.message,
      });
    }
    const validatedData = validationResult.data;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!workspaceId || !validatedData.name) {
      return res.status(400).json({
        error:
          "Missing required fields: valid workspaceId and name are required.",
      });
    }

    const newChannel = await channelService.createChannel(workspaceId, userId, {
      name: validatedData.name,
      description: validatedData.description,
    });

    return res.status(201).json(newChannel);
  } catch (error) {
    console.error("Error creating channel:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateChannelController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const channelId = req.params.channelId;
    const workspaceId = req.params.workspaceId;
    const userId = req.user?.uid;
    const validationResult = validateChannel(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Invalid channel payload",
        details: validationResult.error.message,
      });
    }
    const validatedData = validationResult.data;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!channelId || !workspaceId) {
      return res
        .status(400)
        .json({ error: "Invalid channel ID or workspace ID." });
    }

    if (!validatedData.name) {
      return res.status(400).json({
        error: "Missing required fields: name is required.",
      });
    }

    const updated = await channelService.updateChannel(
      workspaceId,
      channelId,
      userId,
      {
        name: validatedData.name,
        description: validatedData.description,
      },
    );

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating channel:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteChannelController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const channelId = req.params.channelId;
    const workspaceId = req.params.workspaceId;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!channelId || !workspaceId) {
      return res
        .status(400)
        .json({ error: "Invalid channel ID or workspace ID." });
    }

    await channelService.deleteChannel(workspaceId, channelId, userId);

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting channel:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getChannelsController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const workspaceId = req.params.workspaceId;

    if (!workspaceId) {
      return res.status(400).json({ error: "Workspace ID is required" });
    }

    const channels = await channelService.getChannelsByWorkspaceId(workspaceId);
    return res.status(200).json({ channels });
  } catch (error) {
    console.error("Error getting channels for workspace:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getChannelByIdController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const channelId = req.params.channelId;

    if (!channelId) {
      return res.status(400).json({ error: "Channel ID is required" });
    }

    const channel = await channelService.getChannelById(channelId);

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    return res.status(200).json(channel);
  } catch (error) {
    console.error("Error getting channel by id:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}