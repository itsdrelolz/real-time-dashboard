import { Message, MulticastMessage } from "firebase-admin/messaging";
import { messaging } from "../firebaseAdmin";
import { FCMNotificationPayload } from "../types/notification.types";

class FcmService {
  // Send notification to single device
  public async sendNotification(
    token: string,
    payload: FCMNotificationPayload,
  ): Promise<string> {
    const message: Message = {
      token,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data
        ? Object.fromEntries(
            Object.entries(payload.data).map(([key, value]) => [
              key,
              String(value),
            ]),
          )
        : undefined,
      android: {
        notification: {
          icon: payload.icon || "ic_notification",
          color: "#FF6B6B",
          sound: payload.sound || "default",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: payload.sound || "default",
            badge: payload.badge ? parseInt(payload.badge) : undefined,
          },
        },
      },
    };

    try {
      const response = await messaging.send(message);
      console.log("FCM notification sent successfully:", response);
      return response;
    } catch (error) {
      console.error("Error sending FCM notification:", error);
      throw new Error(`Failed to send notification: ${error}`);
    }
  }

  // Send notification to multiple devices
  public async sendMulticastNotification(
    tokens: string[],
    payload: FCMNotificationPayload,
  ): Promise<{ successCount: number; failureCount: number }> {
    const message: MulticastMessage = {
      tokens,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data
        ? Object.fromEntries(
            Object.entries(payload.data).map(([key, value]) => [
              key,
              String(value),
            ]),
          )
        : undefined,
      android: {
        notification: {
          icon: payload.icon || "ic_notification",
          color: "#FF6B6B",
          sound: payload.sound || "default",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: payload.sound || "default",
            badge: payload.badge ? parseInt(payload.badge) : undefined,
          },
        },
      },
    };

    try {
      const response = await messaging.sendEachForMulticast(message);
      console.log(
        `FCM multicast sent: ${response.successCount} success, ${response.failureCount} failures`,
      );
      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
      };
    } catch (error) {
      console.error("Error sending FCM multicast:", error);
      throw new Error(`Failed to send multicast notification: ${error}`);
    }
  }

  // Send notification to topic
  public async sendTopicNotification(
    topic: string,
    payload: FCMNotificationPayload,
  ): Promise<string> {
    const message: Message = {
      topic,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data
        ? Object.fromEntries(
            Object.entries(payload.data).map(([key, value]) => [
              key,
              String(value),
            ]),
          )
        : undefined,
    };

    try {
      const response = await messaging.send(message);
      console.log("FCM topic notification sent successfully:", response);
      return response;
    } catch (error) {
      console.error("Error sending FCM topic notification:", error);
      throw new Error(`Failed to send topic notification: ${error}`);
    }
  }

  // Subscribe user to topic
  public async subscribeToTopic(
    tokens: string[],
    topic: string,
  ): Promise<void> {
    try {
      const response = await messaging.subscribeToTopic(tokens, topic);
      console.log(`Successfully subscribed to topic ${topic}:`, response);
    } catch (error) {
      console.error("Error subscribing to topic:", error);
      throw new Error(`Failed to subscribe to topic: ${error}`);
    }
  }

  // Unsubscribe user from topic
  public async unsubscribeFromTopic(
    tokens: string[],
    topic: string,
  ): Promise<void> {
    try {
      const response = await messaging.unsubscribeFromTopic(tokens, topic);
      console.log(`Successfully unsubscribed from topic ${topic}:`, response);
    } catch (error) {
      console.error("Error unsubscribing from topic:", error);
      throw new Error(`Failed to unsubscribe from topic: ${error}`);
    }
  }

  // Validate FCM token
  public async validateToken(token: string): Promise<boolean> {
    try {
      // Try to send a test message (dry run)
      await messaging.send(
        {
          token,
          notification: { title: "Test", body: "Test" },
        },
        true,
      ); // dry run
      return true;
    } catch (error) {
      console.error("FCM token validation failed:", error);
      return false;
    }
  }
}

export const fcmService = new FcmService();
