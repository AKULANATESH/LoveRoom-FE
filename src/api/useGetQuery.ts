import {
  type QueryKey,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { type AxiosError } from "axios";

import { type ApiResponse, type CommonApiParams, get } from "./api";
import { type ReactQueryMeta } from "./types";

type UseQueryResponseType<ResponseSchema> = ApiResponse<ResponseSchema>["data"];

type LocallyDefinedUseQueryOptions = "meta" | "queryKey" | "queryFn";
type DisallowedUseQueryOptions = "onSuccess" | "onError" | "onSettled";

export type UseGetQueryOptions<ResponseSchema> = Omit<
  UseQueryOptions<
    UseQueryResponseType<ResponseSchema>,
    AxiosError,
    UseQueryResponseType<ResponseSchema>,
    QueryKey
  >,
  LocallyDefinedUseQueryOptions | DisallowedUseQueryOptions
> &
  Pick<ReactQueryMeta, "userSuccessMessage" | "userErrorMessage">;

export type UseGetQueryProps<ResponseSchema> = CommonApiParams<ResponseSchema> &
  UseGetQueryOptions<ResponseSchema> & {
    meta: ReactQueryMeta;
  };

export function useGetQuery<ResponseSchema>(
  props: UseGetQueryProps<ResponseSchema>,
): UseQueryResult<ResponseSchema> {
  const {
    url,
    queryParams,
    responseSchema,
    meta,
    userSuccessMessage,
    userErrorMessage,
    ...options
  } = props;
  return useQuery({
    ...options,
    meta: {
      ...meta,
      /**
       * This allows the UI to optionally define the user facing messages, while keeping the
       * logging at the `useGetQuery` usage.
       */
      userSuccessMessage: userSuccessMessage ?? meta.userSuccessMessage,
      userErrorMessage: userErrorMessage ?? meta.userErrorMessage,
    },
    queryKey: [url, queryParams],
    queryFn: async () => {
      const response = await get({
        url,
        queryParams,
        responseSchema,
      });
      return response.data;
    },
  });
}
