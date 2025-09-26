import { Router } from "express";
import * as channelController from "./channel.controller";
import { authenticateMiddleware } from "../../middleware/authMiddleware";
import messageRouter from "../messages/message.routes";
import { sanitizeFields } from "@/middleware/sanitizer";
import { canViewWorkspace } from "@/middleware/authorization/canViewWorkspace";
import { canEditWorkspace } from "@/middleware/authorization/canEditWorkspace";
import { validateChannelId } from "@/validators/indexValidator";
const router: Router = Router({ mergeParams: true });

router.use(authenticateMiddleware);

router.get(
  "/",
  canViewWorkspace,
  channelController.getChannelsController,
);
router.post(
  "/",
  canEditWorkspace,
  sanitizeFields(["name", "description"]),
  channelController.createChannelController,
);
router.get(
  "/:channelId",
  validateChannelId,
  canViewWorkspace,
  channelController.getChannelByIdController,
);
router.put(
  "/:channelId",
  validateChannelId,
  canEditWorkspace,
  sanitizeFields(["name", "description"]),
  channelController.updateChannelController,
);
router.delete(
  "/:channelId",
  validateChannelId,
  canEditWorkspace,
  channelController.deleteChannelController,
);

router.use("/:channelId/messages", messageRouter);

export default router;
