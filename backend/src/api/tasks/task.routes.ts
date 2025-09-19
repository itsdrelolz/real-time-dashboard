import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import {
  createTaskController,
  getTaskByIdController,
  updateTaskController,
  getTasksByProjectIdController,
  getTasksByProfileIdController,
  getTaskWithDetailsController,
  deleteTaskController,
} from './task.controller';

const router: Router = Router();

// All routes require authentication
router.use(authMiddleware);

// Task routes
router.post('/projects/:projectId/tasks', createTaskController);
router.get('/tasks/:id', getTaskByIdController);
router.put('/tasks/:id', updateTaskController);
router.delete('/tasks/:id', deleteTaskController);
router.get('/tasks/:id/details', getTaskWithDetailsController);

// Project-specific task routes
router.get('/projects/:projectId/tasks', getTasksByProjectIdController);

// Profile-specific task routes
router.get('/profiles/:profileId/tasks', getTasksByProfileIdController);

export default router;
