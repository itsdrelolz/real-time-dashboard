import { Router } from "express";
import {
  signupController,
  signinController,
  getProfileController,
} from "./auth.controller";
import { limiter } from "../../middleware/rateLimit";
import { authMiddleware } from "../../middleware/authMiddleware";
const router = Router();

router.post("/register", signupController);

//limits login attempts
router.post("/login", limiter, signinController);

router.get("/me", authMiddleware, getProfileController);
export default router;
