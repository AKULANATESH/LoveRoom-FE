import { type UseQueryResult } from "@tanstack/react-query";
import { z } from "zod";

import { useGetQuery, type UseGetQueryOptions } from "../../api";
import { environmentConfig } from "../../environment";

export const GET_POSTS_PATH = "/posts";

const commentsResponseSchema = z.array(
  z.object({
    postId: z.number(),
    id: z.number(),
    name: z.string(),
    email: z.string(),
    body: z.string(),
  }),
);
export type CommentsResponse = z.infer<typeof commentsResponseSchema>;

interface GetPostCommentsParams {
  postId: number;
}

export function useGetPostComments(
  params: GetPostCommentsParams,
  options: UseGetQueryOptions<CommentsResponse> = {},
): UseQueryResult<CommentsResponse> {
  const { postId } = params;

  return useGetQuery({
    url: `${environmentConfig.BACKEND_API_URL}${GET_POSTS_PATH}/${postId}/comments`,
    responseSchema: commentsResponseSchema,
    meta: {
      userErrorMessage: "Error while getting post comments",
    },
    ...options,
  });
}
