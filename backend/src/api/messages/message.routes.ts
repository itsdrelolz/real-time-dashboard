import { Router } from "express";
import * as messageController from "./message.controller";
import { authMiddleware } from "@/middleware/authMiddleware";

const router: Router = Router();

router.use(authMiddleware);

router.get("/", messageController.getMessagesForChannelController);

export default router;