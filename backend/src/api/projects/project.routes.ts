import { Router } from "express";
import * as projectController from "./project.controller";
import { authMiddleware } from "@/middleware/authMiddleware";
import { validateNumericParams } from "@/middleware/validationMiddleware";
import { getAllChannelsForProjectController } from "@/api/channels/channel.controller";


const router: Router = Router();
router.use(authMiddleware);

router.get("/", projectController.getAllUserProjectsController);

router.post("/", projectController.createProjectController);

const projectIdValidator = validateNumericParams("projectId");

router.get(
  "/:projectId",
  projectIdValidator,
  projectController.getProjectByIdController,
);

// PATCH /api/projects/:projectId - Update a project's details
router.patch(
  "/:projectId",
  projectIdValidator,
  projectController.updateProjectController,
);

// DELETE /api/projects/:projectId - Delete a project
router.delete(
  "/:projectId",
  projectIdValidator,
  projectController.deleteProjectController,
);

// --- Routes for Project Members ---

// GET /api/projects/:projectId/members - Get all members of a project
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

// DELETE /api/projects/:projectId/members/:profileId - Remove a member from a project
router.delete(
  "/:projectId/members/:profileId",
  projectIdValidator,
  projectController.removeMemberFromProjectController,
);

router.get(
    "/:projectId/channels",
    authMiddleware,
    validateNumericParams("projectId"),
    getAllChannelsForProjectController,
);


export default router;
