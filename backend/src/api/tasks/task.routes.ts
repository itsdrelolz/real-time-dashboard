import { Router } from "express";
import { authenticateMiddleware } from "../../middleware/authMiddleware";
import * as taskController from "./task.controller";
import { sanitizeFields } from "@/middleware/sanitizer";
import { canEditTask } from "@/middleware/authorization/canEditTask";
import { canViewProject } from "@/middleware/authorization/canViewProject";
import { validateTaskId } from "@/validators/indexValidator";

const router: Router = Router();

router.use(authenticateMiddleware);

router.post(
  "/",
  canViewProject,
  sanitizeFields([
    "title",
    "description",
    "assigneeId",
    "status",
    "priority",
    "dueDate",
  ]),
  taskController.createTaskController,
);
router.get("/", canViewProject, taskController.getAllTasksForProjectController);
router.get(
  "/:taskId",
  validateTaskId,
  canViewProject,
  taskController.getTaskByIdController,
);
router.patch(
  "/:taskId",
  validateTaskId,
  canEditTask,
  sanitizeFields([
    "title",
    "description",
    "assigneeId",
    "status",
    "priority",
    "dueDate",
  ]),
  taskController.updateTaskController,
);
router.delete(
  "/:taskId",
  validateTaskId,
  canEditTask,
  taskController.deleteTaskController,
);

export default router;
