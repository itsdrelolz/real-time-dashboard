import { Response } from "express";
import { workspaceService } from "./workspace.service";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";

import { validateWorkspace } from "@/validators/workspaceValidator";

export async function createWorkspaceController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const validationResult = validateWorkspace(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Invalid workspace payload",
        details: validationResult.error.message,
      });
    }
    const validatedData = validationResult.data;
    const { name, description } = validatedData;
    const ownerId = req.user?.uid;

    if (!ownerId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const newWorkspace = await workspaceService.createWorkspace(
      { name, description },
      ownerId,
    );

    return res.status(201).json(newWorkspace);
  } catch (error) {
    console.error("Error creating workspace:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getWorkspacesController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const workspaces = await workspaceService.getWorkspaceSummariesForUser(userId);
    return res.status(200).json(workspaces);
  } catch (error) {
    console.error("Error getting workspaces:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getWorkspaceByIdController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { workspaceId } = req.params;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!workspaceId) {
      return res.status(400).json({ error: "Workspace ID is required" });
    }

    const workspace = await workspaceService.getWorkspaceById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    return res.status(200).json(workspace);
  } catch (error) {
    console.error("Error getting workspace by id:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateWorkspaceController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { workspaceId } = req.params;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!workspaceId) {
      return res.status(400).json({ error: "Workspace ID is required" });
    }

    const validationResult = validateWorkspace(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Invalid workspace payload",
        details: validationResult.error.message,
      });
    }

    const validatedData = validationResult.data;

    const updatedWorkspace = await workspaceService.updateWorkspace(
      workspaceId,
      validatedData,
    );

    return res.status(200).json(updatedWorkspace);
  } catch (error) {
    console.error("Error updating workspace:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteWorkspaceController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { workspaceId } = req.params;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!workspaceId) {
      return res.status(400).json({ error: "Workspace ID is required" });
    }

    await workspaceService.deleteWorkspace(workspaceId);

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting workspace:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function addMemberToWorkspaceController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { workspaceId } = req.params;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!workspaceId) {
      return res.status(400).json({ error: "Workspace ID is required" });
    }

    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const updatedWorkspace = await workspaceService.addMemberToWorkspace(
      workspaceId,
      { username },
    );

    return res.status(200).json(updatedWorkspace);
  } catch (error) {
    console.error("Error adding member to workspace:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function removeMemberFromWorkspaceController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { workspaceId } = req.params;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!workspaceId) {
      return res.status(400).json({ error: "Workspace ID is required" });
    }

    const { userId: memberId } = req.body;

    if (!memberId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const updatedWorkspace = await workspaceService.removeMemberFromWorkspace(
      workspaceId,
      { userId: memberId },
    );

    return res.status(200).json(updatedWorkspace);
  } catch (error) {
    console.error("Error removing member from workspace:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getWorkspaceMembersController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { workspaceId } = req.params;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!workspaceId) {
      return res.status(400).json({ error: "Workspace ID is required" });
    }

    const members = await workspaceService.getWorkspaceMembers(workspaceId);

    return res.status(200).json(members);
  } catch (error) {
    console.error("Error getting workspace members:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}