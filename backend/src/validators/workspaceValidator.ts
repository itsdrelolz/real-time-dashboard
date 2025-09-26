import z from "zod";

export const workspaceSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Workspace name is required" })
    .max(50, { message: "Workspace name is too long" }),
  description: z
    .string()
    .min(1, { message: "Workspace description is required" })
    .max(200, { message: "Workspace description is too long" })
    .optional(),
});

export const validateWorkspace = (workspaceData: unknown) => {
  return workspaceSchema.safeParse(workspaceData);
};
