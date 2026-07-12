import { type AllowedUseMutationOptions, post } from "@src/api";
import { useMutation } from "@tanstack/react-query";

import type { AuthResponse } from "../types";
import { authResponseSchema } from "../types";

interface RegisterCoupleRequest {
  name: string;
  email: string;
  username: string;
  partnerEmail: string;
  password: string;
}

async function registerCouple(data: RegisterCoupleRequest): Promise<AuthResponse> {
  const response = await post({
    url: "/auth/register-couple",
    data,
    responseSchema: authResponseSchema,
  });
  return response.data;
}

export function useRegisterCouple(
  options?: AllowedUseMutationOptions<AuthResponse, RegisterCoupleRequest>,
) {
  return useMutation({
    mutationFn: registerCouple,
    ...options,
  });
}
