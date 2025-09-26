import prisma from "../utils/prismaClient";
import { NotificationSettings } from "@prisma/client";

export interface NotificationSettingsInput {
  messageNotifications?: boolean;
  taskNotifications?: boolean;
  projectNotifications?: boolean;
  mentionNotifications?: boolean;
  dueDateReminders?: boolean;
  fcmEnabled?: boolean;
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  quietHoursEnabled?: boolean;
}

class NotificationSettingsService {
  // Get user's notification settings
  public async getUserNotificationSettings(userId: string): Promise<NotificationSettings | null> {
    try {
      const settings = await prisma.notificationSettings.findUnique({
        where: { userId },
      });
      return settings;
    } catch (error) {
      console.error("Error getting user notification settings:", error);
      throw new Error("Failed to get notification settings.");
    }
  }

  // Create or update user's notification settings
  public async updateUserNotificationSettings(
    userId: string,
    settings: NotificationSettingsInput
  ): Promise<NotificationSettings> {
    try {
      const updatedSettings = await prisma.notificationSettings.upsert({
        where: { userId },
        update: {
          ...settings,
          updatedAt: new Date(),
        },
        create: {
          userId,
          ...settings,
        },
      });
      return updatedSettings;
    } catch (error) {
      console.error("Error updating user notification settings:", error);
      throw new Error("Failed to update notification settings.");
    }
  }

  // Check if user should receive a specific type of notification
  public async shouldReceiveNotification(
    userId: string,
    notificationType: string
  ): Promise<boolean> {
    try {
      const settings = await this.getUserNotificationSettings(userId);
      
      if (!settings) {
        // If no settings exist, use defaults (all enabled)
        return true;
      }

      // Check if FCM is enabled
      if (!settings.fcmEnabled) {
        return false;
      }

      // Check quiet hours
      if (settings.quietHoursEnabled && this.isInQuietHours(settings)) {
        return false;
      }

      // Check specific notification type
      switch (notificationType) {
        case "message":
          return settings.messageNotifications;
        case "task_assigned":
        case "task_updated":
        case "task_completed":
          return settings.taskNotifications;
        case "project_invite":
        case "project_created":
          return settings.projectNotifications;
        case "user_mentioned":
          return settings.mentionNotifications;
        case "due_date_reminder":
          return settings.dueDateReminders;
        default:
          return true;
      }
    } catch (error) {
      console.error("Error checking notification preferences:", error);
      return true; // Default to allowing notifications on error
    }
  }

  // Check if current time is within quiet hours
  private isInQuietHours(settings: NotificationSettings): boolean {
    if (!settings.quietHoursStart || !settings.quietHoursEnd) {
      return false;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = settings.quietHoursStart.split(':').map(Number);
    const [endHour, endMin] = settings.quietHoursEnd.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    // Handle quiet hours that span midnight
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime < endTime;
    } else {
      return currentTime >= startTime && currentTime < endTime;
    }
  }

  // Reset settings to defaults
  public async resetToDefaults(userId: string): Promise<NotificationSettings> {
    try {
      const defaultSettings: NotificationSettingsInput = {
        messageNotifications: true,
        taskNotifications: true,
        projectNotifications: true,
        mentionNotifications: true,
        dueDateReminders: true,
        fcmEnabled: true,
        soundEnabled: true,
        vibrationEnabled: true,
        quietHoursEnabled: false,
      };

      return await this.updateUserNotificationSettings(userId, defaultSettings);
    } catch (error) {
      console.error("Error resetting notification settings:", error);
      throw new Error("Failed to reset notification settings.");
    }
  }

  // Get notification settings for multiple users
  public async getBulkNotificationSettings(userIds: string[]): Promise<Record<string, NotificationSettings | null>> {
    try {
      const settings = await prisma.notificationSettings.findMany({
        where: {
          userId: { in: userIds },
        },
      });

      const settingsMap: Record<string, NotificationSettings | null> = {};
      
      // Initialize all users with null settings
      userIds.forEach(userId => {
        settingsMap[userId] = null;
      });

      // Fill in actual settings
      settings.forEach(setting => {
        settingsMap[setting.userId] = setting;
      });

      return settingsMap;
    } catch (error) {
      console.error("Error getting bulk notification settings:", error);
      throw new Error("Failed to get bulk notification settings.");
    }
  }
}

export const notificationSettingsService = new NotificationSettingsService();
