import { Response } from 'express';


import { AuthenticatedRequest } from '../../middleware/authMiddleware';
import { createTask, getTaskById, updateTask, deleteTask } from './task.service';



export async function createTaskController(req: AuthenticatedRequest, res: Response) {
  try {
    const channelId = req.params.channelId;

    if (!channelId) {
      return res.status(400).json({ error: 'Invalid channel ID' });
    }

    const { title, description, priority, status, assigneeId } = req.body;

    if (!title ) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const taskData = {
      title,
      description,
      priority,
      status,
      assigneeId,
      channelId,
    };
    const task = await createTask(taskData);
    res.status(201).json({ task });
  } catch (error) {
    console.error('Error in createTaskController:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
}

// Get task by ID
export async function getTaskByIdController(req: AuthenticatedRequest, res: Response) {
  try {
    const taskId = req.params.taskId;
    
    if (!taskId) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = await getTaskById(taskId);

    res.status(200).json({ task });

  } catch (error) {
    console.error('Error in getTaskByIdController:', error);
    res.status(404).json({ error: 'Task not found' });
  }
}

// Update task
export async function updateTaskController(req: AuthenticatedRequest, res: Response) {
  try {
    const taskId = req.params.taskId;
    
    if (!taskId) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = await updateTask(taskId, req.body);
    res.status(200).json({ task });
  } catch (error) {
    console.error('Error in updateTaskController:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
}






// Delete task
export async function deleteTaskController(req: AuthenticatedRequest, res: Response) {
  try {
    const taskId = req.params.taskId;
    
    if (!taskId) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    await deleteTask(taskId);
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteTaskController:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
}
