import { Router } from "express";

import * as projectController from "./project.controller";
import { authenticateMiddleware } from "../../middleware/authMiddleware";
import { canViewProject } from "../../middleware/authorization/canViewProject";
import { canEditProject } from "../../middleware/authorization/canEditProject";
import channelRouter from "../channels/channel.routes";
import taskRouter from "../tasks/task.routes";
import { validateProjectId } from "@/validators/indexValidator";
import { sanitizeFields } from "@/middleware/sanitizer";

const router: Router = Router();

router.use(authenticateMiddleware);

router.get("/", projectController.getAllUserProjectsController);
router.post(
  "/",
  sanitizeFields(["name", "description"]),
  projectController.createProjectController,
);

// Specific routes first (to avoid conflicts with nested routers)
router.get(
  "/:projectId/members",
  validateProjectId,
  canViewProject,
  projectController.getProjectMembersController,
);

router.post(
  "/:projectId/members",
  validateProjectId,
  canEditProject,
  sanitizeFields(["userId"]),
  projectController.addProjectMembersController,
);

router.delete(
  "/:projectId/members/:profileId",
  validateProjectId,
  canEditProject,
  projectController.removeMemberFromProjectController,
);

// Generic project routes
router.get(
  "/:projectId",
  validateProjectId,
  canViewProject,
  projectController.getProjectByIdController,
);

router.patch(
  "/:projectId",
  validateProjectId,
  canEditProject,
  sanitizeFields(["name", "description"]),
  projectController.updateProjectController,
);

router.delete(
  "/:projectId",
  validateProjectId,
  canEditProject,
  projectController.deleteProjectController,
);

// Nested routers last (to avoid conflicts with specific routes)
router.use(
  "/:projectId/channels",
  validateProjectId,
  canViewProject,
  channelRouter,
);
router.use("/:projectId/tasks", validateProjectId, canViewProject, taskRouter);

// channel-specific routes are delegated to channelRouter above

export default router;
