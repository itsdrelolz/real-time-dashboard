import prisma from "../../utils/prismaClient";

export async function getMessagesForChannel(channelId: number) {

    try {
        return await prisma.message.findMany({
            where: {
                channelId: channelId,
            },
            include: {
                author: true,
            },
        });
    } catch (error) {
        console.error(`Error fetching messages for channel ${channelId}:`, error);
        throw new Error("Failed to retrieve messages.");
    }
}


export async function createMessage(data: { content: string; authorId: string; channelId: number; }) {
    try {
        return await prisma.message.create({
            data: {
                content: data.content,
                authorId: data.authorId,
                channelId: data.channelId,
            },
        });
    } catch (error) {
        console.error("Error creating message:", error);
        throw new Error("Failed to create message.");
    }
}