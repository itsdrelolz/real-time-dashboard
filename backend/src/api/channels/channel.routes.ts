import { Router } from "express";
import * as channelController from "./channel.controller";
import { authenticateMiddleware } from "../../middleware/authMiddleware";
import messageRouter from "../messages/message.routes";
import { sanitizeFields } from "@/middleware/sanitizer";
import { canViewProject } from "@/middleware/authorization/canViewProject";
import { canEditProject } from "@/middleware/authorization/canEditProject";
import { validateChannelId } from "@/validators/indexValidator";
const router: Router = Router({ mergeParams: true });

router.use(authenticateMiddleware);

router.get(
  "/",
  canViewProject,
  channelController.getAllChannelsForProjectController,
);
router.post(
  "/",
  canEditProject,
  sanitizeFields(["name", "description"]),
  channelController.createChannelController,
);
router.get(
  "/:channelId",
  validateChannelId,
  canViewProject,
  channelController.getChannelByIdController,
);
router.put(
  "/:channelId",
  validateChannelId,
  canEditProject,
  sanitizeFields(["name", "description"]),
  channelController.updateChannelController,
);
router.delete(
  "/:channelId",
  validateChannelId,
  canEditProject,
  channelController.deleteChannelController,
);

router.use("/:channelId/messages", messageRouter);

export default router;
