import prisma from "../../utils/prismaClient";
import type { Channel, CreateChannelData, UpdateChannelData } from "../../types/channel.types";



export async function createChannel(data: CreateChannelData): Promise<Channel> {
    try {
    return prisma.channel.create({
        data: {
            name: data.name,
            topic: data.topic,
            projectId: data.projectId,
        }
    });
    } catch (error) {
        console.error("Error creating channel:", error);
        throw new Error("Failed to create channel.");
    }
}


export async function getChannelById(id: string): Promise<Channel | null> {
    try {
    return prisma.channel.findUnique({
        where: { id },
        include: {
            messages: {
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                },
                orderBy: { createdAt: 'asc' }
            },
            tasks: {
                include: {
                    assignee: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            }
        }
    });
    } catch (error) {
        console.error("Error getting channel by id:", error);
        throw new Error("Failed to get channel by id.");
    }
}

export async function updateChannel(id: string, data: UpdateChannelData): Promise<Channel> {
    try {
    return prisma.channel.update({
        where: { id },
        data: { 
            name: data.name,
            topic: data.topic,
        },
    });
    } catch (error) {
        console.error("Error updating channel:", error);
        throw new Error("Failed to update channel.");
    }
}

export async function deleteChannel(id: string): Promise<void> {
    try {
    await prisma.channel.delete({
        where: { id },
    });
    } catch (error) {
        console.error("Error deleting channel:", error);
        throw new Error("Failed to delete channel.");
    }
}

export async function getChannelsByProjectId(projectId: string): Promise<Channel[]> {
    try {
        return prisma.channel.findMany({
            where: { projectId },
            include: {
                messages: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                },
                tasks: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        assignee: {
                            select: {
                                id: true,
                                username: true,
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        });
    } catch (error) {
        console.error("Error getting channels by project id:", error);
        throw new Error("Failed to get channels by project id.");
    }
}