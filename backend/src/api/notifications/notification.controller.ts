import { Request, Response } from "express";
import { notificationService } from "./notification.service";

export const saveTokenController = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const { token } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!token || typeof token !== "string") {
    return res.status(400).json({ error: "Invalid token" });
  }

  try {
    const updatedUser = await notificationService.saveUserNotificationToken(
      userId,
      token,
    );
    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Error saving user notification token:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
