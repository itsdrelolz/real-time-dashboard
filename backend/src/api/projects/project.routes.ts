import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import * as projectController from "./project.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
// numeric param validation removed; ids are UUID strings
import channelRouter from "../channels/channel.routes";

const router: Router = Router();
router.use(authMiddleware);

router.get("/", projectController.getAllUserProjectsController);
router.post("/", projectController.createProjectController);

const projectIdValidator = (req: Request, res: Response, next: NextFunction) =>
  next();

router.get(
  "/:projectId",
  projectIdValidator,
  projectController.getProjectByIdController,
);
router.patch(
  "/:projectId",
  projectIdValidator,
  projectController.updateProjectController,
);
router.delete(
  "/:projectId",
  projectIdValidator,
  projectController.deleteProjectController,
);

router.use("/:projectId/channels", projectIdValidator, channelRouter);

router.get(
  "/:projectId/members",
  projectIdValidator,
  projectController.getProjectMembersController,
);
router.post(
  "/:projectId/members",
  projectIdValidator,
  projectController.addProjectMembersController,
);
router.delete(
  "/:projectId/members/:profileId",
  projectIdValidator,
  projectController.removeMemberFromProjectController,
);

// channel-specific routes are delegated to channelRouter above

export default router;
