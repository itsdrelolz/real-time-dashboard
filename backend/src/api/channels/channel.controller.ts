import { Response } from "express";
import {
  getChannelById,
  createChannel,
  updateChannel,
  deleteChannel,
  getChannelsByProjectId,
} from "./channel.service";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import { getProjectById, getProjectOwnerId } from "../projects/project.service";



export async function getChannelByIdController(req: AuthenticatedRequest, res: Response) {
  try {
    const channelId = req.params.channelId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Invalid Channel ID." });
    }

    const channel = await getChannelById(channelId);

    if (!channel) {
      return res.status(404).json({ error: "Channel not found." });
    }

    const project = await getProjectById(channel.projectId);
    const isMember = project?.members.some(member => member.profileId === userId);

    if (!isMember) {
      return res.status(403).json({ error: "Forbidden: You do not have access to this channel." });
    }

    return res.status(200).json({ channel });
  } catch (error) {
    console.error('Error retrieving channel: ', error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function createChannelController(req: AuthenticatedRequest, res: Response) {

  try {

    const projectId = req.params.projectId;
    const { name, topic } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!projectId || !name) {
      return res.status(400).json({ error: "Missing required fields: valid projectId and name are required." });
    }

    const project = await getProjectById(projectId);
    const isMember = project?.members.some(member => member.profileId === userId);
    if (!isMember) {
      return res.status(403).json({ error: "Forbidden: You must be a member to create a channel." });
    }

    const newChannel = await createChannel({ projectId, name, topic: topic || null });
    return res.status(201).json({ message: "Channel created successfully", channel: newChannel });
  } catch (error) {
    console.error('Error creating channel: ', error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
// consider duplicate channel name error 
export async function updateChannelController(req: AuthenticatedRequest, res: Response) {
  try {
    const channelId = req.params.channelId;
    const userId = req.user?.id;
    const { name, topic } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Invalid channel ID." });
    }

    

    // option of either name or topic is required
    if (!name && !topic) {
      return res.status(400).json({ error: "Channel name or topic is required." });
    }

    
  
   
    const channel = await getChannelById(channelId);

    if (!channel) {
      return res.status(404).json({ error: "Channel not found." });
    }

    const ownerId = await getProjectOwnerId(channel.projectId);
    if (ownerId !== userId) {
      return res.status(403).json({ error: "Forbidden: You are not authorized to update this channel." });
    }

    const updated = await updateChannel(channelId, { name, topic }); 
    return res.status(200).json({ message: "Channel updated successfully", channel: updated });
  } catch (error) {
    console.error("Error updating channel:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteChannelController(req: AuthenticatedRequest, res: Response) {
  try {
    const channelId = req.params.channelId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required." });
    }
    if (!channelId) {
      return res.status(400).json({ error: "Channel ID must be a valid number." });
    }

    const channel = await getChannelById(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found." });
    }

    const ownerId = await getProjectOwnerId(channel.projectId);
    if (ownerId !== userId) {
      return res.status(403).json({ error: "Forbidden: You are not authorized to delete this channel." });
    }

    await deleteChannel(channelId);
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting channel: ', error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAllChannelsForProjectController(req: AuthenticatedRequest, res: Response) {
  try {
    const projectId = req.params.projectId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    // Verify user is a member of the project
    const project = await getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const isMember = project.members.some(member => member.profileId === userId);
    if (!isMember) {
      return res.status(403).json({ error: "You are not a member of this project" });
    }

    const channels = await getChannelsByProjectId(projectId);
    return res.status(200).json({ channels });
  } catch (error) {
    console.error('Error getting channels for project:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
