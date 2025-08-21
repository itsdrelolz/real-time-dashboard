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
	profile: data.ownerId, 
	}, 
	], 
	},
	},
});
    return newProject;
}


export async function getProjectsForOwner(ownerId: string): Promise<DetailedProjectPayload[]> { 
   
  const projects = await prisma.project.findMany({
    where: {
      ownerId: ownerId, 
    },
   
    include: {
      owner: { select: { id: true, displayName: true } },
      members: {
        include: {
          profile: { select: { id: true, displayName: true } },
        },
      },
      tasks: {
        include: {
          assignee: { select: { id: true, displayName: true } },
          comments: {
            include: {
              author: { select: { id: true, displayName: true } },
            },
          },
        },
      },
    },
  });

    return projects
}


export async function addMember(data: AddProjectMemberData): Promise<ProjectMember> { 

    const newMember = await prisma.projectMember.create({ 
    data: { 
	profileId: data.profileId,
	projectId: data.projectId,
	}
});
    return newMember
}






export async function deleteProject(projectId: number): Promise<void> { 

    await prisma.project.delete({ 
    where: {
	id: projectId 
    }
    });
}



