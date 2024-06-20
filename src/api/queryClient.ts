import {
  MutationCache,
  QueryCache,
  QueryClient,
  type QueryObserverOptions,
} from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

export const defaultQueryOptions: Pick<
  QueryObserverOptions,
  "refetchOnWindowFocus" | "retry" | "retryDelay"
> = {
  refetchOnWindowFocus: true,
  retry: 2,
  retryDelay: 1000,
};

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: {
      userErrorMessage?: string;
      userSuccessMessage?: string;
    };
    mutationMeta: {
      userErrorMessage?: string;
      userSuccessMessage?: string;
    };
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (_error, query) => {
      const { meta: { userErrorMessage } = {} } = query;

      if (userErrorMessage) {
        enqueueSnackbar({
          variant: "error",
          message: userErrorMessage,
        });
      }
    },
    onSuccess: (_, query) => {
      const { meta: { userSuccessMessage } = {} } = query;

      if (userSuccessMessage) {
        enqueueSnackbar({
          variant: "success",
          message: userSuccessMessage,
        });
      }
    },
  }),
  mutationCache: new MutationCache({
    onError(_error, _variables, _context, mutation) {
      const { meta: { userErrorMessage } = {} } = mutation;

      if (userErrorMessage) {
        enqueueSnackbar({
          variant: "error",
          message: userErrorMessage,
        });
      }
    },
    onSuccess(_data, _variables, _context, mutation) {
      const { meta: { userSuccessMessage } = {} } = mutation;

      if (userSuccessMessage) {
        enqueueSnackbar({
          variant: "success",
          message: userSuccessMessage,
        });
      }
    },
  }),
  defaultOptions: {
    queries: defaultQueryOptions,
  },
});
