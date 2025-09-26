import { Workspace, User, Task, Channel } from "@prisma/client";

export type CreateWorkspaceBody = {
  name: string;
  description?: string;
};

export type UpdateWorkspaceBody = {
  name?: string;
  description?: string;
};

export type AddWorkspaceMemberBody = {
  username: string;
};

export type UpdateWorkspaceMemberBody = {
  userId: string;
};

type PublicUser = Pick<User, "id" | "username" | "photoURL">;

export type BasicWorkspaceResponse = Pick<
  Workspace,
  "id" | "name" | "description" | "createdAt"
>;

export type WorkspaceDetailsResponse = BasicWorkspaceResponse & {
  creator: PublicUser;
  members: PublicUser[];
  tasks: Task[];
  channels: Channel[];
};
