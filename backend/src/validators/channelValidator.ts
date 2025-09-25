import z from "zod";

export const channelSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Channel name is required" })
    .max(30, { message: "Channel name is too long" }),
  description: z
    .string()
    .min(1, { message: "Channel description is required" })
    .max(100, { message: "Channel description is too long" })
    .optional(),
});

export const validateChannel = (channelData: unknown) => {
  return channelSchema.safeParse(channelData);
};
