import { Socket, Server } from "socket.io";
import { getProjectById} from "@/api/projects/project.service";
import { AuthenticatedRequest} from "@/middleware/authMiddleware";
import { getChannelById } from "@/api/channels/channel.service";
import { createMessage } from "@/api/messages/message.service";

export function registerMessageHandlers(io: Server, socket: Socket) {

    const req = socket.request as AuthenticatedRequest;

    const userId = req.user?.id;

    if (!userId) {
        console.error("User not authenticated");
        socket.disconnect();
        return;
    }

    const joinProjectRoom = async (projectId: number) => {
        try {

            if (!userId) {
                return
            }

            const project = await getProjectById(projectId);

            const isMember = project?.members.some(member => member.profileId === userId);

            if (!isMember) {
                socket.join(`project-${projectId}`);
                return
            }

            const handleNewChannelMessage = async (data: { channelId: number; content: string }) => {

                if (!userId || !data.content) return;


                try {
                    const newMessage = await createMessage({
                        content: data.content,
                        authorId: userId,
                        channelId: data.channelId,
                    })

                    const channel = await getChannelById(data.channelId);

                    if (channel) {
                        io.to(`project-${channel.projectId}`).emit('messageCreated', newMessage);
                    }
                } catch (error) {
                    console.error('Error creating message:', error);
                    socket.emit('messageError', {message: "Could not create message"});
                }
                socket.on("joinProjectRoom", joinProjectRoom);
                socket.on("newChannelMessage", handleNewChannelMessage);
            }
        } catch (error) {
            console.error('Error joining project room:', error);
            socket.emit('messageError', {message: "Could not join project room"});
        }
    }
}






