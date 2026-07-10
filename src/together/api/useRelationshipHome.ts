import { type AllowedUseQueryOptions, get } from "@src/api";
import { useQuery } from "@tanstack/react-query";

import type { RelationshipHomeData } from "../types";
import { relationshipHomeSchema } from "./schemas";

const relationshipHomeQueryKey = ["relationship", "home"];

async function getRelationshipHome(): Promise<RelationshipHomeData> {
  const response = await get({
    url: "/relationship/home",
    responseSchema: relationshipHomeSchema,
  });

  return response.data;
}

export function useRelationshipHome(options?: AllowedUseQueryOptions<RelationshipHomeData>) {
  return useQuery({
    queryKey: relationshipHomeQueryKey,
    queryFn: getRelationshipHome,
    ...options,
  });
}

export { relationshipHomeQueryKey };
