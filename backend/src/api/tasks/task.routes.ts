import { Router } from "express";
import { authenticateMiddleware } from "../../middleware/authMiddleware";
import * as taskController from "./task.controller";
import { sanitizeFields } from "@/middleware/sanitizer";
import { canEditTask } from "@/middleware/authorization/canEditTask";
import { canViewWorkspace } from "@/middleware/authorization/canViewWorkspace";
import { validateTaskId } from "@/validators/indexValidator";

const router: Router = Router();

router.use(authenticateMiddleware);

router.post(
  "/",
  canViewWorkspace,
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
router.get("/", canViewWorkspace, taskController.getTasksController);
router.get(
  "/:taskId",
  validateTaskId,
  canViewWorkspace,
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
router.post(
  "/:taskId/assign",
  validateTaskId,
  canEditTask,
  sanitizeFields(["assigneeId"]),
  taskController.assignTaskController,
);
router.post(
  "/:taskId/unassign",
  validateTaskId,
  canEditTask,
  taskController.unassignTaskController,
);

export default router;
