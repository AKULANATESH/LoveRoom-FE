import { defaultQueryOptions, mutationCache, queryCache } from "@src/api/queryClient";
import { MaterialUiProviders } from "@src/lib/mui/MaterialUiProviders";
import { SnackBarProvider } from "@src/lib/notifications/SnackbarProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactElement, type ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

interface Props {
  children: ReactNode;
}

export function MockAppWrapper(props: Props): ReactElement {
  const { children } = props;

  queryCache.clear();
  mutationCache.clear();

  const queryClient = new QueryClient({
    queryCache,
    mutationCache,
    defaultOptions: {
      queries: {
        ...defaultQueryOptions,
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <MaterialUiProviders>
      <SnackBarProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>{children}</BrowserRouter>
        </QueryClientProvider>
      </SnackBarProvider>
    </MaterialUiProviders>
  );
}
