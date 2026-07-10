import { type AllowedUseMutationOptions, get, post } from "@src/api";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  type AuthResponse,
  authResponseSchema,
  invitationCreatedSchema,
  invitationPreviewSchema,
} from "../types";

interface CreateInvitationRequest {
  partnerEmail?: string;
  partnerUsername?: string;
}

interface AcceptInvitationRequest {
  code: string;
}

async function createInvitation(data: CreateInvitationRequest) {
  const response = await post({
    url: "/auth/invitations",
    data,
    responseSchema: invitationCreatedSchema,
  });
  return response.data;
}

async function previewInvitation(code: string) {
  const response = await get({
    url: `/auth/invitations/${code}`,
    responseSchema: invitationPreviewSchema,
  });
  return response.data;
}

async function acceptInvitation(data: AcceptInvitationRequest): Promise<AuthResponse> {
  const response = await post({
    url: "/auth/invitations/accept",
    data,
    responseSchema: authResponseSchema,
  });
  return response.data;
}

export function useCreateInvitation(
  options?: AllowedUseMutationOptions<
    Awaited<ReturnType<typeof createInvitation>>,
    CreateInvitationRequest
  >,
) {
  return useMutation({
    mutationFn: createInvitation,
    ...options,
  });
}

export function usePreviewInvitation(code?: string) {
  return useQuery({
    queryKey: ["invitation", code],
    queryFn: () => previewInvitation(code!),
    enabled: Boolean(code && code.length >= 6),
    retry: false,
  });
}

export function useAcceptInvitation(
  options?: AllowedUseMutationOptions<AuthResponse, AcceptInvitationRequest>,
) {
  return useMutation({
    mutationFn: acceptInvitation,
    ...options,
  });
}
