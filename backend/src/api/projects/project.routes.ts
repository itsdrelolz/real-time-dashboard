import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import * as projectController from "./project.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import channelRouter from "../channels/channel.routes";
import taskRouter from "../tasks/task.routes";
const router: Router = Router();
router.use(authMiddleware);

router.get("/", projectController.getAllUserProjectsController);
router.post("/", projectController.createProjectController);

const projectIdValidator = (req: Request, res: Response, next: NextFunction) =>
  next();

// Specific routes first (to avoid conflicts with nested routers)
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

// Generic project routes
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

// Nested routers last (to avoid conflicts with specific routes)
router.use("/:projectId/channels", projectIdValidator, channelRouter);
router.use("/:projectId/tasks", projectIdValidator, taskRouter);

// channel-specific routes are delegated to channelRouter above

export default router;
