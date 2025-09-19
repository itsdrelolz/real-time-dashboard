import { Router } from "express";
import * as projectController from "./project.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { validateNumericParams } from "../../middleware/validationMiddleware";
import {
  getAllChannelsForProjectController,
  createChannelController
} from "../channels/channel.controller";
import channelRouter from "../channels/channel.routes";

const router: Router = Router();
router.use(authMiddleware);

router.get("/", projectController.getAllUserProjectsController);
router.post("/", projectController.createProjectController);


const projectIdValidator = validateNumericParams("projectId");

router.get("/:projectId", projectIdValidator, projectController.getProjectByIdController);
router.patch("/:projectId", projectIdValidator, projectController.updateProjectController);
router.delete("/:projectId", projectIdValidator, projectController.deleteProjectController);


router.use("/:projectId/channels", projectIdValidator, channelRouter);

router.get("/:projectId/members", projectIdValidator, projectController.getProjectMembersController);
router.post("/:projectId/members", projectIdValidator, projectController.addProjectMembersController);
router.delete("/:projectId/members/:profileId", projectIdValidator, projectController.removeMemberFromProjectController);


router.get(
  "/:projectId/channels",
  projectIdValidator,
  getAllChannelsForProjectController,
);

router.post(
  "/:projectId/channels",
  projectIdValidator,
  createChannelController
);


export default router;
