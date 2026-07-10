import { type AllowedUseMutationOptions, post, queryClient } from "@src/api";
import { useMutation } from "@tanstack/react-query";

import type { RecordHourlyTouchRequest } from "../types";
import { hourlyTouchResponseSchema } from "./schemas";
import { connectionAwarenessQueryKey } from "./useConnectionAwareness";

interface RecordHourlyTouchResponse {
  id: string;
  hour: number;
  hourLabel: string;
  recorded: boolean;
}

async function recordHourlyTouch(
  data: RecordHourlyTouchRequest,
): Promise<RecordHourlyTouchResponse> {
  const response = await post({
    url: "/connection/touch",
    data,
    responseSchema: hourlyTouchResponseSchema,
  });

  return response.data;
}

export function useRecordHourlyTouch(
  options?: AllowedUseMutationOptions<RecordHourlyTouchResponse, RecordHourlyTouchRequest>,
) {
  return useMutation({
    mutationFn: recordHourlyTouch,
    ...options,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: connectionAwarenessQueryKey });
      options?.onSuccess?.(...args);
    },
  });
}
