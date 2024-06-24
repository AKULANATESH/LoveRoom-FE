import { Button } from "@mui/material";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { MaterialUiProviders } from "../mui/MaterialUiProviders";
import { SnackBarProvider } from "./SnackbarProvider";
import { useToast } from "./useToast";

const TOAST_VARIANTS = ["error", "info", "warning", "success"];
function ToastButtons() {
  const { showErrorToast, showInfoToast, showWarningToast, showSuccessToast } = useToast();
  const TOASTS = {
    error: showErrorToast,
    info: showInfoToast,
    warning: showWarningToast,
    success: showSuccessToast,
  };

  return (
    <>
      {Object.entries(TOASTS).map(([toastName, toastFunction]) => (
        <Button
          key={toastName}
          variant="contained"
          onClick={() => {
            toastFunction(`The ${toastName} toast.`);
          }}
        >
          Show {toastName} toast
        </Button>
      ))}
    </>
  );
}

describe("MuiSnackbarProvider and useToast", () => {
  beforeEach(() => {
    /** notistack uses timeouts for animations */
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.each(TOAST_VARIANTS)("renders a %s toast", async (toastVariant) => {
    render(
      <MaterialUiProviders>
        <SnackBarProvider>
          <ToastButtons />
        </SnackBarProvider>
      </MaterialUiProviders>,
    );

    await userEvent.click(screen.getByRole("button", { name: `Show ${toastVariant} toast` }));
    await act(async () => {
      vi.advanceTimersToNextTimer();
    });

    expect(screen.getByRole("alert")).toHaveTextContent(`The ${toastVariant} toast.`);

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "Close" }));
    });
    await act(async () => {
      vi.advanceTimersToNextTimer();
    });

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("closes one toast, leaving the other visible", async () => {
    render(
      <MaterialUiProviders>
        <SnackBarProvider>
          <ToastButtons />
        </SnackBarProvider>
      </MaterialUiProviders>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Show error toast" }));
    await userEvent.click(screen.getByRole("button", { name: "Show info toast" }));
    await act(async () => {
      vi.advanceTimersToNextTimer();
    });

    const alertElements = screen.getAllByRole("alert");
    expect(alertElements[1]).toHaveTextContent(`The info toast.`);
    expect(alertElements[0]).toHaveTextContent(`The error toast.`);

    await act(async () => {
      await userEvent.click(within(alertElements[1]).getByRole("button", { name: "Close" }));
    });
    await act(async () => {
      vi.advanceTimersToNextTimer();
    });

    const remainingAlertElements = screen.getAllByRole("alert");
    expect(remainingAlertElements).toHaveLength(1);
    expect(remainingAlertElements[0]).toHaveTextContent(`The error toast.`);
  });
});
