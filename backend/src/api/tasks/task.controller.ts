import { Response } from "express";
import { taskService } from "./task.service";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import { validateTask } from "@/validators/taskValidator";

export async function createTaskController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const result = validateTask(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Invalid task payload",
        details: result.error.message,
      });
    }
    const validatedData = result.data;
    const { workspaceId } = req.params;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!workspaceId || !validatedData.title) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newTask = await taskService.createTask(workspaceId, userId, {
      title: validatedData.title,
      description: validatedData.description,
      status: validatedData.status,
      priority: validatedData.priority,
      assigneeId: validatedData.assigneeId,
      dueDate: validatedData.dueDate,
    });

    return res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getTaskByIdController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    const task = await taskService.getTaskById(taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error("Error getting task by id:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateTaskController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { taskId } = req.params;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!taskId) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    const result = validateTask(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Invalid task payload",
        details: result.error.message,
      });
    }

    const validatedData = result.data;

    const updatedTask = await taskService.updateTask(taskId, userId, {
      title: validatedData.title,
      description: validatedData.description,
      status: validatedData.status,
      priority: validatedData.priority,
      assigneeId: validatedData.assigneeId,
      dueDate: validatedData.dueDate,
    });

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteTaskController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { taskId } = req.params;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!taskId) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    await taskService.deleteTask(taskId);

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getTasksController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { workspaceId } = req.params;

    if (!workspaceId) {
      return res.status(400).json({ error: "Invalid Workspace ID" });
    }

    const tasks = await taskService.getTaskSummariesForWorkspace(workspaceId);
    return res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error getting tasks for workspace:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function assignTaskController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { taskId } = req.params;
    const { assigneeId } = req.body;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!taskId || !assigneeId) {
      return res.status(400).json({ error: "Task ID and assignee ID are required" });
    }

    const updatedTask = await taskService.assignTask(taskId, assigneeId);

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error assigning task:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function unassignTaskController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { taskId } = req.params;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!taskId) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    const updatedTask = await taskService.unassignTask(taskId);

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error unassigning task:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}