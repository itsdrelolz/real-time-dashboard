import { Router } from "express";
import * as projectController from "./project.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { validateNumericParams } from "../../middleware/validationMiddleware";

const router = Router();

router.get("/", authMiddleware, projectController.getAllUserProjectsController);

router.post("/", authMiddleware, projectController.createProjectController);

const projectIdValidator = validateNumericParams("projectId");

router.get(
  "/:projectId",
  authMiddleware,
  projectIdValidator,
  projectController.getProjectByIdController,
);

// PATCH /api/projects/:projectId - Update a project's details
router.patch(
  "/:projectId",
  authMiddleware,
  projectIdValidator,
  projectController.updateProjectController,
);

// DELETE /api/projects/:projectId - Delete a project
router.delete(
  "/:projectId",
  authMiddleware,
  projectIdValidator,
  projectController.deleteProjectController,
);

// --- Routes for Project Members ---

// GET /api/projects/:projectId/members - Get all members of a project
router.get(
  "/:projectId/members",
  authMiddleware,
  projectIdValidator,
  projectController.getProjectMembersController,
);

router.post(
  "/:projectId/members",
  authMiddleware,
  projectIdValidator,
  projectController.addProjectMembersController,
);

// DELETE /api/projects/:projectId/members/:profileId - Remove a member from a project
router.delete(
  "/:projectId/members/:profileId",
  authMiddleware,
  projectIdValidator,
  projectController.removeMemberFromProjectController,
);

export default router;
