import { Router } from "express";

import * as connectionController from "./connection.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const router: Router = Router();

router.use(authMiddleware);
router.get("/", connectionController.getConnectionsController);
router.post("/", connectionController.createConnectionController);
router.put("/:requesterId/accept", connectionController.acceptConnectionController);
router.delete("/:addresseeId", connectionController.deleteConnectionController);