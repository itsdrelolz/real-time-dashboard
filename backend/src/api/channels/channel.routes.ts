import { Router } from "express";
import * as channelController from "./channel.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import messageRouter from "../messages/message.routes";
import taskRouter from "../tasks/task.routes"; 

const router: Router = Router({ mergeParams: true });

router.use(authMiddleware);

router.get("/", channelController.getAllChannelsForProjectController);
router.post("/", channelController.createChannelController);
 





router.delete(
  "/:channelId",
  channelController.deleteChannelController,
);

router.use(
  "/:channelId/messages",
  messageRouter
);

router.use(
  "/:channelId/tasks",
  taskRouter
);

export default router;