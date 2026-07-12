import { type AllowedUseMutationOptions, post } from "@src/api";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

interface ResetPasswordRequest {
  token: string;
  username: string;
  password: string;
}

const resetPasswordResponseSchema = z.object({
  message: z.string(),
});

async function resetPassword(
  data: ResetPasswordRequest,
): Promise<{ message: string }> {
  const response = await post({
    url: "/auth/reset-password",
    data,
    responseSchema: resetPasswordResponseSchema,
  });
  return response.data;
}

export function useResetPassword(
  options?: AllowedUseMutationOptions<{ message: string }, ResetPasswordRequest>,
) {
  return useMutation({
    mutationFn: resetPassword,
    ...options,
  });
}
