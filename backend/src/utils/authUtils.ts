import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

/**
 * Standardized user authentication check
 * @param req - Authenticated request
 * @param res - Express response
 * @returns userId if authenticated, null if not (response sent)
 */
export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
): string | null {
  const userId = req.user?.uid;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }

  return userId;
}

/**
 * Standardized user authentication check with custom error message
 * @param req - Authenticated request
 * @param res - Express response
 * @param errorMessage - Custom error message
 * @returns userId if authenticated, null if not (response sent)
 */
export function requireAuthWithMessage(
  req: AuthenticatedRequest,
  res: Response,
  errorMessage: string = "Unauthorized",
): string | null {
  const userId = req.user?.uid;

  if (!userId) {
    res.status(401).json({ error: errorMessage });
    return null;
  }

  return userId;
}

/**
 * Check if user is authenticated (doesn't send response)
 * @param req - Authenticated request
 * @returns userId if authenticated, null if not
 */
export function getAuthenticatedUserId(
  req: AuthenticatedRequest,
): string | null {
  return req.user?.uid || null;
}

/**
 * Check if user is authenticated and send error if not
 * @param req - Authenticated request
 * @param res - Express response
 * @returns true if authenticated, false if not (response sent)
 */
export function isAuthenticated(
  req: AuthenticatedRequest,
  res: Response,
): boolean {
  const userId = req.user?.uid;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }

  return true;
}
