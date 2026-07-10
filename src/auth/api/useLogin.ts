import { type AllowedUseMutationOptions, post } from "@src/api";
import { useMutation } from "@tanstack/react-query";

import type { AuthResponse } from "../types";
import { authResponseSchema } from "../types";

interface LoginRequest {
  email: string;
  password: string;
}

async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  const response = await post({
    url: "/auth/login",
    data,
    responseSchema: authResponseSchema,
  });
  return response.data;
}

export function useLogin(options?: AllowedUseMutationOptions<AuthResponse, LoginRequest>) {
  return useMutation({
    mutationFn: loginUser,
    ...options,
  });
}
