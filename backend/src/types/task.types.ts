import { Task, User } from "@prisma/client";

type PublicUser = Pick<User, "id" | "username" | "photoURL">;

export type CreateTaskBody = {
  title: string;
  description?: string;
  status: string;
  priority: string;
  assigneeId?: string;
  dueDate?: Date;
};

export type UpdateTaskBody = {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  dueDate?: Date;
};

export type BasicTaskResponse = Pick<
  Task,
  | "id"
  | "title"
  | "description"
  | "status"
  | "priority"
  | "createdAt"
  | "updatedAt"
  | "workspaceId"
>;

export type TaskDetailsResponse = BasicTaskResponse & {
  assignee: PublicUser;
  creator: PublicUser;
};
