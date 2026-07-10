import { type AllowedUseMutationOptions, patch, queryClient } from "@src/api";
import { useMutation } from "@tanstack/react-query";

import type { OpenSnapResponse } from "../types";
import { openSnapResponseSchema } from "./schemas";
import { chatMessagesQueryKey } from "./useChatMessages";

async function openSnap(messageId: string): Promise<OpenSnapResponse> {
  const response = await patch({
    url: `/chat/messages/${messageId}/open`,
    responseSchema: openSnapResponseSchema,
  });

  return response.data;
}

export function useOpenSnap(
  options?: AllowedUseMutationOptions<OpenSnapResponse, string>,
) {
  return useMutation({
    mutationFn: openSnap,
    ...options,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: chatMessagesQueryKey });
      options?.onSuccess?.(...args);
    },
  });
}
