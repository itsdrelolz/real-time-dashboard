import { Response } from "express";
import {
    createConnection,
    getConnections,
    acceptConnection,
    deleteConnection,
} from "./connection.service";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";

export async function createConnectionController(req: AuthenticatedRequest, res: Response) {
    try { 
        const { addresseeId } = req.body;
        const requesterId = req.user?.id;

        if (!requesterId) {
            return res.status(401).json({ error: "Authentication required" });
        }
        
        if (!addresseeId) {
            return res.status(400).json({ error: "User ID to connect with is required" });
        }

        const connection = await createConnection({ requesterId, addresseeId });
        return res.status(201).json({ message: "Connection created successfully", connection });
    } catch (error) {
        console.error("Error in createConnectionController:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function getConnectionsController(req: AuthenticatedRequest, res: Response) {
    try { 
        const { profileId } = req.params;
        if (!profileId) {
            return res.status(400).json({ error: "Profile ID is required" });
        }
        const connections = await getConnections(profileId);
        return res.status(200).json({ connections });
    } catch (error) {
        console.error("Error in getConnectionsController:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// only the addressee can accept the connection
export async function acceptConnectionController(req: AuthenticatedRequest, res: Response) {
    try { 
        const { requesterId, addresseeId } = req.params;
        const { status } = req.body;
        if (!requesterId || !addresseeId) {
            return res.status(400).json({ error: "Connection ID is required" });
        }
        if (!requesterId || !addresseeId) {
            return res.status(400).json({ error: "Requester ID and Addressee ID are required" });
        }
        if (!status) {
            return res.status(400).json({ error: "Status is required" });
        }
        if (addresseeId !== req.user?.id) {
            return res.status(403).json({ error: "Forbidden: You are not authorized to accept this connection" });
        }
        const connection = await acceptConnection(requesterId, addresseeId, status);
        return res.status(200).json({ message: "Connection accepted successfully", connection });
    } catch (error) {
        console.error("Error in acceptConnectionController:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
/*
a requester can delete the connection 
or the addressee can hide the connection
when hidden the connection is not deleted, it is hidden from the addressee's connections
the requested however sees its status as "PENDING"
*/
export async function deleteConnectionController(req: AuthenticatedRequest, res: Response) {
    try { 


        const { requesterId, addresseeId } = req.params;
        if (!requesterId || !addresseeId) {
            return res.status(400).json({ error: "Requester ID and Addressee ID are required" });
        }

        const connection = await deleteConnection(requesterId, addresseeId);
        return res.status(200).json({ message: "Connection deleted successfully", connection });
    } catch (error) {
        console.error("Error in deleteConnectionController:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}   