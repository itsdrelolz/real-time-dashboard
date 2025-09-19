import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import { getMessagesForChannel } from "./message.service";
import { getChannelById } from "../channels/channel.service"; 
import { getProjectById } from "../projects/project.service"; 

export async function getMessagesForChannelController(req: AuthenticatedRequest, res: Response) {
    try {
        const channelId = parseInt(req.params.channelId as string, 10);

        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (isNaN(channelId)) {
            return res.status(400).json({ error: "Invalid Channel ID." });
        }

        const channel = await getChannelById(channelId);
        if (!channel) {
            return res.status(404).json({ error: "Channel not found." });
        }

        const project = await getProjectById(channel.projectId);
        const isMember = project?.members.some(member => member.profileId === userId);
        if (!isMember) {
            return res.status(403).json({ error: "Forbidden: You are not a member of this project." });
        }


        const messages = await getMessagesForChannel(channelId);
        return res.status(200).json({ messages });
    } catch (error) {
        console.error('Error retrieving messages: ', error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
