import prisma from "../../utils/prismaClient";
import type {
    AddProjectMemberData,
    CreateProjectData,
    DetailedProjectPayload,
    Project,
    ProjectMember,
    ProjectMemberProfile,
    ProjectSummaryPayload,
    UpdateProjectDetailsData,
} from "../../types";


export async function createProject(data: CreateProjectData): Promise<Project> {
    try {
        return await prisma.project.create({
            data: {
                name: data.name,
                ownerId: data.ownerId,
                channels: {
                    create: [{ name: "general", description: "General project discussions" }],
                },
                members: {
                    create: [{ profileId: data.ownerId }],
                },
            },
        });
    } catch (error) {
        console.error("Error creating project:", error);
        throw new Error("Failed to create project.");
    }
}


export async function getProjectById(
    projectId: number,
): Promise<DetailedProjectPayload | null> {
    try {
        return await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                owner: { select: { id: true, displayName: true } },
                members: {
                    include: {
                        profile: { select: { id: true, displayName: true } },
                    },
                },
                tasks: true,
                channels: {
                    select: { id: true, name: true, taskId: true },
                },
            },
        });
    } catch (error) {
        console.error(`Error fetching project with ID ${projectId}:`, error);
        throw new Error("Failed to retrieve project details.");
    }
}


export async function getProjectSummariesForUser(
    userId: string,
): Promise<ProjectSummaryPayload[]> {
    try {
        return await prisma.project.findMany({
            where: {
                members: {
                    some: { profileId: userId },
                },
            },
            select: {
                id: true,
                name: true,
            },
        });
    } catch (error) {
        console.error(`Error fetching project summaries for user ${userId}:`, error);
        throw new Error("Failed to retrieve project summaries.");
    }
}


export async function updateProjectDetails(
    projectId: number,
    data: UpdateProjectDetailsData,
): Promise<Project> {
    try {
        return await prisma.project.update({
            where: { id: projectId },
            data: {
                name: data.name,
            },
        });
    } catch (error) {
        console.error(`Error updating project ${projectId}:`, error);
        throw new Error("Failed to update project.");
    }
}


export async function deleteProject(projectId: number): Promise<void> {
    try {
        await prisma.project.delete({
            where: { id: projectId },
        });
    } catch (error) {
        console.error(`Error deleting project ${projectId}:`, error);
        throw new Error("Failed to delete project.");
    }
}


export async function addMemberToProject(
    data: AddProjectMemberData,
): Promise<ProjectMember> {
    try {
        return await prisma.projectMember.create({
            data: {
                profileId: data.profileId,
                projectId: data.projectId,
            },
        });
    } catch (error) {
        console.error(`Error adding member to project ${data.projectId}:`, error);
        throw new Error("Failed to add project member.");
    }
}


export async function removeMemberFromProject(
    projectId: number,
    profileId: string,
): Promise<void> {
    try {
        await prisma.projectMember.delete({
            where: {
                projectId_profileId: {
                    projectId: projectId,
                    profileId: profileId,
                },
            },
        });
    } catch (error) {
        console.error(`Error removing member ${profileId} from project ${projectId}:`, error);
        throw new Error("Failed to remove project member.");
    }
}


export async function getProjectMembers(
    projectId: number,
): Promise<ProjectMemberProfile[]> {
    try {
        return await prisma.projectMember.findMany({
            where: {
                projectId: projectId,
            },
            include: {
                profile: {
                    select: {
                        id: true,
                        displayName: true,
                    },
                },
            },
        });
    } catch (error) {
        console.error(`Error fetching members for project ${projectId}:`, error);
        throw new Error("Failed to retrieve project members.");
    }
}


export async function getProjectOwnerId(projectId: number): Promise<string | null> {
    try {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            select: { ownerId: true }
        });
        return project?.ownerId ?? null;
    } catch (error) {
        console.error(`Error fetching owner for project ${projectId}:`, error);
        throw new Error("Failed to retrieve project owner.");
    }
}