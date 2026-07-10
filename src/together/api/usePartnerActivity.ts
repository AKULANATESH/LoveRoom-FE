import { type AllowedUseQueryOptions, get } from "@src/api";
import { useQuery } from "@tanstack/react-query";

import type { PartnerActivityFeed } from "../types";
import { partnerActivityFeedSchema } from "./schemas";

export const partnerActivityQueryKey = ["partner", "activity"];

async function getPartnerActivity(): Promise<PartnerActivityFeed> {
  const response = await get({
    url: "/partner/activity",
    responseSchema: partnerActivityFeedSchema,
  });

  return response.data;
}

export function usePartnerActivity(options?: AllowedUseQueryOptions<PartnerActivityFeed>) {
  return useQuery({
    queryKey: partnerActivityQueryKey,
    queryFn: getPartnerActivity,
    refetchInterval: 30_000,
    ...options,
  });
}
