import { type AllowedUseQueryOptions, get } from "@src/api";
import { useQuery } from "@tanstack/react-query";

import type { ChatMessage } from "../types";
import { chatMessagesSchema } from "./schemas";

export const chatMessagesQueryKey = ["chat", "messages"];

async function getChatMessages(): Promise<ChatMessage[]> {
  const response = await get({
    url: "/chat/messages",
    responseSchema: chatMessagesSchema,
  });

  return response.data;
}

export function useChatMessages(options?: AllowedUseQueryOptions<ChatMessage[]>) {
  return useQuery({
    queryKey: chatMessagesQueryKey,
    queryFn: getChatMessages,
    ...options,
  });
}
