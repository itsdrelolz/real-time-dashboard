import prisma from "@/utils/prismaClient";

import type { CreateChannelData, CreateTaskChannelData } from "@/types";


export async function createChannel(data: CreateChannelData) {
    try {
        return await prisma.channel.create({
            data: {
                name: data.name,
                description: data.description,
                projectId: data.projectId,
            },
        });
    } catch (error) {
        console.error("Error creating channel:", error);
        throw error;
    }
}

export async function getAllChannelsForProject(projectId: number) {
    try {
        return await prisma.channel.findMany({
            where: {
                projectId: projectId,
            },
        });
    } catch (error) {
        console.error("Error fetching channels:", error);
        throw error;
    }
}


export async function getChannelById(channelId: number) {
    try {
        return await prisma.channel.findUnique({
            where: {
                id: channelId,
            },
        });
    } catch (error) {
        console.error("Error fetching channel details:", error);
        throw error;
    }
}

export async function updateChannel(channelId: number, data: CreateChannelData) {
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
        console.error("Error updating channel:", error);
        throw error;
    }
}



export async function deleteChannel( channelId: number) {
    try {

        await prisma.channel.delete({
            where: {
                id: channelId,
            },
        })


    } catch (error) {
        console.error("Error deleting channel:", error);
        throw error;
    }
}