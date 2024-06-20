import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { type AllowedUseQueryOptions, get } from "../../api";
import { environmentConfig } from "../../environment";
import { type PostResponse, postResponseSchema } from "../types";

interface GetPostParams {
  postId: number;
}

export function useGetPost(
  params: GetPostParams,
  options: AllowedUseQueryOptions<PostResponse> = {},
): UseQueryResult<PostResponse> {
  const { postId } = params;
  const url = `${environmentConfig.BACKEND_API_URL}/posts/${postId}`;

  return useQuery({
    ...options,
    meta: {
      userErrorMessage: "Error while getting post",
    },
    queryKey: [url],
    queryFn: async () => {
      const response = await get({
        url,
        responseSchema: postResponseSchema,
      });
      return response.data;
    },
  });
}
