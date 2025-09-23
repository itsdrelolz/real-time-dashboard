import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import {
  createTaskController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
} from './task.controller';

const router: Router = Router();

// All routes require authentication
router.use(authMiddleware);

// Channel-scoped task creation and listing should live under channels
router.post('/channels/:channelId/tasks', createTaskController);

// Task by id operations
router.get('/tasks/:taskId', getTaskByIdController);
router.put('/tasks/:taskId', updateTaskController);
router.delete('/tasks/:taskId', deleteTaskController);

export default router;
