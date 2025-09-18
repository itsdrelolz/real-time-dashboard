import { Response } from 'express';
import { createTask, getTaskById, updateTask, getTasksByProjectId, getTasksByProfileId, getTaskWithDetails, deleteTask } from './task.service';
import { createChannel } from '../channels/channel.service';
import { authMiddleware } from '@/middleware/authMiddleware';
import { AuthenticatedRequest } from '@/middleware/authMiddleware';


// Create a new task
export async function createTaskController(req: AuthenticatedRequest, res: Response) {
  try {
    const { projectId } = req.params as { projectId: string };
    const projectIdNum = parseInt(projectId);
    
    if (isNaN(projectIdNum)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const taskData = {
      ...req.body,
      projectId: projectIdNum,
    };

    const task = await createTask(taskData);
    
    // Create a dedicated channel for this task
    const channel = await createChannel({
      name: `task-${task.id}`,
      description: `Channel for task: ${task.title}`,
      projectId: projectIdNum,
      taskId: task.id,
    });

    res.status(201).json({ task, channel });
  } catch (error) {
    console.error('Error in createTaskController:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
}

// Get task by ID
export async function getTaskByIdController(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const taskId = parseInt(id);
    
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = await getTaskById(taskId);
    res.json(task);
  } catch (error) {
    console.error('Error in getTaskByIdController:', error);
    res.status(404).json({ error: 'Task not found' });
  }
}

// Update task
export async function updateTaskController(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const taskId = parseInt(id);
    
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = await updateTask(taskId, req.body);
    res.json(task);
  } catch (error) {
    console.error('Error in updateTaskController:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
}

// Get tasks by project ID
export async function getTasksByProjectIdController(req: AuthenticatedRequest, res: Response) {
  try {
    const { projectId } = req.params as { projectId: string };
    const projectIdNum = parseInt(projectId);
    
    if (isNaN(projectIdNum)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const tasks = await getTasksByProjectId(projectIdNum);
    res.json(tasks);
  } catch (error) {
    console.error('Error in getTasksByProjectIdController:', error);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
}

// Get tasks by profile ID (assigned to user)
export async function getTasksByProfileIdController(req: AuthenticatedRequest, res: Response) {
  try {
    const { profileId } = req.params as { profileId: string };
    
    if (!profileId) {
      return res.status(400).json({ error: 'Profile ID is required' });
    }

    const tasks = await getTasksByProfileId(profileId);
    res.json(tasks);
  } catch (error) {
    console.error('Error in getTasksByProfileIdController:', error);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
}

// Get task with details
export async function getTaskWithDetailsController(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const taskId = parseInt(id);
    
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = await getTaskWithDetails(taskId);
    res.json(task);
  } catch (error) {
    console.error('Error in getTaskWithDetailsController:', error);
    res.status(404).json({ error: 'Task not found' });
  }
}

// Delete task
export async function deleteTaskController(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const taskId = parseInt(id);
    
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    await deleteTask(taskId);
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteTaskController:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
}