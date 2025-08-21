import type { Task as PrismaTask } from "@prisma/client";
import type { PublicProfile } from "./profile.types"; 
import type { CommentWithAuthor } from "./comment.types";

export type Task = PrismaTask;

export type TaskWithDetails = Task & {
  assignee: PublicProfile | null;
  comments: CommentWithAuthor[];
};

export type CreateTaskData = Pick<Task, 'title' | 'projectId'> &
  Partial<Pick<Task, 'description' | 'priority' | 'status' | 'assigneeId'>>;
