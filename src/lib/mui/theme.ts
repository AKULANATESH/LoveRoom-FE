import { alpha, createTheme, type Theme } from "@mui/material";

export function getTheme(paletteMode: Theme["palette"]["mode"]): Theme {
  const textPrimary = "#1F2937";
  const textSecondary = "#6B7280";
  const primaryColor = "#E91E63";

  return createTheme({
    shape: {
      borderRadius: 18,
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
      fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      allVariants: {
        color: textPrimary,
        fontWeight: 400,
      },
      h1: {
        fontSize: "34px",
        lineHeight: "42px",
        fontWeight: 800,
        letterSpacing: "-0.04em",
      },
      h2: {
        fontSize: "28px",
        lineHeight: "36px",
        fontWeight: 800,
        letterSpacing: "-0.03em",
      },
      h3: {
        fontSize: "22px",
        lineHeight: "30px",
        fontWeight: 700,
      },
      h4: {
        fontSize: "18px",
        lineHeight: "26px",
        fontWeight: 700,
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
      mode: paletteMode,
      background: {
        default: "#FFF5F8",
        paper: "#FFFFFF",
      },
      primary: {
        main: primaryColor,
      },
      secondary: {
        main: "#FF4081",
      },
      error: {
        main: "#D92D20",
      },
      info: {
        main: "#E91E63",
      },
      warning: {
        main: "#F79009",
      },
      success: {
        main: "#4CAF50",
      },
      text: {
        primary: textPrimary,
        secondary: textSecondary,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background:
              "radial-gradient(circle at top left, rgba(255, 205, 210, 0.55), transparent 32%), #FFF5F8",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "unset",
            borderRadius: "999px",
            fontWeight: 700,
            boxShadow: "none",
          },
          containedPrimary: {
            boxShadow: `0 14px 32px ${alpha(primaryColor, 0.28)}`,
            "&:hover": {
              boxShadow: `0 16px 36px ${alpha(primaryColor, 0.34)}`,
            },
          },
        },
        defaultProps: {
          draggable: false,
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 28,
            boxShadow: "0 20px 60px rgba(233, 30, 99, 0.09)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  });
}
