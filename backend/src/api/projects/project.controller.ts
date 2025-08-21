import { Request, Response } from "express"; 
import { createProject, deleteProject, getProjectsForOwner }from "./project.service"



export async function createProjectController(req: Request, res: Response): Promise<Response> { 
    
    try { 
    
	const { projectName , ownerId } = req.body; 

	if (!projectName || !ownerId) { 
	    return res.status(400).json({
	    error: "Missing required fields",
	    })
	}

	const newProject = await createProject({
	    projectName, 
	    ownerId
	})
    
	return res.status(201).json({
	message: "Project created successfully",
	    newProject
	});

    } catch (error: unknown) { 

    console.error("Create Project error:" , error); 
    return res.status(500).json({ 
	error: "Internal server error"
	})
    }
}


export async function getAllProjectsController(req: Request, res: Response): Promise<Response> { 
    
    try { 
	const { ownerId } = req.body;

    
	const projects = await getProjectsForOwner(ownerId);

	return res.status(200).json({ 
	message: "Projects successfully retrieved", 
	    projects
	    });

    } catch (error: unknown) { 
	console.error("Error retrieving projects:" , error);
	return res.status(500).json({ 
	error: "Internal server error"
	})
    }
}
	
export async function deleteProjectController(req: Request, res: Response): Promise<Response> { 

    
    try { 

	const projectId  = parseInt(req.params.projectId as string, 10);

     if (isNaN(projectId)) {
            return res.status(400).json({
                error: "Project ID must be a valid number.",
            });
        }

	await deleteProject(projectId)

	return res.status(204).send()

    } catch (error: unknown) { 
	console.error("Failed to delete project") 
	return res.status(500).json({ 
	error: "An unexpected error occurred while deleting the project"
})

    
    }

}
