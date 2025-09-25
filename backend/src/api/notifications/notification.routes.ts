import { authMiddleware } from "@/middleware/authMiddleware";
import { Router } from "express";
import { saveTokenController } from "./notification.controller";

const router: Router = Router();

router.post(
  "/api/notifications/save-token",
  authMiddleware,
  saveTokenController,
);

export default router;
