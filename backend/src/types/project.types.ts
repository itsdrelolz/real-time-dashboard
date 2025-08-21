import { Prisma } from "@prisma/client";
import type {
  Project as PrismaProject,
  ProjectMember as PrismaProjectMember,
} from "@prisma/client";
import type { PublicProfile } from "./profile.types";

export type Project = PrismaProject;
export type ProjectMember = PrismaProjectMember;

export type ProjectMemberWithProfile = ProjectMember & {
  profile: PublicProfile;
};

export type CreateProjectData = Pick<Project, "name" | "ownerId">;
export type AddProjectMemberData = Pick<
  ProjectMember,
  "projectId" | "profileId"
>;
export type UpdateProjectDetailsData = Partial<Pick<Project, "name">>;

export type ProjectSummaryPayload = Pick<Project, "id" | "name">;

const detailedProjectInclude = {
  owner: { select: { id: true, displayName: true } },
  members: {
    include: {
      profile: { select: { id: true, displayName: true } },
    },
  },
  tasks: true,
  channels: {
    select: {
      id: true,
      name: true,
      taskId: true,
    },
  },
};

export type DetailedProjectPayload = Prisma.ProjectGetPayload<{
  include: typeof detailedProjectInclude;
}>;

export type ProjectMemberProfile = {
  profile: PublicProfile | null;
};
