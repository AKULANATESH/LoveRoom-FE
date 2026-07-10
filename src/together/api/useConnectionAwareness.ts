import { type AllowedUseQueryOptions, get } from "@src/api";
import { useQuery } from "@tanstack/react-query";

import type { ConnectionAwarenessData } from "../types";
import { connectionAwarenessSchema } from "./schemas";

export const connectionAwarenessQueryKey = ["connection", "awareness"];

async function getConnectionAwareness(): Promise<ConnectionAwarenessData> {
  const response = await get({
    url: "/connection/awareness",
    responseSchema: connectionAwarenessSchema,
  });

  return response.data;
}

export function useConnectionAwareness(
  options?: AllowedUseQueryOptions<ConnectionAwarenessData>,
) {
  return useQuery({
    queryKey: connectionAwarenessQueryKey,
    queryFn: getConnectionAwareness,
    refetchInterval: 15_000,
    ...options,
  });
}
