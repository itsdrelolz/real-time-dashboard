import prisma from "../../utils/prismaClient";

class NotificationService {
  /* 
    Saves a user's notification token to the database
    @param userId - The ID of the user to save the token for
    @param token - The token to save
    @returns The updated user
    @throws An error if the token fails to save
    */
  public async saveUserNotificationToken(userId: string, token: string) {
    try {
      const updatedUser = await prisma.profile.update({
        where: { id: userId },
        data: { fcmToken: token },
      });
      return updatedUser;
    } catch (error) {
      console.error("Error saving user notification token:", error);
      throw new Error("Failed to save user notification token.");
    }
  }
}

export const notificationService = new NotificationService();
