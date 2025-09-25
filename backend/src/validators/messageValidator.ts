import z from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Message can't be empty." })
    .max(4096, { message: "Message is too long." }),
});

// Pure validation function - works on frontend and backend
export const validateMessage = (messageData: unknown) => {
  return messageSchema.safeParse(messageData);
};
