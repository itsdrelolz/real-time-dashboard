import { Request, Response, NextFunction } from "express";
import {
  getUserFromToken,
  type AuthenticatedUser,
} from "../services/auth.service";

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export async function authenticateMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1] as string;
    const userProfile = await getUserFromToken(token);

    if (!userProfile) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    req.user = userProfile;
    next();
  } catch (error: any) {
    if (error?.code.startsWith?.("auth/")) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
