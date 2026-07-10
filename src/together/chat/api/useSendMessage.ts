import { type AllowedUseMutationOptions, post, queryClient } from "@src/api";
import { useMutation } from "@tanstack/react-query";

import type { ChatMessage, SendChatMessageRequest } from "../types";
import { chatMessageSchema } from "./schemas";
import { chatMessagesQueryKey } from "./useChatMessages";

async function sendMessage(data: SendChatMessageRequest): Promise<ChatMessage> {
  const response = await post({
    url: "/chat/messages",
    data,
    responseSchema: chatMessageSchema,
  });

  return response.data;
}

export function useSendMessage(
  options?: AllowedUseMutationOptions<ChatMessage, SendChatMessageRequest>,
) {
  return useMutation({
    mutationFn: sendMessage,
    ...options,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: chatMessagesQueryKey });
      options?.onSuccess?.(...args);
    },
  });
}
