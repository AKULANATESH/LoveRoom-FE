import { z } from "zod";

export const chatMessageSchema = z.object({
  id: z.string(),
  mine: z.boolean(),
  type: z.enum(["TEXT", "IMAGE", "SNAP"]),
  text: z.string().optional(),
  imageData: z.string().optional(),
  caption: z.string().optional(),
  viewOnce: z.boolean(),
  opened: z.boolean(),
  reaction: z.string().optional(),
  readByPartner: z.boolean(),
  createdAt: z.string(),
  timeLabel: z.string(),
});

export const chatMessagesSchema = z.array(chatMessageSchema);

export const openSnapResponseSchema = z.object({
  id: z.string(),
  imageData: z.string().optional(),
  caption: z.string().optional(),
});

export const markReadResponseSchema = z.object({
  success: z.boolean(),
});
