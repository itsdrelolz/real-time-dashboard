import { Router } from "express";
import * as channelController from "./channel.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import messageRouter from "../messages/message.routes";

const router: Router = Router({ mergeParams: true });

router.use(authMiddleware);

router.get("/", channelController.getAllChannelsForProjectController);
router.post("/", channelController.createChannelController);
router.get("/:channelId", channelController.getChannelByIdController);
router.put("/:channelId", channelController.updateChannelController);
router.delete("/:channelId", channelController.deleteChannelController);

router.use("/:channelId/messages", messageRouter);

export default router;
