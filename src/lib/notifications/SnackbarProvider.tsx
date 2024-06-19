import { SnackbarProvider } from "notistack";
import { type ReactNode } from "react";

interface SnackBarProviderProps {
  children: ReactNode;
}

export function SnackBarProvider(props: SnackBarProviderProps) {
  const { children } = props;

  return (
    <SnackbarProvider
      preventDuplicate
      anchorOrigin={{ horizontal: "center", vertical: "top" }}
      autoHideDuration={5000}
      maxSnack={2}
    >
      {children}
    </SnackbarProvider>
  );
}
