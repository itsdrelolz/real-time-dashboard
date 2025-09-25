import { Task, User } from "@prisma/client";

type PublicUser = Pick<User, "id" | "username" | "photoURL">;

export type CreateTaskBody = {
  title: string;
  description?: string;
  status: string;
  priority: string;
  assigneeId?: string;
  dueDate?: string;
};

export type UpdateTaskBody = {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  dueDate?: string;
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
  | "projectId"
>;

export type TaskDetailsResponse = BasicTaskResponse & {
  assignee: PublicUser;
  creator: PublicUser;
};
