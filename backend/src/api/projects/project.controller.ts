import { Request, Response } from "express";
import {
  createProject,
  deleteProject,
  getProjectSummariesForUser,
  getProjectById,
  getProjectMembers,
  addMemberToProject,
  updateProjectDetails,
  removeMemberFromProject,
} from "./project.service";
import type { AddProjectMemberData, UpdateProjectDetailsData } from "@/types";

export async function createProjectController(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { name, ownerId } = req.body;

    if (!name || !ownerId) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const newProject = await createProject({
      name,
      ownerId,
    });

    return res.status(201).json({
      message: "Project created successfully",
      newProject,
    });
  } catch (error: unknown) {
    console.error("Create Project error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

export async function getProjectByIdController(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { projectId } = req.body;

    const project = await getProjectById(projectId);

    return res.status(200).json({
      message: "Project successfully retrieved",
      project,
    });
  } catch (error: unknown) {
    console.error("Error retrieving project: ", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

export async function getAllProjectsController(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { userId } = req.body;

    const projects = await getProjectSummariesForUser(userId);

    return res.status(200).json({
      message: "Projects successfully retrieved",
      projects,
    });
  } catch (error: unknown) {
    console.error("Error retrieving projects:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

export async function deleteProjectController(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const projectId = parseInt(req.params.projectId as string, 10);

    if (isNaN(projectId)) {
      return res.status(400).json({
        error: "Project ID must be a valid number.",
      });
    }

    await deleteProject(projectId);

    return res.status(204).send();
  } catch (error: unknown) {
    console.error("Failed to delete project");
    return res.status(500).json({
      error: "An unexpected error occurred while deleting the project",
    });
  }
}

export async function getProjectMembersController(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { projectId } = req.body;

    const projectMembers = await getProjectMembers(projectId);

    return res.status(200).json({
      message: "Projects members retrieved",
      projectMembers,
    });
  } catch (error: unknown) {
    console.error("Error retrieving project members:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

export async function addProjectMembersController(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const projectId = parseInt(req.params.projectId as string, 10);
    const { profileId } = req.body;

    if (isNaN(projectId) || !profileId) {
      return res
        .status(400)
        .json({ error: "Invalid project ID or missing profile ID." });
    }

    const memberData: AddProjectMemberData = {
      projectId,
      profileId,
    };

    const newMember = await addMemberToProject(memberData);

    return res.status(201).json({
      message: "Project member added",
      newMember,
    });
  } catch (error: unknown) {
    console.error("Error adding project member:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}


export async function updateProjectController(req: Request, res: Response): Promise<Response> { 

try {
    const projectId = parseInt(req.params.projectId as string, 10);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID.' });
    }

    const { name } = req.body;

    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
      return res.status(400).json({ error: 'Project name must be a non-empty string.' });
    }

    const updateData: UpdateProjectDetailsData = {
      name,
    };

    const updatedProject = await updateProjectDetails(projectId, updateData);

    return res.status(200).json(updatedProject);

  } catch (error) {
    console.error('Failed to update project:', error);
    return res.status(500).json({ error: 'An unexpected error occurred.' });
  }
}




export async function removeMemberFromProjectController(req: Request, res: Response): Promise<Response> { 
   try {
    const projectId = parseInt(req.params.projectId as string, 10);
    const { profileId } = req.body;

    if (isNaN(projectId) || !profileId) {
      return res
        .status(400)
        .json({ error: "Invalid project ID or missing profile ID." });
    }


    await removeMemberFromProject(projectId, profileId);
    
    return res.status(204).send()
    } catch (error) { 
    console.error("Error deleting project member:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
	
    }

}


