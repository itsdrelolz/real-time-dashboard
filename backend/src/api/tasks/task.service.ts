import prisma from "../../utils/prismaClient";
import type { CreateTaskData, Task, UpdateTaskData } from "../../types/task.types";


export async function createTask(data: CreateTaskData): Promise<Task> {
    try {
        return prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                channelId: data.channelId,
            }
        });
    } catch (error) {
        console.error("Error creating task:", error);
        throw new Error("Failed to create task.");
    }
}

export async function getTaskById(id: string): Promise<Task | null> {
    try {
        return prisma.task.findUnique({
            where: { id },
        });
    } catch (error) {
        console.error("Error getting task by id:", error);
        throw new Error("Failed to get task by id.");
    }
}

export async function updateTask(id: string, data: UpdateTaskData): Promise<Task> {
    try {
        return prisma.task.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                status: data.status,
                priority: data.priority,
                assigneeId: data.assigneeId,
            }
        });
    } catch (error) {
        console.error("Error updating task:", error);
        throw new Error("Failed to update task.");
    }
}

export async function deleteTask(id: string): Promise<void> {
    try {
        await prisma.task.delete({
            where: { id },
        });
    } catch (error) {
        console.error("Error deleting task:", error);
        throw new Error("Failed to delete task.");
    }
}