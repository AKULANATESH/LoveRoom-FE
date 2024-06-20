import { type UseQueryResult } from "@tanstack/react-query";

import { useGetQuery, type UseGetQueryOptions } from "../../api/useGetQuery";
import { environmentConfig } from "../../environment";
import { type PostResponse, postResponseSchema } from "../types";

export const GET_POSTS_PATH = "/posts";

interface GetPostParams {
  postId: string;
}

export function useGetPost(
  params: GetPostParams,
  options: UseGetQueryOptions<PostResponse> = {},
): UseQueryResult<PostResponse> {
  const { postId } = params;

  return useGetQuery({
    url: `${environmentConfig.BACKEND_API_URL}${GET_POSTS_PATH}/${postId}`,
    responseSchema: postResponseSchema,
    meta: {
      userErrorMessage: "Error while getting post",
    },
    ...options,
  });
}
