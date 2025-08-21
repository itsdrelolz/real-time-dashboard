import prisma from "../../utils/prismaClient";
import type {
  CreateProjectData,
  AddProjectMemberData,
  DetailedProjectPayload,
  ProjectSummaryPayload,
  UpdateProjectDetailsData,
  Project,
  ProjectMember,
  ProjectMemberProfile,
} from "@/types";

/*
 * Function creates a new project along with an initial general channel
 *
 *
 *
 * */

export async function createProject(data: CreateProjectData): Promise<Project> {
  const newProject = await prisma.project.create({
    data: {
      name: data.name,
      ownerId: data.ownerId,
      channels: {
        create: [
          { name: "general", description: "General project discussions" },
        ],
      },
      members: {
        create: [
          {
            profileId: data.ownerId,
          },
        ],
      },
    },
  });
  return newProject;
}

export async function getProjectById(
  projectId: number,
): Promise<DetailedProjectPayload | null> {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      owner: { select: { id: true, displayName: true } },
      members: {
        include: {
          profile: { select: { id: true, displayName: true } },
        },
      },
      tasks: true,
      channels: {
        select: {
          id: true,
          name: true,
          taskId: true,
        },
      },
    },
  });

  return project;
}

export async function getProjectSummariesForUser(
  userId: string,
): Promise<ProjectSummaryPayload[]> {
  const projects = await prisma.project.findMany({
    where: {
      members: {
        some: {
          profileId: userId,
        },
      },
    },
    select: {
      id: true,
      name: true,
    },
  });
  return projects;
}

export async function updateProjectDetails(
  projectId: number,
  data: UpdateProjectDetailsData,
): Promise<Project> {
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      name: data.name,
    },
  });
  return updatedProject;
}

export async function deleteProject(projectId: number): Promise<void> {
  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });
}

export async function addMemberToProject(
  data: AddProjectMemberData,
): Promise<ProjectMember> {
  const newMember = await prisma.projectMember.create({
    data: {
      profileId: data.profileId,
      projectId: data.projectId,
    },
  });
  return newMember;
}

export async function removeMemberFromProject(
  projectId: number,
  profileId: string,
): Promise<void> {
  await prisma.projectMember.delete({
    where: {
      projectId_profileId: {
        projectId: projectId,
        profileId: profileId,
      },
    },
  });
}

export async function getProjectMembers(
  projectId: number,
): Promise<ProjectMemberProfile[]> {
  const members = await prisma.projectMember.findMany({
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
  return members;
}
