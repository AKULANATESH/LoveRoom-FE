import "./App.css";

import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./api";
import { MaterialUiProviders } from "./lib/mui/MaterialUiProviders";
import { SnackBarProvider } from "./lib/notifications/SnackbarProvider";
import { RouterProvider } from "./routes/RouterProvider";

function App() {
  return (
    <MaterialUiProviders>
      <SnackBarProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider />
        </QueryClientProvider>
      </SnackBarProvider>
    </MaterialUiProviders>
  );
}

export default App;
