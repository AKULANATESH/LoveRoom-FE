import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import type React from "react";
import { type ReactElement } from "react";

import { getTheme } from "./theme";

const theme = getTheme("light");

interface MaterialUiProvidersProps {
  children: React.ReactNode;
}

export function MaterialUiProviders(props: MaterialUiProvidersProps): ReactElement {
  const { children } = props;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>{children}</LocalizationProvider>
    </ThemeProvider>
  );
}
