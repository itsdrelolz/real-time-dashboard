import { Server } from "socket.io";
import { workspaceService } from "@/api/workspaces/workspace.service";
import { messageService } from "../api/messages/message.service";
import { channelService } from "../api/channels/channel.service";
import prisma from "../utils/prismaClient";
import type { AuthenticatedSocket } from "./index";

/*
* This function registers the message handlers for the socket.
* It is used to handle the messages for the socket.
* 
*/

export function registerMessageHandlers(
  io: Server,
  socket: AuthenticatedSocket,
) {
  const userId = socket.user?.uid;

  if (!userId) {
    console.error("Socket is missing user authentication.");
    socket.disconnect();
    return;
  }

  // Update user presence to online
  updateUserPresence(userId, "online");

  // Handle disconnect - set user offline
  socket.on("disconnect", async () => {
    await updateUserPresence(userId, "offline");
  });

  /*
   * This function is used to join the workspace room for the socket.
   * It is used to join the workspace room for the socket.
   */

  const joinWorkspaceRoom = async (workspaceId: string) => {
    try {
      console.log(
        `User ${userId} attempting to join workspace room ${workspaceId}`,
      );
      const workspace = await workspaceService.getWorkspaceById(workspaceId);
      const isMember = workspace?.members.some((member) => member.id === userId);

      if (isMember) {
        await socket.join(`workspace-${workspaceId}`);
        console.log(
          `User ${userId} successfully joined room for workspace ${workspaceId}`,
        );
      } else {
        console.warn(
          `Attempt by user ${userId} to join unauthorized workspace room ${workspaceId}`,
        );
      }
    } catch (error) {
      console.error(`Error joining workspace room for user ${userId}:`, error);
    }
  };

  /*
   * This function is used to handle the new channel message for the socket.
   * It is used to create new messages for the socket.
   */

  const handleNewChannelMessage = async (data: {
    channelId: string;
    content: string;
  }) => {
    if (!data.content?.trim()) return;

    try {
      console.log(
        `User ${userId} sending message to channel ${data.channelId}:`,
        data.content,
      );

      // Create the message
      const newMessage = await messageService.createMessage(
        { content: data.content },
        userId,
        data.channelId,
        undefined,
      );

      // Get channel and workspace info
      const channel = await channelService.getChannelById(data.channelId);
      if (!channel) {
        console.log(`Channel ${data.channelId} not found`);
        return;
      }

      const workspace = await workspaceService.getWorkspaceById(channel.workspaceId);
      if (!workspace) {
        console.log(`Workspace ${channel.workspaceId} not found`);
        return;
      }

      // Get all workspace members
      const members = await workspaceService.getWorkspaceMembers(channel.workspaceId);

      // Send to online users via WebSocket
      console.log(
        `Broadcasting message to workspace room workspace-${channel.workspaceId}`,
      );
      io.to(`workspace-${channel.workspaceId}`).emit("messageCreated", newMessage);
    } catch (error) {
      console.error("Error handling new message:", error);
      socket.emit("messageError", { message: "Could not send message." });
    }
  };

  socket.on("joinWorkspaceRoom", joinWorkspaceRoom);
  socket.on("newChannelMessage", handleNewChannelMessage);
}

// Helper function to update user presence
async function updateUserPresence(
  userId: string,
  status: "online" | "offline" | "idle" | "away",
) {
  try {
    await prisma.userPresence.upsert({
      where: { userId },
      update: {
        status,
        lastSeen: new Date(),
      },
      create: {
        userId,
        status,
        lastSeen: new Date(),
      },
    });
  } catch (error) {
    console.error(`Failed to update presence for user ${userId}:`, error);
  }
}

// Helper function to check if user is online
async function isUserOnline(userId: string): Promise<boolean> {
  try {
    const presence = await prisma.userPresence.findUnique({
      where: { userId },
    });
    return presence?.status === "online";
  } catch (error) {
    console.error(`Failed to check online status for user ${userId}:`, error);
    return false;
  }
}
