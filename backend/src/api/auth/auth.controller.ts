import { signupUser, signinUser, signoutUser } from "./auth.service";
import { Request, Response } from "express";
import { isSupabaseAuthError } from "@/types/error.types";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";

export async function signupController(req: Request, res: Response) {
  try {
    const { email, password, displayName, ...options } = req.body;

    if (!email || !password || !displayName) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    const { profile, session } = await signupUser({
      email,
      password,
      displayName,
      ...options,
    });

    res.status(201).json({
      message: "User created successfully.",
      profile,
      session,
    });
  } catch (error: unknown) {
    if (
      isSupabaseAuthError(error) &&
      error.message.includes("User already registered")
    ) {
      return res.status(409).json({
        error: "A user with this email already exists.",
      });
    }

    console.error("Sign up error:", error);
    res.status(500).json({
      error: "Internal server error during signup",
    });
  }
}

export async function signinController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const { profile, session } = await signinUser({
      email,
      password,
    });

    res.status(200).json({
      message: "Logged in successfully.",
      profile,
      session,
    });
  } catch (error: unknown) {
    if (
      isSupabaseAuthError(error) &&
      error.message.includes("Invalid login credentials")
    ) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    console.error("Sign in error:", error);
    res.status(500).json({
      error: "Internal server error during sign-in",
    });
  }
}

export async function getProfileController(
  req: AuthenticatedRequest,
  res: Response,
) {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res
      .status(404)
      .json({ error: "User profile not found after authentication." });
  }
}

export async function signOutController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1] as string;

    await signoutUser(token);

    return res.status(204).send();
  } catch (error: unknown) {
    console.error("Sign out error:", error);
    return res.status(500).json({ error: "Failed to sign out" });
  }
}
