import { Project, User } from "@prisma/client";
import {
  CreateProjectBody,
  UpdateProjectBody,
  UpdateProjectMemberBody,
  ProjectDetailsResponse,
  AddProjectMemberBody,
  BasicProjectResponse,
} from "../../types/project.types";
import prisma from "@/utils/prismaClient";

class ProjectService {
  public async getProjectSummariesForUser(
    userId: string,
  ): Promise<BasicProjectResponse[]> {
    try {
      // first verify that the user is a member of the project
      const projects = await prisma.project.findMany({
        where: {
          members: { some: { id: userId } },
        },
      });
      return projects as BasicProjectResponse[];
    } catch (error) {
      console.error("Failed to get project summaries for user", error);
      throw error;
    }
  }

  public async getProjectById(
    id: string,
  ): Promise<ProjectDetailsResponse | null> {
    try {
      // first verify that the user is a member of the project

      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          members: true,
          tasks: true,
          creator: true,
          channels: true,
        },
      });
      return project as ProjectDetailsResponse;
    } catch (error) {
      console.error("Failed to get project by id", error);
      throw error;
    }
  }

  public async createProject(
    projectData: CreateProjectBody,
    creatorId: string,
  ): Promise<Project> {
    try {
      const newProject = await prisma.project.create({
        data: {
          name: projectData.name,
          description: projectData.description,
          creator: {
            connect: { id: creatorId },
          },
          members: {
            connect: { id: creatorId },
          },
        },
      });
      return newProject;
    } catch (error) {
      console.error("Failed to create project", error);
      throw error;
    }
  }

  public async updateProject(
    id: string,
    projectData: UpdateProjectBody,
  ): Promise<Project> {
    try {
      const updatedProject = await prisma.project.update({
        where: { id },
        data: projectData,
      });
      return updatedProject;
    } catch (error) {
      console.error("Failed to update project", error);
      throw error;
    }
  }
  public async deleteProject(id: string): Promise<Project> {
    try {
      const deletedProject = await prisma.project.delete({
        where: { id },
      });
      return deletedProject;
    } catch (error) {
      console.error("Failed to delete project", error);
      throw error;
    }
  }

  public async addMemberToProject(
    projectId: string,
    body: AddProjectMemberBody,
  ): Promise<Project> {
    try {
      const member = await prisma.user.findUnique({
        where: { username: body.username },
      });

      if (!member) {
        throw new Error("Member not found");
      }
      const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: { members: { connect: { id: member.id } } },
      });
      return updatedProject;
    } catch (error) {
      console.error("Failed to add member to project", error);
      throw error;
    }
  }

  public async updateProjectMember(
    projectId: string,
    body: UpdateProjectMemberBody,
  ): Promise<Project> {
    try {
      const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: { members: { connect: { username: body.username } } },
      });
      return updatedProject;
    } catch (error) {
      console.error("Failed to update project member", error);
      throw error;
    }
  }

  public async removeMemberFromProject(
    projectId: string,
    body: UpdateProjectMemberBody,
  ): Promise<Project> {
    try {
      const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: { members: { disconnect: { username: body.username } } },
      });
      return updatedProject;
    } catch (error: any) {
      console.error("Failed to remove member from project", error);
      throw new Error("Failed to remove member from project");
    }
  }

  public async getProjectOwnerId(projectId: string): Promise<string | null> {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { creatorId: true },
      });
      return project?.creatorId || null;
    } catch (error) {
      console.error("Failed to get project owner id", error);
      throw error;
    }
  }

  public async getProjectMembers(projectId: string): Promise<User[]> {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { members: true },
      });
      return project?.members || [];
    } catch (error) {
      console.error("Failed to get project members", error);
      throw error;
    }
  }
}

export const projectService = new ProjectService();
