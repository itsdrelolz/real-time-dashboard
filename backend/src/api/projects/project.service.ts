import prisma from "../../utils/prismaClient";

import {
  CreateProjectData,
  AddProjectMemberData,
  DetailedProjectPayload,
    ProjectSummaryPayload,
  Project,
  ProjectMember,
} from "@/types";

export async function createProject(data: CreateProjectData): Promise<Project> { 
    
    const newProject = await prisma.project.create({ 
	data: { 
	name: data.name, 
	ownerId: data.ownerId,
	members: { 
	create: [ 
	{ 
	profileId: data.ownerId, 
	}, 
	], 
	},
	},
});
    return newProject;
}

export async function getProjectById(projectId: number): Promise<DetailedProjectPayload | null> { 

    const project = await prisma.project.findUnique({ 
    // include details that correspond to data type 
    where: { 
	id: projectId
	},
	include: { 
	    tasks: {

	});

    return project;
}

export async function getProjectSummariesForUser(userId: string): Promise<ProjectSummaryPayload[]> {
    const projects = await prisma.project.findMany({
        where: {
            members: {
                some: {
                    profileId: userId,
                },
            },
        },
        select: {
            id: true,
            name: true,
        },
    });
    return projects;
}







export async function updateProjectDetails(data: UpdateDetailsData): Promise<Project> { 


}




export async function deleteProject(projectId: number): Promise<void> { 

    await prisma.project.delete({ 
    where: {
	id: projectId 
    }
    });
}


export async function addMemberToProject(data: AddProjectMemberData): Promise<ProjectMember> { 

    const newMember = await prisma.projectMember.create({ 
    data: { 
	profileId: data.profileId,
	projectId: data.projectId,
	}
});
    return newMember
}


export async function removeMemberFromProject(projectId: number, profileId: string): Promise<void> { 


}


export async function getProjectMembers(projectId: number): Promise<Profile[]> {



}







