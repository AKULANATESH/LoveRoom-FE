import { Close as CloseIcon } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { closeSnackbar, type SnackbarKey, SnackbarProvider } from "notistack";
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
      action={(snackbarId?: SnackbarKey) => (
        <IconButton
          onClick={() => {
            closeSnackbar(snackbarId);
          }}
          size="small"
          sx={{ color: (theme) => theme.palette.common.white }}
          title="Close"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    >
      {children}
    </SnackbarProvider>
  );
}
