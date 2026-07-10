import { type AllowedUseMutationOptions, post } from "@src/api";
import { useMutation } from "@tanstack/react-query";

import type { AuthResponse } from "../types";
import { authResponseSchema } from "../types";

interface RegisterRequest {
  name: string;
  email: string;
  username: string;
  password: string;
}

async function registerUser(data: RegisterRequest): Promise<AuthResponse> {
  const response = await post({
    url: "/auth/register",
    data,
    responseSchema: authResponseSchema,
  });
  return response.data;
}

export function useRegister(options?: AllowedUseMutationOptions<AuthResponse, RegisterRequest>) {
  return useMutation({
    mutationFn: registerUser,
    ...options,
  });
}
