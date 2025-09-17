import { Router } from "express";
import * as channelController from "./channel.controller";
import { authMiddleware } from "@/middleware/authMiddleware";
import { validateNumericParams } from "@/middleware/validationMiddleware";

const router: Router = Router();

router.use(authMiddleware);

const channelIdValidator = validateNumericParams("channelId");

// GET /api/channels/:channelId - Gets a single channel
router.get("/:channelId", channelIdValidator, channelController.getChannelByIdController);

// PATCH /api/channels/:channelId - Updates a single channel
router.patch("/:channelId", channelIdValidator, channelController.updateChannelController);

// DELETE /api/channels/:channelId - Deletes a single channel
router.delete("/:channelId", channelIdValidator, channelController.deleteChannelController);

export default router;
