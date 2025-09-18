import prisma from "../../utils/prismaClient";
import type { Task, CreateTaskData, TaskWithDetails } from "@/types";


export async function createTask(data: CreateTaskData): Promise<Task> {
    try {
        return await prisma.task.create({
            data,
        });
    } catch (error) {
        console.error("Error creating task:", error);
        throw new Error("Failed to create task.");
    }
}



export async function getTaskById(id: number): Promise<Task> {
    try {
        return await prisma.task.findUniqueOrThrow({
            where: { id },
        });
    } catch (error) {
        console.error("Error getting task by id:", error);
        throw new Error("Failed to get task by id.");
    }
}

export async function updateTask(id: number, data: Partial<Task>): Promise<Task> {
    try {
        return await prisma.task.update({
            where: { id },
            data,
        });
    } catch (error) {
        console.error("Error updating task:", error);
        throw new Error("Failed to update task.");
    }
}


export async function getTasksByProjectId(projectId: number): Promise<Task[]> {
    try {
        return await prisma.task.findMany({
            where: { projectId },
        });
    } catch (error) {
        console.error("Error getting tasks by project id:", error);
        throw new Error("Failed to get tasks by project id.");
    }
}


export async function getTasksByProfileId(profileId: string): Promise<Task[]> {
    try {
        return await prisma.task.findMany({
            where: { assigneeId: profileId },
        });
    } catch (error) {
        console.error("Error getting tasks by profile id:", error);
        throw new Error("Failed to get tasks by profile id.");
    }
}


export async function getTaskWithDetails(id: number): Promise<TaskWithDetails> {
    try {
        return await prisma.task.findUniqueOrThrow({
            where: { id },
            include: {
                assignee: true,
                channel: true,
            },
        });
    }
    catch (error) {
        console.error("Error getting task with details:", error);
        throw new Error("Failed to get task with details.");
    }
}


export async function deleteTask(id: number): Promise<void> {
    try {
        await prisma.task.delete({
            where: { id },
        });
    }
    catch (error) {
        console.error("Error deleting task:", error);
        throw new Error("Failed to delete task.");
    }
}

