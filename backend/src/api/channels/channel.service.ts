import prisma from "@/utils/prismaClient";
import type { Channel, CreateChannelData } from "@/types";

export async function createChannel(data: CreateChannelData): Promise<Channel> {
    try {
        return await prisma.channel.create({
            data: {
                name: data.name,
                description: data.description,
                projectId: data.projectId,
                taskId: data.taskId || null,
            },
        });
    } catch (error) {
        console.error("Error creating channel:", error);
        throw new Error("Failed to create channel.");
    }
}

export async function getAllChannelsForProject(projectId: number): Promise<Channel[]> {
    try {
        return await prisma.channel.findMany({
            where: {
                projectId: projectId,
            },
        });
    } catch (error) {
        console.error(`Error fetching channels for project ${projectId}:`, error);
        throw new Error("Failed to retrieve channels.");
    }
}

export async function getChannelsForTask(taskId: number): Promise<Channel[]> {
    try {
        return await prisma.channel.findMany({
            where: {
                taskId: taskId,
            },
        });
    } catch (error) {
        console.error(`Error fetching channels for task ${taskId}:`, error);
        throw new Error("Failed to retrieve task channels.");
    }
}

export async function getChannelById(channelId: number): Promise<Channel | null> {
    try {
        return await prisma.channel.findUnique({
            where: {
                id: channelId,
            },
        });
    } catch (error) {
        console.error(`Error fetching channel with ID ${channelId}:`, error);
        throw new Error("Failed to retrieve channel details.");
    }
}

export async function updateChannel(channelId: number, data: Partial<CreateChannelData>): Promise<Channel> {
    try {
        return await prisma.channel.update({
            where: {
                id: channelId,
            },
            data: {
                name: data.name,
                description: data.description,
            },
        });
    } catch (error) {
        console.error(`Error updating channel ${channelId}:`, error);
        throw new Error("Failed to update channel.");
    }
}

export async function deleteChannel(channelId: number): Promise<void> {
    try {
        await prisma.channel.delete({
            where: {
                id: channelId,
            },
        });
    } catch (error) {
        console.error(`Error deleting channel ${channelId}:`, error);
        throw new Error("Failed to delete channel.");
    }
}