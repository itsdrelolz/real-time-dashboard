import { Response } from "express";
import { projectService } from "./project.service";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";

import { validateProject } from "@/validators/projectValidator";

export async function createProjectController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const validationResult = validateProject(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Invalid project payload",
        details: validationResult.error.message,
      });
    }
    const validatedData = validationResult.data;
    const { name, description } = validatedData;
    const ownerId = req.user?.uid;

    if (!ownerId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const newProject = await projectService.createProject(
      { name, description },
      ownerId,
    );
    return res
      .status(201)
      .json({ message: "Project created successfully", project: newProject });
  } catch (error) {
    console.error("Create Project error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getProjectByIdController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const projectId = req.params.projectId;

    if (!projectId) {
      return res.status(400).json({ error: "Invalid Project ID." });
    }

    const project = await projectService.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    return res.status(200).json({ project });
  } catch (error) {
    console.error("Error retrieving project: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAllUserProjectsController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const projects = await projectService.getProjectSummariesForUser(userId);
    return res.status(200).json({ projects });
  } catch (error) {
    console.error("Error retrieving projects:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateProjectController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const projectId = req.params.projectId;
    const validationResult = validateProject(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Invalid project payload",
        details: validationResult.error.message,
      });
    }

    const validatedData = validationResult.data;

    if (!projectId) {
      return res.status(400).json({ error: "Invalid project ID." });
    }

    const updatedProject = await projectService.updateProject(projectId, {
      name: validatedData.name,
      description: validatedData.description,
    });
    return res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Failed to update project:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteProjectController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const projectId = req.params.projectId;

    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required." });
    }

    await projectService.deleteProject(projectId);
    return res.status(204).send();
  } catch (error) {
    console.error("Failed to delete project", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getProjectMembersController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const projectId = req.params.projectId;
    if (!projectId) {
      return res.status(400).json({ error: "Invalid project ID." });
    }
    const members = await projectService.getProjectMembers(projectId);
    return res.status(200).json({ members });
  } catch (error) {
    console.error("Error retrieving project members:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function addProjectMembersController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const projectId = req.params.projectId;
    const { profileId } = req.body;

    if (!projectId || !profileId) {
      return res
        .status(400)
        .json({ error: "Invalid project ID or missing profile ID." });
    }

    const newMember = await projectService.addMemberToProject(projectId, {
      username: profileId,
    });
    return res
      .status(201)
      .json({ message: "Project member added", member: newMember });
  } catch (error) {
    console.error("Error adding project member:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function removeMemberFromProjectController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const projectId = req.params.projectId;
    const profileIdToRemove = req.params.profileId;

    if (!projectId || !profileIdToRemove) {
      return res.status(400).json({ error: "Invalid project or profile ID." });
    }

    const ownerId = await projectService.getProjectOwnerId(projectId);
    if (ownerId === profileIdToRemove) {
      return res
        .status(400)
        .json({ error: "Project owner cannot be removed." });
    }

    await projectService.removeMemberFromProject(projectId, {
      username: profileIdToRemove,
    });
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting project member:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
