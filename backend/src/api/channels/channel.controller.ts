import { getAllChannelsForProject, getChannelById, createChannel, updateChannel, deleteChannel } from "./channel.service";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "@/middleware/authMiddleware";
import { RequestWithNumericParams } from "@/middleware/validationMiddleware";


 export async function getAllChannelsForProjectController(req: AuthenticatedRequest, res: Response) {

    try {
        const { projectId } = req.body;

        if (!projectId) {
            return res.status(400).json({error: "Missing required fields"});
        }


        const channels = await getAllChannelsForProject(projectId)

        return res.status(200).json({
            message: "Channels retrieved successfully",
            channels,
        });
    } catch (error: unknown) {
        console.error('Error retrieving channels:', error);
        return res.status(500).json({
            error: "Internal server error",
        })
    }
}

export async function getChannelByIdController(req: AuthenticatedRequest, res: Response) {
    try {
        const {projectId, channelId} = req.body;

        if (!projectId || !channelId) {
            return res.status(400).json({error: "Missing required fields"});
        }

        const channel = await getChannelById(channelId);

        return res.status(200).json({
            message: "Channel retrieved successfully",
            channel,
        });

    } catch (error) {
        console.error('Error retrieving channel: ', error);
        return res.status(500).json({
            error: "Internal server error",
        })
    }
}



export async function createChannelController(req: Request, res: Response) {
    try {
        const {projectId, name, description} = req.body;


        if (!projectId || !name || !description) {
            return res.status(400).json({error: "Missing required fields"});
        }

        const newChannel = await createChannel({projectId, name, description});

        return res.status(201).json({
            message: "Channel created successfully",
            newChannel,
        });

    } catch (error) {
        console.error('Error retrieving channel: ', error);
        return res.status(500).json({
            error: "Internal server error",
        })
    }
}



export async function deleteChannelController(req: RequestWithNumericParams, res: Response) {
    try {

        const channelId  = parseInt(req.params.channelId as string , 10);


        if (isNaN(channelId)) {
            return res.status(400).json({
                error: "Project ID must be a valid number.",
            });
        }
        await deleteChannel(channelId)
    } catch (error: unknown) {
        console.error('Error deleting channel: ', error);
        return res.status(500).json({
            error: "Internal server error",
        })
    }
}