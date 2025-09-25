import {
  CreateTaskBody,
  UpdateTaskBody,
  BasicTaskResponse,
  TaskDetailsResponse,
} from "../../types/task.types";
import prisma from "../../utils/prismaClient";
import { Task } from "@prisma/client";

class TaskService {
  public async getTaskSummariesForProject(
    projectId: string,
  ): Promise<BasicTaskResponse[]> {
    try {
      const tasks = await prisma.task.findMany({
        where: { projectId },
      });
      return tasks as BasicTaskResponse[];
    } catch (error) {
      console.error("Failed to get task summaries for project", error);
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
          assignee: true,
          creator: true,
        },
      });
      return task as TaskDetailsResponse;
    } catch (error) {
      console.error("Failed to get task by id", error);
      throw error;
    }
  }

  public async createTask(
    projectId: string,
    userId: string,
    taskData: CreateTaskBody,
  ): Promise<Task> {
    try {
      // first verify that the user is the creator of the project
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          creatorId: userId,
          members: {
            some: {
              id: userId,
            },
          },
        },
      });
      if (!project) {
        throw new Error("Project not found");
      }
      const task = await prisma.task.create({
        data: {
          ...taskData,
          projectId: projectId,
          creatorId: userId,
        },
      });
      return task;
    } catch (error) {
      console.error("Failed to create task", error);
      throw error;
    }
  }

  public async updateTask(
    taskId: string,
    taskData: UpdateTaskBody,
  ): Promise<Task> {
    try {
      const task = await prisma.task.update({
        where: { id: taskId },
        data: taskData,
      });
      return task;
    } catch (error) {
      console.error("Failed to update task", error);
      throw error;
    }
  }

  public async deleteTask(taskId: string): Promise<Task> {
    try {
      const task = await prisma.task.delete({
        where: { id: taskId },
      });
      return task;
    } catch (error) {
      console.error("Failed to delete task", error);
      throw error;
    }
  }
}

export const taskService = new TaskService();
