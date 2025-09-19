import { Request, Response, NextFunction } from "express";
import { getUserFromToken } from "../api/auth/auth.service";

export interface AuthenticatedRequest extends Request {
  user?: Awaited<ReturnType<typeof getUserFromToken>>;
}

export async function authMiddleware(
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
    } catch (error) { 
console.error("Error in auth middleware:", error);
    return res.status(500).json({ message: "Internal Server Error" });

    }
}
