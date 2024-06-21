import "./App.css";

import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./api";
import { AuthProvider } from "./auth/useAuth";
import { MaterialUiProviders } from "./lib/mui/MaterialUiProviders";
import { SnackBarProvider } from "./lib/notifications/SnackbarProvider";
import { RouterProvider } from "./routes/RouterProvider";

function App() {
  return (
    <MaterialUiProviders>
      <SnackBarProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <RouterProvider />
          </AuthProvider>
        </QueryClientProvider>
      </SnackBarProvider>
    </MaterialUiProviders>
  );
}

export default App;
