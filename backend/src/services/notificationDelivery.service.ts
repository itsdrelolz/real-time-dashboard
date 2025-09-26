import { fcmService } from "./fcm.service";
import { notificationService } from "../api/notifications/notification.service";
import { notificationSettingsService } from "./notificationSettings.service";
import { FCMNotificationPayload } from "../types/notification.types";

class NotificationDeliveryService {
  // Send notification with FCM + database storage
  public async sendNotificationWithFCM(
    userId: string,
    payload: FCMNotificationPayload,
    notificationData: {
      type: string;
      messageId?: string;
      taskId?: string;
      projectId?: string;
    }
  ): Promise<void> {
    try {
      // Check if user should receive this type of notification
      const shouldReceive = await notificationSettingsService.shouldReceiveNotification(
        userId,
        notificationData.type
      );

      if (!shouldReceive) {
        console.log(`User ${userId} has disabled ${notificationData.type} notifications`);
        return;
      }

      // Get user's FCM token
      const fcmToken = await notificationService.getUserFCMToken(userId);
      
      if (fcmToken) {
        // Send FCM notification
        try {
          await fcmService.sendNotification(fcmToken, payload);
        } catch (error) {
          console.error(`Failed to send FCM to user ${userId}:`, error);
          
          // If FCM fails due to invalid token, remove it
          if (error.code === 'messaging/invalid-registration-token' || 
              error.code === 'messaging/registration-token-not-registered') {
            await notificationService.saveUserNotificationToken(userId, null);
          }
        }
      }

      // Always create database notification for persistence
      await notificationService.createNotification({
        type: notificationData.type as any,
        title: payload.title,
        body: payload.body,
        data: payload.data,
        recipientId: userId,
        messageId: notificationData.messageId,
        taskId: notificationData.taskId,
        projectId: notificationData.projectId,
      });
    } catch (error) {
      console.error(`Failed to send notification to user ${userId}:`, error);
    }
  }

  // Send task assignment notification
  public async sendTaskAssignmentNotification(
    assigneeId: string,
    taskTitle: string,
    projectName: string,
    taskId: string,
    projectId: string
  ): Promise<void> {
    const payload: FCMNotificationPayload = {
      title: "New Task Assigned",
      body: `You've been assigned to "${taskTitle}" in ${projectName}`,
      data: {
        taskTitle,
        projectName,
        taskId,
        projectId,
        type: "task_assigned",
      },
      icon: "ic_task",
      sound: "default",
    };

    await this.sendNotificationWithFCM(assigneeId, payload, {
      type: "task_assigned",
      taskId,
      projectId,
    });
  }

  // Send project invite notification
  public async sendProjectInviteNotification(
    inviteeId: string,
    projectName: string,
    inviterName: string,
    projectId: string
  ): Promise<void> {
    const payload: FCMNotificationPayload = {
      title: "Project Invitation",
      body: `${inviterName} invited you to join "${projectName}"`,
      data: {
        projectName,
        inviterName,
        projectId,
        type: "project_invite",
      },
      icon: "ic_project",
      sound: "default",
    };

    await this.sendNotificationWithFCM(inviteeId, payload, {
      type: "project_invite",
      projectId,
    });
  }

  // Send user mention notification
  public async sendMentionNotification(
    mentionedUserId: string,
    mentionerName: string,
    channelName: string,
    messageId: string,
    channelId: string,
    projectId: string
  ): Promise<void> {
    const payload: FCMNotificationPayload = {
      title: "You were mentioned",
      body: `${mentionerName} mentioned you in #${channelName}`,
      data: {
        mentionerName,
        channelName,
        messageId,
        channelId,
        projectId,
        type: "user_mentioned",
      },
      icon: "ic_mention",
      sound: "default",
    };

    await this.sendNotificationWithFCM(mentionedUserId, payload, {
      type: "user_mentioned",
      messageId,
      projectId,
    });
  }

  // Send due date reminder notification
  public async sendDueDateReminderNotification(
    assigneeId: string,
    taskTitle: string,
    dueDate: Date,
    taskId: string,
    projectId: string
  ): Promise<void> {
    const payload: FCMNotificationPayload = {
      title: "Task Due Soon",
      body: `"${taskTitle}" is due ${dueDate.toLocaleDateString()}`,
      data: {
        taskTitle,
        dueDate: dueDate.toISOString(),
        taskId,
        projectId,
        type: "due_date_reminder",
      },
      icon: "ic_reminder",
      sound: "default",
    };

    await this.sendNotificationWithFCM(assigneeId, payload, {
      type: "due_date_reminder",
      taskId,
      projectId,
    });
  }

  // Send task completion notification
  public async sendTaskCompletionNotification(
    taskCreatorId: string,
    taskTitle: string,
    completerName: string,
    taskId: string,
    projectId: string
  ): Promise<void> {
    const payload: FCMNotificationPayload = {
      title: "Task Completed",
      body: `${completerName} completed "${taskTitle}"`,
      data: {
        taskTitle,
        completerName,
        taskId,
        projectId,
        type: "task_completed",
      },
      icon: "ic_check",
      sound: "default",
    };

    await this.sendNotificationWithFCM(taskCreatorId, payload, {
      type: "task_completed",
      taskId,
      projectId,
    });
  }

  // Send project creation notification to members
  public async sendProjectCreationNotification(
    memberIds: string[],
    projectName: string,
    creatorName: string,
    projectId: string
  ): Promise<void> {
    const payload: FCMNotificationPayload = {
      title: "New Project Created",
      body: `${creatorName} created "${projectName}"`,
      data: {
        projectName,
        creatorName,
        projectId,
        type: "project_created",
      },
      icon: "ic_project",
      sound: "default",
    };

    // Send to all members
    for (const memberId of memberIds) {
      await this.sendNotificationWithFCM(memberId, payload, {
        type: "project_created",
        projectId,
      });
    }
  }
}

export const notificationDeliveryService = new NotificationDeliveryService();
