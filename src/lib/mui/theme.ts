import { createTheme, type Theme } from "@mui/material";
import { common } from "@mui/material/colors";

export function getTheme(paletteMode: Theme["palette"]["mode"]): Theme {
  const modeIsLight = paletteMode === "light";
  const textColor = modeIsLight ? common.black : common.white;
  const primaryColor = "#2C9497";

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
      },
      h1: {
        fontSize: "28px",
        lineHeight: "36px",
      },
      h2: {
        fontSize: "24px",
        lineHeight: "32px",
      },
      h3: {
        fontSize: "20px",
        lineHeight: "28px",
      },
      h4: {
        fontSize: "16px",
        lineHeight: "24px",
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
        main: primaryColor,
      },
      secondary: {
        main: common.white,
      },
      error: {
        main: "#D92D20",
      },
      info: {
        main: "#1890FF",
      },
      warning: {
        main: "#F79009",
      },
      success: {
        main: "#079455",
      },
      text: {
        primary: textColor,
        secondary: textColor,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "unset",
            borderRadius: "8px",
          },
        },
        defaultProps: {
          disableRipple: true,
          draggable: false,
        },
      },
    },
  });
}
