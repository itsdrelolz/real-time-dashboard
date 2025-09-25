import { Response } from "express";
import { channelService } from "./channel.service";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import { validateChannel } from "@/validators/channelValidator";

export async function getChannelByIdController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const channelId = req.params.channelId;

    if (!channelId) {
      return res.status(400).json({ error: "Invalid Channel ID." });
    }

    const channel = await channelService.getChannelById(channelId);

    if (!channel) {
      return res.status(404).json({ error: "Channel not found." });
    }

    return res.status(200).json({ channel });
  } catch (error) {
    console.error("Error retrieving channel: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function createChannelController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const projectId = req.params.projectId;
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

    if (!projectId || !validatedData.name) {
      return res.status(400).json({
        error:
          "Missing required fields: valid projectId and name are required.",
      });
    }

    const newChannel = await channelService.createChannel(projectId, userId, {
      name: validatedData.name,
      description: validatedData.description,
    });

    return res
      .status(201)
      .json({ message: "Channel created successfully", channel: newChannel });
  } catch (error) {
    console.error("Error creating channel: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
// considers a duplicate channel name error
export async function updateChannelController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const channelId = req.params.channelId;
    const projectId = req.params.projectId;
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

    if (!channelId || !projectId) {
      return res
        .status(400)
        .json({ error: "Invalid channel ID or project ID." });
    }

    // option of either name or description is required
    if (!validatedData.name && !validatedData.description) {
      return res
        .status(400)
        .json({ error: "Channel name or description is required." });
    }

    const updated = await channelService.updateChannel(
      projectId,
      channelId,
      userId,
      { name: validatedData.name, description: validatedData.description },
    );
    return res
      .status(200)
      .json({ message: "Channel updated successfully", channel: updated });
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

    if (!channelId) {
      return res.status(400).json({ error: "Invalid Channel ID." });
    }

    const channel = await channelService.getChannelById(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found." });
    }

    await channelService.deleteChannel(channelId);
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting channel: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAllChannelsForProjectController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const projectId = req.params.projectId;

    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    const channels = await channelService.getChannelsByProjectId(projectId);
    return res.status(200).json({ channels });
  } catch (error) {
    console.error("Error getting channels for project:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
