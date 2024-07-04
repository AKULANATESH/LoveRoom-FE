import { createTheme, type Theme } from "@mui/material";
import { common, red } from "@mui/material/colors";

export function getTheme(paletteMode: Theme["palette"]["mode"]): Theme {
  const modeIsLight = paletteMode === "light";
  const textColor = modeIsLight ? common.black : common.white;

  return createTheme({
    shape: {
      borderRadius: 8,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 400,
        md: 600,
        lg: 900,
        xl: 1400,
      },
    },
    typography: {
      allVariants: {
        color: textColor,
        fontWeight: 400,
        lineHeight: "inherit",
      },
      h1: {
        fontSize: "1.75rem",
      },
      h2: {
        fontSize: "1.5rem",
      },
      h3: {
        fontSize: "1.25rem",
        lineHeight: "1.75rem",
      },
      h4: {
        fontSize: "1rem",
      },
      body1: {
        fontSize: "1rem",
      },
      body2: {
        fontSize: "0.875rem",
      },
      caption: {
        lineHeight: "1rem",
      },
    },
    palette: {
      primary: {
        main: common.black,
      },
      secondary: {
        main: common.white,
      },
      error: {
        main: red[100],
        light: "#EF5350",
        contrastText: "#FFF1F0",
      },
      info: {
        main: "#1890FF",
        light: "#ECF4FA",
        contrastText: "#E5F5FD",
      },
      warning: {
        main: "#E7A600",
        light: "#FAECEC",
      },
      success: {
        main: "#2E7D32",
        light: "#4CAF50",
        contrastText: "#EDF7ED",
      },
      text: {
        primary: textColor,
        secondary: textColor,
      },
    },
  });
}
