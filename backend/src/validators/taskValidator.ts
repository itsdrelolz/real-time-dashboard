import z from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Task title is required" })
    .max(20, { message: "Task title is too long" }),
  description: z
    .string()
    .min(1, { message: "Task description is required" })
    .max(100, { message: "Task description is too long" }),
  status: z.enum(["pending", "in_progress", "completed"]),
  priority: z.enum(["low", "medium", "high"]),
  assigneeId: z
    .string()
    .min(1, { message: "Task assignee ID is required" })
    .optional(),
  dueDate: z.coerce.date().optional(),
});

export const validateTask = (taskData: unknown) => {
  return taskSchema.safeParse(taskData);
};
