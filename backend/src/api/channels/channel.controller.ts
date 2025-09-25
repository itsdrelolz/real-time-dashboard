import { Response } from "express";
import { channelService } from "./channel.service";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import { projectService } from "../projects/project.service";
import { requireAuth } from "../../utils/authUtils";

export async function getChannelByIdController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const channelId = req.params.channelId;
    const userId = requireAuth(req, res);

    if (!userId) return; // Response already sent by requireAuth

    if (!channelId) {
      return res.status(400).json({ error: "Invalid Channel ID." });
    }

    const channel = await channelService.getChannelById(channelId);

    if (!channel) {
      return res.status(404).json({ error: "Channel not found." });
    }

    const project = await projectService.getProjectById(channel.projectId);
    const isMember = project?.members.some(
      (member: any) => member.id === userId,
    );

    if (!isMember) {
      return res
        .status(403)
        .json({ error: "Forbidden: You do not have access to this channel." });
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
    const { name, description } = req.body;
    const userId = requireAuth(req, res);

    if (!userId) return; // Response already sent by requireAuth

    if (!projectId || !name) {
      return res.status(400).json({
        error:
          "Missing required fields: valid projectId and name are required.",
      });
    }

    const newChannel = await channelService.createChannel(projectId, userId, {
      name,
      description,
    });
    return res
      .status(201)
      .json({ message: "Channel created successfully", channel: newChannel });
  } catch (error) {
    console.error("Error creating channel: ", error);
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return res.status(403).json({ error: error.message });
    }
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
    const userId = requireAuth(req, res);
    const { name, description } = req.body;

    if (!userId) return; // Response already sent by requireAuth

    if (!channelId || !projectId) {
      return res
        .status(400)
        .json({ error: "Invalid channel ID or project ID." });
    }

    // option of either name or description is required
    if (!name && !description) {
      return res
        .status(400)
        .json({ error: "Channel name or description is required." });
    }

    const updated = await channelService.updateChannel(
      projectId,
      channelId,
      userId,
      { name, description },
    );
    return res
      .status(200)
      .json({ message: "Channel updated successfully", channel: updated });
  } catch (error) {
    console.error("Error updating channel:", error);
    if (
      error instanceof Error &&
      (error.message.includes("Unauthorized") ||
        error.message.includes("not found"))
    ) {
      return res.status(403).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteChannelController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const channelId = req.params.channelId;
    const userId = requireAuth(req, res);

    if (!userId) return; // Response already sent by requireAuth
    if (!channelId) {
      return res
        .status(400)
        .json({ error: "Channel ID must be a valid number." });
    }

    const channel = await channelService.getChannelById(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found." });
    }

    const ownerId = await projectService.getProjectOwnerId(channel.projectId);
    if (ownerId !== userId) {
      return res.status(403).json({
        error: "Forbidden: You are not authorized to delete this channel.",
      });
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
    const userId = requireAuth(req, res);

    if (!userId) return; // Response already sent by requireAuth

    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    // Verify user is a member of the project
    const project = await projectService.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const isMember = project.members.some(
      (member: any) => member.id === userId,
    );
    if (!isMember) {
      return res
        .status(403)
        .json({ error: "You are not a member of this project" });
    }

    const channels = await channelService.getChannelsByProjectId(projectId);
    return res.status(200).json({ channels });
  } catch (error) {
    console.error("Error getting channels for project:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
