import { type AllowedUseQueryOptions, get } from "@src/api";
import { environmentConfig } from "@src/environment";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { z } from "zod";

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
  options: AllowedUseQueryOptions<CommentsResponse> = {},
): UseQueryResult<CommentsResponse> {
  const { postId } = params;
  const url = `${environmentConfig.BACKEND_API_URL}/posts/${postId}/comments`;

  return useQuery({
    ...options,
    meta: {
      userErrorMessage: "Error while getting post comments",
    },
    queryKey: [url],
    queryFn: async () => {
      const response = await get({
        url,
        responseSchema: commentsResponseSchema,
      });
      return response.data;
    },
  });
}
