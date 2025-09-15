import { Router } from "express";
import * as channelController from "./channel.controller";
import { authMiddleware } from "@/middleware/authMiddleware";
import { validateNumericParams } from "@/middleware/validationMiddleware";
import * as projectController from "@/api/projects/project.controller";

const router: Router = Router();

router.use(authMiddleware);

router.post("/", channelController.createChannelController);

// GET /api/channels/:channelId
// Gets a single channel by its unique ID.
router.get(
    "/:channelId",
    validateNumericParams("channelId"),
    channelController.getChannelByIdController,
);

// PATCH /api/channels/:channelId
// Updates a channel's details (e.g., its name or description).
// router.patch(
//     "/:channelId",
//     validateNumericParams("channelId"),
//     channelController.updateChannelController,
// );

// DELETE /api/channels/:channelId
// Deletes a channel.
router.delete(
    "/:channelId",
    validateNumericParams("channelId"),
    channelController.deleteChannelController,
);


export default router;

