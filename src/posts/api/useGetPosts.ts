import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { z } from "zod";

import { type AllowedUseQueryOptions, get } from "../../api";
import { environmentConfig } from "../../environment";
import { postResponseSchema } from "../types";

const postsResponseSchema = z.array(postResponseSchema);
export type PostsResponse = z.infer<typeof postsResponseSchema>;

export function useGetPosts(
  options: AllowedUseQueryOptions<PostsResponse> = {},
): UseQueryResult<PostsResponse> {
  const url = `${environmentConfig.BACKEND_API_URL}/posts`;

  return useQuery({
    ...options,
    meta: {
      userErrorMessage: "Error while getting posts",
    },
    queryKey: [url],
    queryFn: async () => {
      const response = await get({
        url,
        responseSchema: postsResponseSchema,
      });
      return response.data;
    },
  });
}
