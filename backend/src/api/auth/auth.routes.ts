import { Router } from "express";
import {
  signupController,
  signinController,
  getProfileController,
  signOutController,
} from "./auth.controller";
import { limiter } from "../../middleware/rateLimit";
import { authMiddleware } from "../../middleware/authMiddleware";
const router: Router = Router();

router.post("/register", signupController);

//limits login attempts
router.post("/login", limiter, signinController);

router.get("/me", authMiddleware, getProfileController);

router.post("/signout", authMiddleware, signOutController);
export default router;
