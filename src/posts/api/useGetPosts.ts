import { type UseQueryResult } from "@tanstack/react-query";
import { z } from "zod";

import { useGetQuery, type UseGetQueryOptions } from "../../api";
import { environmentConfig } from "../../environment";
import { postResponseSchema } from "../types";

const postsResponseSchema = z.array(postResponseSchema);
export type PostsResponse = z.infer<typeof postsResponseSchema>;

export const GET_POSTS_PATH = "/posts";

export function useGetPosts(
  options: UseGetQueryOptions<PostsResponse> = {},
): UseQueryResult<PostsResponse> {
  return useGetQuery({
    url: `${environmentConfig.BACKEND_API_URL}${GET_POSTS_PATH}`,
    responseSchema: postsResponseSchema,
    meta: {
      userErrorMessage: "Error while getting posts",
    },
    ...options,
  });
}
