import { type UseMutationResult } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { z } from "zod";

import { useDeleteMutation, type UseDeleteMutationOptions } from "../../api";
import { environmentConfig } from "../../environment";

const deletePostResponseSchema = z.object({});

export type DeletePostResponse = z.infer<typeof deletePostResponseSchema>;

interface DeletePostParams {
  postId: number;
}

export function useDeletePost(
  params: DeletePostParams,
  options: UseDeleteMutationOptions<void, DeletePostResponse> = {},
): UseMutationResult<DeletePostResponse, AxiosError, void> {
  const { postId } = params;

  return useDeleteMutation({
    url: `${environmentConfig.BACKEND_API_URL}/posts/${postId}`,
    responseSchema: deletePostResponseSchema,
    meta: {
      userSuccessMessage: "Successfully deleted the post",
      userErrorMessage: "Error while deleting the post",
    },
    ...options,
  });
}
