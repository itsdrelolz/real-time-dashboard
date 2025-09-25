import z from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Project name is required" })
    .max(50, { message: "Project name is too long" }),
  description: z
    .string()
    .min(1, { message: "Project description is required" })
    .max(200, { message: "Project description is too long" })
    .optional(),
});

export const validateProject = (projectData: unknown) => {
  return projectSchema.safeParse(projectData);
};
