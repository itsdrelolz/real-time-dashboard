import { Response } from "express";
import {
    createProject,
    deleteProject,
    getProjectSummariesForUser,
    getProjectById,
    getProjectMembers,
    addMemberToProject,
    updateProjectDetails,
    removeMemberFromProject,
    getProjectOwnerId,
} from "./project.service";

import { AuthenticatedRequest } from "@/middleware/authMiddleware";

export async function createProjectController(req: AuthenticatedRequest, res: Response) {
    try {
        const { name } = req.body;
        const ownerId = req.user?.id; // Use the authenticated user's ID

        if (!name || !ownerId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newProject = await createProject({ name, ownerId });
        return res.status(201).json({ message: "Project created successfully", newProject });
    } catch (error) {
        console.error("Create Project error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function getProjectByIdController(req: AuthenticatedRequest, res: Response) {
    try {
        const projectId = parseInt(req.params.projectId as string, 10);
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (isNaN(projectId)) {
            return res.status(400).json({ error: "Invalid Project ID." });
        }

        const project = await getProjectById(projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found." });
        }

        // Authorization: User must be a member to view details
        const isMember = project.members.some(member => member.profileId === userId);
        if (!isMember) {
            return res.status(403).json({ error: "Forbidden: You are not a member of this project." });
        }

        return res.status(200).json({ message: "Project successfully retrieved", project });
    } catch (error) {
        console.error("Error retrieving project: ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function getAllUserProjectsController(req: AuthenticatedRequest, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const projects = await getProjectSummariesForUser(userId);
        return res.status(200).json({ message: "Projects successfully retrieved", projects });
    } catch (error) {
        console.error("Error retrieving projects:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function updateProjectController(req: AuthenticatedRequest, res: Response) {
    try {
        const projectId = parseInt(req.params.projectId as string, 10);
        const userId = req.user?.id;
        const { name } = req.body;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (isNaN(projectId)) {
            return res.status(400).json({ error: "Invalid project ID." });
        }
        if (!name || typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({ error: "Project name must be a non-empty string." });
        }

        // Authorization: Only the project owner can update
        const ownerId = await getProjectOwnerId(projectId);
        if (ownerId !== userId) {
            return res.status(403).json({ error: "Forbidden: You are not authorized to update this project." });
        }

        const updatedProject = await updateProjectDetails(projectId, { name });
        return res.status(200).json(updatedProject);
    } catch (error) {
        console.error("Failed to update project:", error);
        return res.status(500).json({ error: "An unexpected error occurred." });
    }
}

export async function deleteProjectController(req: AuthenticatedRequest, res: Response) {
    try {
        const projectId = parseInt(req.params.projectId as string, 10);
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (isNaN(projectId)) {
            return res.status(400).json({ error: "Project ID must be a valid number." });
        }

        // Authorization: Only the project owner can delete
        const ownerId = await getProjectOwnerId(projectId);
        if (ownerId !== userId) {
            return res.status(403).json({ error: "Forbidden: You are not authorized to delete this project." });
        }

        await deleteProject(projectId);
        return res.status(204).send();
    } catch (error) {
        console.error("Failed to delete project", error);
        return res.status(500).json({ error: "An unexpected error occurred while deleting the project" });
    }
}

export async function addProjectMembersController(req: AuthenticatedRequest, res: Response) {
    try {
        const projectId = parseInt(req.params.projectId as string, 10);
        const userId = req.user?.id;
        const { profileId } = req.body;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (isNaN(projectId) || !profileId) {
            return res.status(400).json({ error: "Invalid project ID or missing profile ID." });
        }

        // Authorization: Only the project owner can add members
        const ownerId = await getProjectOwnerId(projectId);
        if (ownerId !== userId) {
            return res.status(403).json({ error: "Forbidden: You are not authorized to add members to this project." });
        }

        const newMember = await addMemberToProject({ projectId, profileId });
        return res.status(201).json({ message: "Project member added", newMember });
    } catch (error) {
        console.error("Error adding project member:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}