import { type AllowedUseMutationOptions, remove } from "@src/api";
import { environmentConfig } from "@src/environment";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { z } from "zod";

const deletePostResponseSchema = z.object({});

export type DeletePostResponse = z.infer<typeof deletePostResponseSchema>;

interface DeletePostParams {
  postId: number;
}

export function useDeletePost(
  params: DeletePostParams,
  options: AllowedUseMutationOptions<DeletePostResponse> = {},
): UseMutationResult<DeletePostResponse, AxiosError, void> {
  const { postId } = params;

  return useMutation({
    ...options,
    meta: {
      userSuccessMessage: "Successfully deleted the post",
      userErrorMessage: "Error while deleting the post",
    },
    mutationFn: async () => {
      const response = await remove({
        url: `${environmentConfig.BACKEND_API_URL}/posts/${postId}`,
        responseSchema: deletePostResponseSchema,
      });
      return response.data;
    },
  });
}
