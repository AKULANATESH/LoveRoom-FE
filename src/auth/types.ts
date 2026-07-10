import { z } from "zod";

export const authUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  username: z.string(),
});

export const authResponseSchema = z.object({
  accessToken: z.string(),
  user: authUserSchema,
  hasPartner: z.boolean(),
  relationshipId: z.string().optional(),
  pendingInviteCode: z.string().optional(),
});

export const invitationPreviewSchema = z.object({
  code: z.string(),
  inviterName: z.string(),
  inviteeEmail: z.string().nullable().optional(),
  inviteeUsername: z.string().nullable().optional(),
});

export const invitationCreatedSchema = z.object({
  code: z.string(),
  inviteeEmail: z.string().nullable().optional(),
  inviteeUsername: z.string().nullable().optional(),
  message: z.string(),
});

export type AuthUser = z.infer<typeof authUserSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
