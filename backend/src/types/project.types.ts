import type {
  Project as PrismaProject,
  ProjectMember as PrismaProjectMember,
} from "@prisma/client";
import type { PublicProfile } from "./profile.types"; 
import type { TaskWithDetails } from "./task.types"; 

export type Project = PrismaProject;

export type ProjectMember = PrismaProjectMember;

export type ProjectMemberWithProfile = ProjectMember & {
  profile: PublicProfile;
};

export type DetailedProjectPayload = Project & {
  owner: PublicProfile;
  members: ProjectMemberWithProfile[];
  tasks: TaskWithDetails[];
};

export type ProjectSummaryPayload = Pick<Project, "id" | "name">;

export type CreateProjectData = {
  name: Project['name'];
  ownerId: Project['ownerId'];
};

export type AddProjectMemberData = Pick<ProjectMember, 'projectId' | 'profileId'>;
