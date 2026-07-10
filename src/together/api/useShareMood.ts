import { type AllowedUseMutationOptions, post, queryClient } from "@src/api";
import { useMutation } from "@tanstack/react-query";

import type { ShareMoodRequest } from "../types";
import { moodResponseSchema } from "./schemas";
import { partnerActivityQueryKey } from "./usePartnerActivity";
import { relationshipHomeQueryKey } from "./useRelationshipHome";
import { connectionAwarenessQueryKey } from "./useConnectionAwareness";

interface ShareMoodResponse {
  id: string;
  mood: ShareMoodRequest["mood"];
  note?: string;
}

async function shareMood(data: ShareMoodRequest): Promise<ShareMoodResponse> {
  const response = await post({
    url: "/moods",
    data,
    responseSchema: moodResponseSchema,
  });

  return response.data;
}

export function useShareMood(
  options?: AllowedUseMutationOptions<ShareMoodResponse, ShareMoodRequest>,
) {
  return useMutation({
    mutationFn: shareMood,
    ...options,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: relationshipHomeQueryKey });
      void queryClient.invalidateQueries({ queryKey: partnerActivityQueryKey });
      void queryClient.invalidateQueries({ queryKey: connectionAwarenessQueryKey });
      options?.onSuccess?.(...args);
    },
  });
}
