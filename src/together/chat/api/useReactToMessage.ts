import { type AllowedUseMutationOptions, post, queryClient } from "@src/api";
import { useMutation } from "@tanstack/react-query";

import type { ChatMessage } from "../types";
import { chatMessageSchema } from "./schemas";
import { chatMessagesQueryKey } from "./useChatMessages";

interface ReactToMessageInput {
  messageId: string;
  reaction: string;
}

async function reactToMessage({
  messageId,
  reaction,
}: ReactToMessageInput): Promise<ChatMessage> {
  const response = await post({
    url: `/chat/messages/${messageId}/reaction`,
    data: { reaction },
    responseSchema: chatMessageSchema,
  });

  return response.data;
}

export function useReactToMessage(
  options?: AllowedUseMutationOptions<ChatMessage, ReactToMessageInput>,
) {
  return useMutation({
    mutationFn: reactToMessage,
    ...options,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: chatMessagesQueryKey });
      options?.onSuccess?.(...args);
    },
  });
}
