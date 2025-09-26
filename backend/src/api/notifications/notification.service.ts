import prisma from "../../utils/prismaClient";
import {
  CreateNotificationBody,
  NotificationWithRelations,
  NotificationListResponse,
} from "../../types/notification.types";

class NotificationService {
  // Save user's FCM token
  public async saveUserNotificationToken(userId: string, token: string | null) {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { fcmToken: token || null },
      });
      return updatedUser;
    } catch (error) {
      console.error("Error saving user notification token:", error);
      throw new Error("Failed to save user notification token.");
    }
  }

  // Create a new notification
  public async createNotification(
    notificationData: CreateNotificationBody,
  ): Promise<NotificationWithRelations> {
    try {
      const notification = await prisma.notification.create({
        data: {
          type: notificationData.type,
          title: notificationData.title,
          body: notificationData.body,
          data: notificationData.data,
          recipientId: notificationData.recipientId,
          messageId: notificationData.messageId,
          taskId: notificationData.taskId,
          projectId: notificationData.projectId,
        },
        include: {
          message: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  photoURL: true,
                },
              },
            },
          },
          task: {
            include: {
              creator: {
                select: {
                  id: true,
                  username: true,
                  photoURL: true,
                },
              },
              assignee: {
                select: {
                  id: true,
                  username: true,
                  photoURL: true,
                },
              },
            },
          },
          project: {
            include: {
              creator: {
                select: {
                  id: true,
                  username: true,
                  photoURL: true,
                },
              },
            },
          },
        },
      });

      return notification as NotificationWithRelations;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw new Error("Failed to create notification.");
    }
  }

  // Get user's notifications with pagination
  public async getUserNotifications(
    userId: string,
    limit: number = 20,
    offset: number = 0,
    unreadOnly: boolean = false,
  ): Promise<NotificationListResponse> {
    try {
      const whereClause = {
        recipientId: userId,
        ...(unreadOnly && { read: false }),
      };

      const [notifications, totalCount, unreadCount] = await Promise.all([
        prisma.notification.findMany({
          where: whereClause,
          include: {
            message: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    photoURL: true,
                  },
                },
              },
            },
            task: {
              include: {
                creator: {
                  select: {
                    id: true,
                    username: true,
                    photoURL: true,
                  },
                },
                assignee: {
                  select: {
                    id: true,
                    username: true,
                    photoURL: true,
                  },
                },
              },
            },
            project: {
              include: {
                creator: {
                  select: {
                    id: true,
                    username: true,
                    photoURL: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: offset,
        }),
        prisma.notification.count({ where: { recipientId: userId } }),
        prisma.notification.count({
          where: { recipientId: userId, read: false },
        }),
      ]);

      return {
        notifications: notifications as NotificationWithRelations[],
        unreadCount,
        totalCount,
      };
    } catch (error) {
      console.error("Error getting user notifications:", error);
      throw new Error("Failed to get user notifications.");
    }
  }

  // Mark notification as read
  public async markNotificationAsRead(
    notificationId: string,
    userId: string,
  ): Promise<void> {
    try {
      await prisma.notification.updateMany({
        where: {
          id: notificationId,
          recipientId: userId,
        },
        data: { read: true },
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw new Error("Failed to mark notification as read.");
    }
  }

  // Mark all notifications as read for user
  public async markAllNotificationsAsRead(userId: string): Promise<void> {
    try {
      await prisma.notification.updateMany({
        where: {
          recipientId: userId,
          read: false,
        },
        data: { read: true },
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw new Error("Failed to mark all notifications as read.");
    }
  }

  // Delete notification
  public async deleteNotification(
    notificationId: string,
    userId: string,
  ): Promise<void> {
    try {
      await prisma.notification.deleteMany({
        where: {
          id: notificationId,
          recipientId: userId,
        },
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw new Error("Failed to delete notification.");
    }
  }

  // Get unread count for user
  public async getUnreadCount(userId: string): Promise<number> {
    try {
      return await prisma.notification.count({
        where: {
          recipientId: userId,
          read: false,
        },
      });
    } catch (error) {
      console.error("Error getting unread count:", error);
      throw new Error("Failed to get unread count.");
    }
  }

  // Create notification for message
  public async createMessageNotification(
    messageId: string,
    recipientId: string,
    title: string,
    body: string,
    data?: Record<string, any>,
  ): Promise<NotificationWithRelations> {
    return this.createNotification({
      type: "message",
      title,
      body,
      data,
      recipientId,
      messageId,
    });
  }

  // Create notification for task assignment
  public async createTaskAssignmentNotification(
    taskId: string,
    assigneeId: string,
    taskTitle: string,
    projectName: string,
  ): Promise<NotificationWithRelations> {
    return this.createNotification({
      type: "task_assigned",
      title: "New Task Assigned",
      body: `You've been assigned to "${taskTitle}" in ${projectName}`,
      data: { taskTitle, projectName },
      recipientId: assigneeId,
      taskId,
    });
  }

  // Create notification for project invite
  public async createProjectInviteNotification(
    projectId: string,
    inviteeId: string,
    projectName: string,
    inviterName: string,
  ): Promise<NotificationWithRelations> {
    return this.createNotification({
      type: "project_invite",
      title: "Project Invitation",
      body: `${inviterName} invited you to join "${projectName}"`,
      data: { projectName, inviterName },
      recipientId: inviteeId,
      projectId,
    });
  }

  // Create notification for user mention
  public async createMentionNotification(
    messageId: string,
    mentionedUserId: string,
    mentionerName: string,
    channelName: string,
  ): Promise<NotificationWithRelations> {
    return this.createNotification({
      type: "user_mentioned",
      title: "You were mentioned",
      body: `${mentionerName} mentioned you in #${channelName}`,
      data: { mentionerName, channelName },
      recipientId: mentionedUserId,
      messageId,
    });
  }

  // Create due date reminder notification
  public async createDueDateReminderNotification(
    taskId: string,
    assigneeId: string,
    taskTitle: string,
    dueDate: Date,
  ): Promise<NotificationWithRelations> {
    return this.createNotification({
      type: "due_date_reminder",
      title: "Task Due Soon",
      body: `"${taskTitle}" is due ${dueDate.toLocaleDateString()}`,
      data: { taskTitle, dueDate: dueDate.toISOString() },
      recipientId: assigneeId,
      taskId,
    });
  }

  // Get FCM token for user
  public async getUserFCMToken(userId: string): Promise<string | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { fcmToken: true },
      });
      return user?.fcmToken || null;
    } catch (error) {
      console.error("Error getting user FCM token:", error);
      throw new Error("Failed to get user FCM token.");
    }
  }

  // Clean up old notifications (older than 30 days)
  public async cleanupOldNotifications(): Promise<number> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await prisma.notification.deleteMany({
        where: {
          createdAt: {
            lt: thirtyDaysAgo,
          },
          read: true,
        },
      });

      return result.count;
    } catch (error) {
      console.error("Error cleaning up old notifications:", error);
      throw new Error("Failed to cleanup old notifications.");
    }
  }
}

export const notificationService = new NotificationService();
