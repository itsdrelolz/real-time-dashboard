import { Router } from "express";
import * as projectController from "./project.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, projectController.getAllProjectsController);

router.post("/", authMiddleware, projectController.createProjectController);

// add validation for req params, middleware function
router.get(
  "/:projectId",
  authMiddleware,
  projectController.getProjectByIdController,
);

// PATCH /api/projects/:projectId - Update a project's details
// add validation for req params, middleware function
router.patch(
  "/:projectId",
  authMiddleware,
  projectController.updateProjectController,
);

// add validation for req params, middleware function
// DELETE /api/projects/:projectId - Delete a project
router.delete(
  "/:projectId",
  authMiddleware,
  projectController.deleteProjectController,
);

// --- Routes for Project Members ---

// add validation for req params, middleware function
// GET /api/projects/:projectId/members - Get all members of a project
router.get(
  "/:projectId/members",
  authMiddleware,
  projectController.getProjectMembersController,
);

// add validation for req params, middleware function
router.post(
  "/:projectId/members",
  authMiddleware,
  projectController.addProjectMembersController,
);

// add validation for req params, middleware function
// DELETE /api/projects/:projectId/members/:profileId - Remove a member from a project
router.delete(
  "/:projectId/members/:profileId",
  authMiddleware,
  projectController.removeMemberFromProjectController,
);

export default router;
