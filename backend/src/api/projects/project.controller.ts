import { Response } from "express";
import { projectService } from "./project.service";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import { requireAuth } from "../../utils/authUtils";

export async function createProjectController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { name, description } = req.body;
    const ownerId = requireAuth(req, res);

    if (!ownerId) return; // Response already sent by requireAuth
    if (!name) {
      return res.status(400).json({ error: "Project name is required." });
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
    const userId = requireAuth(req, res);

    if (!userId) return; // Response already sent by requireAuth
    if (!projectId) {
      return res.status(400).json({ error: "Invalid Project ID." });
    }

    const project = await projectService.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    const isMember = project.members.some(
      (member: any) => member.profileId === userId,
    );
    if (!isMember) {
      return res
        .status(403)
        .json({ error: "Forbidden: You are not a member of this project." });
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
    const userId = requireAuth(req, res);
    if (!userId) return; // Response already sent by requireAuth

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
    const userId = requireAuth(req, res);
    const { name, description } = req.body;

    if (!userId) return; // Response already sent by requireAuth
    if (!projectId) {
      return res.status(400).json({ error: "Invalid project ID." });
    }
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res
        .status(400)
        .json({ error: "Project name must be a non-empty string." });
    }

    const ownerId = await projectService.getProjectOwnerId(projectId);
    if (ownerId !== userId) {
      return res.status(403).json({
        error: "Forbidden: You are not authorized to update this project.",
      });
    }

    const updatedProject = await projectService.updateProject(projectId, {
      name,
      description,
    });
    return res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Failed to update project:", error);
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
}

export async function deleteProjectController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const projectId = req.params.projectId;
    const userId = requireAuth(req, res);

    if (!userId) return; // Response already sent by requireAuth
    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required." });
    }

    const ownerId = await projectService.getProjectOwnerId(projectId);
    if (ownerId !== userId) {
      return res.status(403).json({
        error: "Forbidden: You are not authorized to delete this project.",
      });
    }

    await projectService.deleteProject(projectId);
    return res.status(204).send();
  } catch (error) {
    console.error("Failed to delete project", error);
    return res.status(500).json({ error: "An unexpected error occurred." });
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
    const userId = requireAuth(req, res);
    const { profileId } = req.body;

    if (!userId) return; // Response already sent by requireAuth
    if (!projectId || !profileId) {
      return res
        .status(400)
        .json({ error: "Invalid project ID or missing profile ID." });
    }

    const ownerId = await projectService.getProjectOwnerId(projectId);
    if (ownerId !== userId) {
      return res
        .status(403)
        .json({ error: "Forbidden: Only the project owner can add members." });
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
    const userId = requireAuth(req, res);

    if (!userId) return; // Response already sent by requireAuth
    if (!projectId || !profileIdToRemove) {
      return res.status(400).json({ error: "Invalid project or profile ID." });
    }

    const ownerId = await projectService.getProjectOwnerId(projectId);
    if (ownerId !== userId) {
      return res.status(403).json({
        error: "Forbidden: Only the project owner can remove members.",
      });
    }

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
