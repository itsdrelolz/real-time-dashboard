import { Server } from "socket.io";
import { projectService } from "../api/projects/project.service";
import { messageService } from "../api/messages/message.service";
import { channelService } from "../api/channels/channel.service";
import { notificationService } from "../api/notifications/notification.service";
import { fcmService } from "../services/fcm.service";
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
   * This function is used to join the project room for the socket.
   * It is used to join the project room for the socket.
   */

  const joinProjectRoom = async (projectId: string) => {
    try {
      console.log(
        `User ${userId} attempting to join project room ${projectId}`,
      );
      const project = await projectService.getProjectById(projectId);
      const isMember = project?.members.some((member) => member.id === userId);

      if (isMember) {
        await socket.join(`project-${projectId}`);
        console.log(
          `User ${userId} successfully joined room for project ${projectId}`,
        );
      } else {
        console.warn(
          `Attempt by user ${userId} to join unauthorized project room ${projectId}`,
        );
      }
    } catch (error) {
      console.error(`Error joining project room for user ${userId}:`, error);
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

      // Get channel and project info
      const channel = await channelService.getChannelById(data.channelId);
      if (!channel) {
        console.log(`Channel ${data.channelId} not found`);
        return;
      }

      const project = await projectService.getProjectById(channel.projectId);
      if (!project) {
        console.log(`Project ${channel.projectId} not found`);
        return;
      }

      // Get all project members
      const members = await projectService.getProjectMembers(channel.projectId);

      // Send to online users via WebSocket
      console.log(
        `Broadcasting message to project room project-${channel.projectId}`,
      );
      io.to(`project-${channel.projectId}`).emit("messageCreated", newMessage);

      // Send to offline users via FCM + notifications
      for (const member of members) {
        if (member.id !== userId) {
          // Don't send notification to sender
          const isOnline = await isUserOnline(member.id);

          if (!isOnline) {
            // Send FCM notification
            if (member.fcmToken) {
              try {
                await fcmService.sendNotification(member.fcmToken, {
                  title: `New message in #${channel.name}`,
                  body: `${newMessage.author.username}: ${data.content}`,
                  data: {
                    messageId: newMessage.id,
                    channelId: data.channelId,
                    projectId: channel.projectId,
                    type: "message",
                  },
                });
              } catch (error) {
                console.error(
                  `Failed to send FCM to user ${member.id}:`,
                  error,
                );
              }
            }

            // Create database notification
            try {
              await notificationService.createMessageNotification(
                newMessage.id,
                member.id,
                `New message in #${channel.name}`,
                `${newMessage.author.username}: ${data.content}`,
                {
                  channelId: data.channelId,
                  projectId: channel.projectId,
                  channelName: channel.name,
                },
              );
            } catch (error) {
              console.error(
                `Failed to create notification for user ${member.id}:`,
                error,
              );
            }
          }
        }
      }
    } catch (error) {
      console.error("Error handling new message:", error);
      socket.emit("messageError", { message: "Could not send message." });
    }
  };

  socket.on("joinProjectRoom", joinProjectRoom);
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
