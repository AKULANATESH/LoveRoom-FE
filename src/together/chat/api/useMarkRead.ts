import { type AllowedUseMutationOptions, patch, queryClient } from "@src/api";
import { useMutation } from "@tanstack/react-query";

import { markReadResponseSchema } from "./schemas";
import { chatMessagesQueryKey } from "./useChatMessages";

interface MarkReadResponse {
  success: boolean;
}

async function markRead(): Promise<MarkReadResponse> {
  const response = await patch({
    url: "/chat/messages/read",
    responseSchema: markReadResponseSchema,
  });

  return response.data;
}

export function useMarkRead(
  options?: AllowedUseMutationOptions<MarkReadResponse, void>,
) {
  return useMutation({
    mutationFn: markRead,
    ...options,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: chatMessagesQueryKey });
      options?.onSuccess?.(...args);
    },
  });
}
