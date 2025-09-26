import {User, Workspace} from "@prisma/client";
import {
    AddWorkspaceMemberBody,
    BasicWorkspaceResponse,
    CreateWorkspaceBody,
    UpdateWorkspaceBody,
    UpdateWorkspaceMemberBody,
    WorkspaceDetailsResponse,
} from "../../types/workspace.types";
import prisma from "@/utils/prismaClient";

class WorkspaceService {
  public async getWorkspaceSummariesForUser(
    userId: string,
  ): Promise<BasicWorkspaceResponse[]> {
    try {
      // first verify that the user is a member of the workspace
      const workspaces = await prisma.workspace.findMany({
        where: {
          members: { some: { userId: userId } },
        },
      });
      return workspaces as BasicWorkspaceResponse[];
    } catch (error) {
      console.error("Failed to get workspace summaries for user", error);
      throw error;
    }
  }

  public async getWorkspaceById(
    id: string,
  ): Promise<WorkspaceDetailsResponse | null> {
    try {
      // first verify that the user is a member of the workspace

      const workspace = await prisma.workspace.findUnique({
        where: { id },
        include: {
          members: {
            include: {
              user: true,
            },
          },
          tasks: true,
          creator: true,
          channels: true,
        },
      });
      return {
        ...workspace,
        members: workspace?.members.map(member => member.user) || [],
      } as WorkspaceDetailsResponse;
    } catch (error) {
      console.error("Failed to get workspace by id", error);
      throw error;
    }
  }

  public async createWorkspace(
    workspaceData: CreateWorkspaceBody,
    creatorId: string,
  ): Promise<Workspace> {
    try {
        return await prisma.workspace.create({
          data: {
              name: workspaceData.name,
              description: workspaceData.description,
              creator: {
                  connect: {id: creatorId},
              },
          },
      });
    } catch (error) {
      console.error("Failed to create workspace", error);
      throw error;
    }
  }

  public async updateWorkspace(
    id: string,
    workspaceData: UpdateWorkspaceBody,
  ): Promise<Workspace> {
    try {
        return await prisma.workspace.update({
          where: {id},
          data: workspaceData,
      });
    } catch (error) {
      console.error("Failed to update workspace", error);
      throw error;
    }
  }

  public async deleteWorkspace(id: string): Promise<Workspace> {
    try {
        return await prisma.workspace.delete({
          where: {id},
      });
    } catch (error) {
      console.error("Failed to delete workspace", error);
      throw error;
    }
  }

  public async addMemberToWorkspace(
    workspaceId: string,
    body: AddWorkspaceMemberBody,
  ): Promise<Workspace> {
    try {
      const member = await prisma.user.findUnique({
        where: { username: body.username },
      });
      if (!member) {
        throw new Error("Member not found");
      }
        return await prisma.workspace.update({
          where: {id: workspaceId},
          data: {
              members: {
                  create: {
                      userId: member.id,
                  }
              }
          },
      });
    } catch (error) {
      console.error("Failed to add member to workspace", error);
      throw error;
    }
  }

  public async updateWorkspaceMember(
    workspaceId: string,
    body: UpdateWorkspaceMemberBody,
  ): Promise<Workspace> {
    try {
        return await prisma.workspace.update({
          where: {id: workspaceId},
          data: {
              members: {
                  create: {
                      userId: body.userId,
                  }
              }
          },
      });
    } catch (error) {
      console.error("Failed to update workspace member", error);
      throw error;
    }
  }

  public async removeMemberFromWorkspace(
    workspaceId: string,
    body: UpdateWorkspaceMemberBody,
  ): Promise<Workspace> {
    try {
        return await prisma.workspace.update({
          where: {id: workspaceId},
          data: {
              members: {
                  delete: {
                      userId_workspaceId: {
                          userId: body.userId,
                          workspaceId: workspaceId,
                      }
                  }
              }
          },
      });
    } catch (error: any) {
      console.error("Failed to remove member from workspace", error);
      throw new Error("Failed to remove member from workspace");
    }
  }

  public async getWorkspaceOwnerId(workspaceId: string): Promise<string | null> {
    try {
      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        select: { creatorId: true },
      });
      return workspace?.creatorId || null;
    } catch (error) {
      console.error("Failed to get workspace owner id", error);
      throw error;
    }
  }

  public async getWorkspaceMembers(workspaceId: string): Promise<User[]> {
    try {
      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        include: { 
          members: {
            include: {
              user: true,
            }
          }
        },
      });
      return workspace?.members.map(member => member.user) || [];
    } catch (error) {
      console.error("Failed to get workspace members", error);
      throw error;
    }
  }
}

export const workspaceService = new WorkspaceService();