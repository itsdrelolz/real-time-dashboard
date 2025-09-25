import z from "zod";

export const userSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .max(20, { message: "Username is too long" }),
  photoURL: z.string().optional(),
});

export const validateUser = (userData: unknown) => {
  return userSchema.safeParse(userData);
};
