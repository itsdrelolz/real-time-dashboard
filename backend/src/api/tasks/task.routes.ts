import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import {
  createTaskController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
} from "./task.controller";

const router: Router = Router();

// All routes require authentication
router.use(authMiddleware);

// Task creation (channelId comes from parent route)
router.post("/", createTaskController);

// Task by id operations
router.get("/:taskId", getTaskByIdController);
router.put("/:taskId", updateTaskController);
router.delete("/:taskId", deleteTaskController);

export default router;
