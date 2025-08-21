import type { Task as PrismaTask, Channel } from "@prisma/client";
import type { PublicProfile } from "./profile.types";

export type Task = PrismaTask;

export type TaskWithDetails = Task & {
  assignee: PublicProfile | null;
  channel: Pick<Channel, "id" | "name"> | null; // A task can have one channel
};

export type CreateTaskData = Pick<Task, "title" | "projectId"> &
  Partial<Pick<Task, "description" | "priority" | "status" | "assigneeId">>;
