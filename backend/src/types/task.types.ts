import type { Priority, Task as PrismaTask, Status } from "@prisma/client";
import type { PublicProfile } from "./profile.types";

export type Task = PrismaTask;

export type TaskWithDetails = Task & {
  assignee: PublicProfile | null;
};






export type CreateTaskData = Pick<Task, "title" | "channelId"> & // Belongs to a Channel
  Partial<Pick<Task, "description" | "priority" | "status" | "assigneeId">>;



  export type UpdateTaskData = 
  | { title: string; description?: string; status?: Status; priority?: Priority; assigneeId?: string }
  | { title?: string; description: string; status?: Status; priority?: Priority; assigneeId?: string }
  | { title?: string; description?: string; status: Status; priority?: Priority; assigneeId?: string }
  | { title?: string; description?: string; status?: Status; priority: Priority; assigneeId?: string }
  | { title?: string; description?: string; status?: Status; priority?: Priority; assigneeId: string };


