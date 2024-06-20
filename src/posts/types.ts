import { z } from "zod";

export const postResponseSchema = z.object({
  title: z.string(),
  id: z.number(),
  userId: z.number(),
  body: z.string(),
});

export type PostResponse = z.infer<typeof postResponseSchema>;
