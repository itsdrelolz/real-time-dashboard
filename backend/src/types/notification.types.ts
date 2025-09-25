import { Message, Notification, Project, Task, User } from "@prisma/client";

// Base notification types
export type NotificationType = 
  | "message" 
  | "task_assigned" 
  | "task_updated" 
  | "task_completed"
  | "project_invite" 
  | "project_created"
  | "channel_created"
  | "conversation_created"
  | "user_mentioned"
  | "due_date_reminder";

// Basic notification response
export type BasicNotificationResponse = Pick<
  Notification,
  "id" | "type" | "title" | "body" | "read" | "createdAt" | "updatedAt"
>;

// Notification with related entities
export type NotificationWithRelations = Notification & {
  message?: Message & {
    author: Pick<User, "id" | "username" | "photoURL">;
  };
  task?: Task & {
    creator: Pick<User, "id" | "username" | "photoURL">;
    assignee?: Pick<User, "id" | "username" | "photoURL">;
  };
  project?: Project & {
    creator: Pick<User, "id" | "username" | "photoURL">;
  };
};

// Create notification body
export type CreateNotificationBody = {
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  recipientId: string;
  messageId?: string;
  taskId?: string;
  projectId?: string;
};

// Notification list response
export type NotificationListResponse = {
  notifications: NotificationWithRelations[];
  unreadCount: number;
  totalCount: number;
};

// Notification settings
export type NotificationSettings = {
  messageNotifications: boolean;
  taskNotifications: boolean;
  projectNotifications: boolean;
  mentionNotifications: boolean;
  dueDateReminders: boolean;
};

// FCM notification payload
export type FCMNotificationPayload = {
  title: string;
  body: string;
  data?: Record<string, string>;
  icon?: string;
  badge?: string;
  sound?: string;
};