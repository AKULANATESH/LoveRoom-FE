import { type AllowedUseMutationOptions, post, queryClient } from "@src/api";
import { useMutation } from "@tanstack/react-query";

import type { SendEmotionalActionRequest } from "../types";
import { emotionalActionResponseSchema } from "./schemas";
import { partnerActivityQueryKey } from "./usePartnerActivity";
import { relationshipHomeQueryKey } from "./useRelationshipHome";
import { connectionAwarenessQueryKey } from "./useConnectionAwareness";

interface SendEmotionalActionResponse {
  id: string;
  type: SendEmotionalActionRequest["type"];
  message?: string;
  delivered: boolean;
}

async function sendEmotionalAction(
  data: SendEmotionalActionRequest,
): Promise<SendEmotionalActionResponse> {
  const response = await post({
    url: "/actions",
    data,
    responseSchema: emotionalActionResponseSchema,
  });

  return response.data;
}

export function useSendEmotionalAction(
  options?: AllowedUseMutationOptions<SendEmotionalActionResponse, SendEmotionalActionRequest>,
) {
  return useMutation({
    mutationFn: sendEmotionalAction,
    ...options,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: relationshipHomeQueryKey });
      void queryClient.invalidateQueries({ queryKey: partnerActivityQueryKey });
      void queryClient.invalidateQueries({ queryKey: connectionAwarenessQueryKey });
      options?.onSuccess?.(...args);
    },
  });
}
