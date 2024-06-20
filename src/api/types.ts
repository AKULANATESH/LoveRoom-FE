import { type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query";
import { type AxiosError } from "axios";

export interface ReactQueryMeta {
  userSuccessMessage?: string;
  userErrorMessage?: string;
}

export type AllowedUseQueryOptions<ResponseSchema> = Omit<
  UseQueryOptions<ResponseSchema, AxiosError>,
  "queryKey" | "queryFn"
>;

export type AllowedUseMutationOptions<ResponseSchema, RequestSchema = void> = Omit<
  UseMutationOptions<ResponseSchema, AxiosError, RequestSchema>,
  "mutationFn"
>;
