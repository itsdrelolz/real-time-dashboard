import { Router } from "express";
import * as channelController from "./channel.controller";
import { authMiddleware } from "@/middleware/authMiddleware";
import { validateNumericParams } from "@/middleware/validationMiddleware";
import messageRouter from "../messages/message.routes"; // Import the message router

const router: Router = Router({ mergeParams: true });

router.use(authMiddleware);

router.post("/", channelController.createChannelController);
router.get("/", channelController.getAllChannelsForProjectController); // This now handles GET /

router.delete(
  "/:channelId",
  validateNumericParams("channelId"),
  channelController.deleteChannelController,
);

router.use(
  "/:channelId/messages",
  validateNumericParams("channelId"),
  messageRouter
);

export default router;