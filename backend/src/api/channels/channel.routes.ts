import { Router } from "express";
import * as channelController from "./channel.controller";
import { authMiddleware } from "@/middleware/authMiddleware";
import { validateNumericParams } from "@/middleware/validationMiddleware";

const router: Router = Router();

router.use(authMiddleware);

router.post("/", channelController.createChannelController);


router.get(
    "/:channelId",
    validateNumericParams("channelId"),
    channelController.getAllChannelsForProjectController,
);



router.delete(
    "/:channelId",
    validateNumericParams("channelId"),
    channelController.deleteChannelController,
);


export default router;

