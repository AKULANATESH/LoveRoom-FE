import { type AllowedUseMutationOptions, post } from "@src/api";
import { environmentConfig } from "@src/environment";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { type AxiosError } from "axios";

import { type PostResponse, postResponseSchema } from "../types";

interface CreatePostRequest {
  userId: number;
  title: string;
  body: string;
}

export function useCreatePost(
  options: AllowedUseMutationOptions<PostResponse, CreatePostRequest> = {},
): UseMutationResult<PostResponse, AxiosError, CreatePostRequest> {
  return useMutation({
    ...options,
    meta: {
      userSuccessMessage: "Successfully added the post",
      userErrorMessage: "Error while adding the post",
    },
    mutationFn: async (data) => {
      const response = await post({
        url: `${environmentConfig.BACKEND_API_URL}/posts`,
        data,
        responseSchema: postResponseSchema,
      });
      return response.data;
    },
  });
}
