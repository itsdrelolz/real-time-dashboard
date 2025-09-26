import { Router } from "express";

import * as workspaceController from "./workspace.controller";
import { authenticateMiddleware } from "../../middleware/authMiddleware";
import { canViewWorkspace } from "../../middleware/authorization/canViewWorkspace";
import { canEditWorkspace } from "../../middleware/authorization/canEditWorkspace";
import channelRouter from "../channels/channel.routes";
import taskRouter from "../tasks/task.routes";
import { validateWorkspaceId } from "@/validators/indexValidator";
import { sanitizeFields } from "@/middleware/sanitizer";

const router: Router = Router();

router.use(authenticateMiddleware);

router.get("/", workspaceController.getWorkspacesController);
router.post(
  "/",
  sanitizeFields(["name", "description"]),
  workspaceController.createWorkspaceController,
);

// Specific routes first (to avoid conflicts with nested routers)
router.get(
  "/:workspaceId/members",
  validateWorkspaceId,
  canViewWorkspace,
  workspaceController.getWorkspaceMembersController,
);

router.post(
  "/:workspaceId/members",
  validateWorkspaceId,
  canEditWorkspace,
  sanitizeFields(["username"]),
  workspaceController.addMemberToWorkspaceController,
);

router.delete(
  "/:workspaceId/members/:userId",
  validateWorkspaceId,
  canEditWorkspace,
  workspaceController.removeMemberFromWorkspaceController,
);

// Generic workspace routes
router.get(
  "/:workspaceId",
  validateWorkspaceId,
  canViewWorkspace,
  workspaceController.getWorkspaceByIdController,
);

router.patch(
  "/:workspaceId",
  validateWorkspaceId,
  canEditWorkspace,
  sanitizeFields(["name", "description"]),
  workspaceController.updateWorkspaceController,
);

router.delete(
  "/:workspaceId",
  validateWorkspaceId,
  canEditWorkspace,
  workspaceController.deleteWorkspaceController,
);

// Nested routers last (to avoid conflicts with specific routes)
router.use(
  "/:workspaceId/channels",
  validateWorkspaceId,
  canViewWorkspace,
  channelRouter,
);
router.use("/:workspaceId/tasks", validateWorkspaceId, canViewWorkspace, taskRouter);

// channel-specific routes are delegated to channelRouter above

export default router;