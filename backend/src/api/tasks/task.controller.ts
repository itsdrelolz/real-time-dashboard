import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import { taskService } from "./task.service";
import { validateTask } from "@/validators/taskValidator";

export async function createTaskController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const result = validateTask(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ error: "Invalid task payload", details: result.error.message });
    }
    const validatedData = result.data;
    const { projectId } = req.params;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!projectId || !validatedData.title) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newTask = await taskService.createTask(projectId, userId, {
      title: validatedData.title,
      description: validatedData.description,
      assigneeId: validatedData.assigneeId,
      status: validatedData.status,
      priority: validatedData.priority,
      dueDate: validatedData.dueDate,
    });

    return res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
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
      return res.status(400).json({ error: "Invalid Task ID" });
    }

    const task = await taskService.getTaskById(taskId);
    return res.status(200).json({ task });
  } catch (error) {
    console.error("Error getting task:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAllTasksForProjectController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ error: "Invalid Project ID" });
    }

    const tasks = await taskService.getTaskSummariesForProject(projectId);
    return res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error getting tasks:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateTaskController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { taskId } = req.params;
    const validationResult = validateTask(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Invalid task payload",
        details: validationResult.error.message,
      });
    }
    const validatedData = validationResult.data;

    if (!taskId) {
      return res.status(400).json({ error: "Invalid Task ID" });
    }

    const updatedTask = await taskService.updateTask(taskId, {
      title: validatedData.title,
      description: validatedData.description,
      assigneeId: validatedData.assigneeId,
      status: validatedData.status,
      priority: validatedData.priority,
      dueDate: validatedData.dueDate,
    });

    return res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
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

    if (!taskId) {
      return res.status(400).json({ error: "Invalid Task ID" });
    }

    await taskService.deleteTask(taskId);
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
