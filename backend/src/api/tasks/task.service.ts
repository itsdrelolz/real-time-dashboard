import {BasicTaskResponse, CreateTaskBody, TaskDetailsResponse, UpdateTaskBody,} from "../../types/task.types";
import prisma from "../../utils/prismaClient";
import {Task} from "@prisma/client";

class TaskService {
  public async getTaskSummariesForWorkspace(
    workspaceId: string,
  ): Promise<BasicTaskResponse[]> {
    try {
      const tasks = await prisma.task.findMany({
        where: { workspaceId },
      });
      return tasks as BasicTaskResponse[];
    } catch (error) {
      console.error("Failed to get task summaries for workspace", error);
      throw error;
    }
  }

  public async getTaskById(
    taskId: string,
  ): Promise<TaskDetailsResponse | null> {
    try {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
          creator: true,
          assignee: true,
        },
      });
      return task as TaskDetailsResponse;
    } catch (error) {
      console.error("Failed to get task by id", error);
      throw error;
    }
  }

  public async createTask(
    workspaceId: string,
    userId: string,
    taskData: CreateTaskBody,
  ): Promise<Task> {
    try {
      // first verify that the user is a member of the workspace
      const workspace = await prisma.workspace.findFirst({
        where: {
          id: workspaceId,
          members: {
            some: { userId: userId },
          },
        },
      });
      if (!workspace) {
        throw new Error("Workspace not found or user not a member");
      }

      return await prisma.task.create({
          data: {
              ...taskData,
              workspaceId: workspaceId,
              creatorId: userId,
          },
      });
    } catch (error) {
      console.error("Failed to create task", error);
      throw error;
    }
  }

  public async updateTask(
    taskId: string,
    userId: string,
    taskData: UpdateTaskBody,
  ): Promise<Task> {
    try {
        return await prisma.task.update({
          where: {id: taskId},
          data: taskData,
      });
    } catch (error) {
      console.error("Failed to update task", error);
      throw error;
    }
  }

  public async deleteTask(taskId: string): Promise<Task> {
    try {
        return await prisma.task.delete({
          where: {id: taskId},
      });
    } catch (error) {
      console.error("Failed to delete task", error);
      throw error;
    }
  }

  public async assignTask(
    taskId: string,
    assigneeId: string,
  ): Promise<Task> {
    try {
        return await prisma.task.update({
          where: {id: taskId},
          data: {assigneeId},
      });
    } catch (error) {
      console.error("Failed to assign task", error);
      throw error;
    }
  }

  public async unassignTask(taskId: string): Promise<Task> {
    try {
        return await prisma.task.update({
          where: {id: taskId},
          data: {assigneeId: null},
      });
    } catch (error) {
      console.error("Failed to unassign task", error);
      throw error;
    }
  }
}

export const taskService = new TaskService();