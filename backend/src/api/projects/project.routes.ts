import { Router } from "express" 
import {createProjectController, deleteProjectController, getAllProjectsController } from "./project.controller";

const router = Router();

router.get('/projects', getAllProjectsController);
router.post('/project', createProjectController);

router.delete('/projects/:projectId', deleteProjectController);
