import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import { taskService } from "./task.service";
import { requireAuth } from "../../utils/authUtils";


export async function createTaskController(
    req: AuthenticatedRequest,
    res: Response,
) {
    const { projectId, title, description, assigneeId, status, priority, dueDate } = req.body;
    const userId = requireAuth(req, res);
    
    if (!userId) return; // Response already sent by requireAuth
    
    if (!projectId || !title) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const newTask = await taskService.createTask(projectId, userId, {
        title,
        description,
        assigneeId,
        status,
        priority,
        dueDate,
    });

    return res.status(201).json({ message: "Task created successfully", task: newTask });
}

export async function getTaskByIdController(
    req: AuthenticatedRequest,
    res: Response,
) {
    const { taskId } = req.params;
    const userId = requireAuth(req, res);

    if (!userId) return; // Response already sent by requireAuth

    if (!taskId) {
        return res.status(400).json({ error: "Invalid Task ID" });
    }

    const task = await taskService.getTaskById(taskId);
    return res.status(200).json({ task });
}

export async function getAllTasksForProjectController(
    req: AuthenticatedRequest,
    res: Response,
) {
    const { projectId } = req.params;
    const userId = requireAuth(req, res);

    if (!userId) return; // Response already sent by requireAuth

    if (!projectId) {
        return res.status(400).json({ error: "Invalid Project ID" });
    }

    const tasks = await taskService.getTaskSummariesForProject(projectId);
    return res.status(200).json({ tasks });
}

export async function updateTaskController(
    req: AuthenticatedRequest,
    res: Response,
) {
    const { taskId } = req.params;
    const { title, description, assigneeId, status, priority, dueDate } = req.body;
    const userId = requireAuth(req, res);

    if (!userId) return; // Response already sent by requireAuth

    if (!taskId) {
        return res.status(400).json({ error: "Invalid Task ID" });
    }

    const updatedTask = await taskService.updateTask(taskId, {
        title,
        description,
        assigneeId,
        status,
        priority,
        dueDate,
    });

    return res.status(200).json({ message: "Task updated successfully", task: updatedTask });
}


export async function deleteTaskController(
    req: AuthenticatedRequest,
    res: Response,
) {
    const { taskId } = req.params;
    const userId = requireAuth(req, res);

    if (!userId) return; // Response already sent by requireAuth

    if (!taskId) {
        return res.status(400).json({ error: "Invalid Task ID" });
    }

    await taskService.deleteTask(taskId);
    return res.status(204).send();
}


