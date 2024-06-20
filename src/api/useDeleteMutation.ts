import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { type AxiosError } from "axios";

import { type ApiParams, type ApiResponse, remove } from "./api";
import { type ReactQueryMeta } from "./types";

type UseMutationResponseType<ResponseSchema> = ApiResponse<ResponseSchema>["data"];

type LocallyDefinedUseMutationOptions = "meta" | "mutationFn";
type DisallowedUseMutationOptions = "onSuccess" | "onError" | "onSettled";

export type UseDeleteMutationOptions<RequestSchema, ResponseSchema> = Omit<
  UseMutationOptions<
    UseMutationResponseType<ResponseSchema>,
    AxiosError,
    UseMutationResponseType<RequestSchema>,
    unknown
  >,
  LocallyDefinedUseMutationOptions | DisallowedUseMutationOptions
> &
  Pick<ReactQueryMeta, "userSuccessMessage" | "userErrorMessage">;

export type UseDeleteMutationProps<RequestSchema, ResponseSchema> = ApiParams<
  RequestSchema,
  ResponseSchema
> &
  UseDeleteMutationOptions<RequestSchema, ResponseSchema> & {
    meta: ReactQueryMeta;
  };

export function useDeleteMutation<RequestSchema, ResponseSchema>(
  props: UseDeleteMutationProps<RequestSchema, ResponseSchema>,
): UseMutationResult<ResponseSchema, AxiosError, RequestSchema> {
  const {
    url,
    queryParams,
    responseSchema,
    meta,
    userSuccessMessage,
    userErrorMessage,
    ...options
  } = props;

  return useMutation({
    ...options,
    meta: {
      ...meta,
      /**
       * This allows the UI to optionally define the user facing messages, while keeping the
       * logging at the `useDeleteMutation` usage.
       */
      userSuccessMessage: userSuccessMessage ?? meta.userSuccessMessage,
      userErrorMessage: userErrorMessage ?? meta.userErrorMessage,
    },
    mutationFn: async () => {
      const response = await remove({
        url,
        queryParams,
        responseSchema,
      });
      return response.data;
    },
  });
}
