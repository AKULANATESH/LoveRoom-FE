import { useSnackbar } from "notistack";
import { useCallback } from "react";

export function useToast() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showSuccessToast = useCallback(
    (message: string) => {
      enqueueSnackbar({
        message,
        variant: "success",
      });
    },
    [enqueueSnackbar],
  );

  const showInfoToast = useCallback(
    (message: string) => {
      enqueueSnackbar({
        message,
        variant: "info",
      });
    },
    [enqueueSnackbar],
  );

  const showErrorToast = useCallback(
    (message: string) => {
      enqueueSnackbar({
        message,
        variant: "error",
      });
    },
    [enqueueSnackbar],
  );

  const showWarningToast = useCallback(
    (message: string) => {
      enqueueSnackbar({
        message,
        variant: "warning",
      });
    },
    [enqueueSnackbar],
  );

  return {
    showSuccessToast,
    showInfoToast,
    showErrorToast,
    showWarningToast,
    closeSnackbar,
  };
}
