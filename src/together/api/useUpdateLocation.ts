import { type AllowedUseMutationOptions, post, queryClient } from "@src/api";
import { useMutation } from "@tanstack/react-query";

import type { MyLocationStatus, UpdateLocationRequest } from "../types";
import { locationResponseSchema } from "./schemas";
import { connectionAwarenessQueryKey } from "./useConnectionAwareness";

async function updateLocation(data: UpdateLocationRequest): Promise<MyLocationStatus> {
  const response = await post({
    url: "/connection/location",
    data,
    responseSchema: locationResponseSchema,
  });

  return response.data;
}

export function useUpdateLocation(
  options?: AllowedUseMutationOptions<MyLocationStatus, UpdateLocationRequest>,
) {
  return useMutation({
    mutationFn: updateLocation,
    ...options,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: connectionAwarenessQueryKey });
      options?.onSuccess?.(...args);
    },
  });
}
