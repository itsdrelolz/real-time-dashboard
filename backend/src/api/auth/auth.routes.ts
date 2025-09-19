import { Router } from "express";
import {
  signupController,
  signinController,
  getProfileController,
  signOutController,
} from "./auth.controller.js";
import { limiter } from "../../middleware/rateLimit.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
const router: Router = Router();

router.post("/register", signupController);

//limits login attempts
router.post("/login", limiter, signinController);

router.get("/me", authMiddleware, getProfileController);

router.post("/signout", authMiddleware, signOutController);
export default router;
