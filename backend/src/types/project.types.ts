import { Project, User, Task, Channel } from "@prisma/client";

export type CreateProjectBody = {
  name: string;
  description?: string;
};

export type UpdateProjectBody = {
  name?: string;
  description?: string;
};

export type AddProjectMemberBody = {
  username: string;
};

export type UpdateProjectMemberBody = {
  username: string;
};

type PublicUser = Pick<User, "id" | "username" | "photoURL">;

export type BasicProjectResponse = Pick<
  Project,
  "id" | "name" | "description" | "createdAt"
>;

export type ProjectDetailsResponse = BasicProjectResponse & {
  creator: PublicUser;
  members: PublicUser[];
  tasks: Task[];
  channels: Channel[];
};
