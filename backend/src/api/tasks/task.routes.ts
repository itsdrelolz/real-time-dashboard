import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import * as taskController from "./task.controller";

const router: Router = Router();

router.use(authMiddleware);

router.post("/", taskController.createTaskController);
router.get("/", taskController.getAllTasksForProjectController);
router.get("/:taskId", taskController.getTaskByIdController);
router.patch("/:taskId", taskController.updateTaskController);
router.delete("/:taskId", taskController.deleteTaskController);

export default router;
