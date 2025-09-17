
import { Server } from "socket.io";
import { getProjectById } from "@/api/projects/project.service";
import { createMessage } from "@/api/messages/message.service";
import { getChannelById } from "@/api/channels/channel.service";
import type { AuthenticatedSocket } from "./index"; // Import the custom socket type

export function registerMessageHandlers(io: Server, socket: AuthenticatedSocket) {
  const userId = socket.user?.id;

  if (!userId) {
    console.error("Socket is missing user authentication.");
    socket.disconnect();
    return;
  }

  const joinProjectRoom = async (projectId: number) => {
    try {
      const project = await getProjectById(projectId);
      const isMember = project?.members.some(member => member.profileId === userId);

      if (isMember) {
        await socket.join(`project-${projectId}`);
        console.log(`User ${userId} joined room for project ${projectId}`);
      } else {
        console.warn(`Attempt by user ${userId} to join unauthorized project room ${projectId}`);
      }
    } catch (error) {
      console.error(`Error joining project room for user ${userId}:`, error);
    }
  };

  const handleNewChannelMessage = async (data: { channelId: number; content: string }) => {
    if (!data.content?.trim()) return;

    try {
      const channel = await getChannelById(data.channelId);
      if (!channel) return;

      const project = await getProjectById(channel.projectId);
      const isMember = project?.members.some(member => member.profileId === userId);

      if (!isMember) {
        console.warn(`Unauthorized message attempt by user ${userId} in channel ${data.channelId}`);
        return;
      }

      const newMessage = await createMessage({
        content: data.content,
        authorId: userId,
        channelId: data.channelId,
      });

      io.to(`project-${channel.projectId}`).emit('messageCreated', newMessage);

    } catch (error) {
      console.error("Error handling new message:", error);
      socket.emit('messageError', { message: "Could not send message." });
    }
  };

  socket.on("joinProjectRoom", joinProjectRoom);
  socket.on("newChannelMessage", handleNewChannelMessage);
}