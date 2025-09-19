import { Router } from "express";
import * as channelController from "./channel.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { validateNumericParams } from "../../middleware/validationMiddleware";
import messageRouter from "../messages/message.routes"; 

const router: Router = Router({ mergeParams: true });

router.use(authMiddleware);

router.post("/", channelController.createChannelController);
router.get("/", channelController.getAllChannelsForProjectController); 


router.get("/tasks/:taskId/channels", channelController.getChannelsForTaskController);

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