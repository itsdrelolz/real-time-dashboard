import * as admin from "firebase-admin";
import { Message } from "firebase-admin/messaging";

class FcmService {
  /* 
    Sends a push notification to a specific device 
    @param token - The token of the device to send the notification to
    @param payload - The payload of the notification
    @returns The response from the Firebase Admin SDK
    @throws An error if the notification fails to send
    */
  public async sendNotification(token: string, title: string, body: string) {
    const message: Message = {
      token,
      notification: { title, body },
    };

    try {
      const response = await admin.messaging().send(message);
      return response;
    } catch (error) {
      console.error("Error sending notification:", error);
      throw new Error("Failed to send notification.");
    }
  }
}

export const fcmService = new FcmService();
