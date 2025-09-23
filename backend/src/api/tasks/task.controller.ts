import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';
import { createTask, getTaskById, updateTask, deleteTask } from './task.service';
import prisma from '../../utils/prismaClient';



export async function createTaskController(req: AuthenticatedRequest, res: Response) {
  try {
    const channelId = req.params.channelId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!channelId) {
      return res.status(400).json({ error: 'Invalid channel ID' });
    }

    // Verify user has access to this channel (is member of the project)
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      include: {
        project: {
          include: {
            members: true
          }
        }
      }
    });

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const isMember = channel.project.members.some(member => member.profileId === userId);
    if (!isMember) {
      return res.status(403).json({ error: 'You don\'t have access to this channel' });
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
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!taskId) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = await getTaskById(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Verify user has access to this task (is member of the project that contains the channel)
    const channel = await prisma.channel.findUnique({
      where: { id: task.channelId },
      include: {
        project: {
          include: {
            members: true
          }
        }
      }
    });

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const isMember = channel.project.members.some(member => member.profileId === userId);
    if (!isMember) {
      return res.status(403).json({ error: 'You don\'t have access to this task' });
    }

    res.status(200).json({ task });

  } catch (error) {
    console.error('Error in getTaskByIdController:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update task
export async function updateTaskController(req: AuthenticatedRequest, res: Response) {
  try {
    const taskId = req.params.taskId;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!taskId) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const existingTask = await getTaskById(taskId);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Verify user has access to this task (is member of the project that contains the channel)
    const channel = await prisma.channel.findUnique({
      where: { id: existingTask.channelId },
      include: {
        project: {
          include: {
            members: true
          }
        }
      }
    });

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const isMember = channel.project.members.some(member => member.profileId === userId);
    if (!isMember) {
      return res.status(403).json({ error: 'You don\'t have access to this task' });
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
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!taskId) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const existingTask = await getTaskById(taskId);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Verify user has access to this task (is member of the project that contains the channel)
    const channel = await prisma.channel.findUnique({
      where: { id: existingTask.channelId },
      include: {
        project: {
          include: {
            members: true
          }
        }
      }
    });

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const isMember = channel.project.members.some(member => member.profileId === userId);
    if (!isMember) {
      return res.status(403).json({ error: 'You don\'t have access to this task' });
    }

    await deleteTask(taskId);
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteTaskController:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
}
