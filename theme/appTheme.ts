import { createTheme, ThemeOptions } from "@mui/material/styles";

const sharedTypography: ThemeOptions["typography"] = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  h5: { fontWeight: 700, fontSize: "1.25rem", lineHeight: 1.3 },
  h6: { fontWeight: 600, fontSize: "1.1rem", lineHeight: 1.35 },
  body1: { fontSize: "1rem", lineHeight: 1.5 },
  body2: { fontSize: "0.875rem", lineHeight: 1.45 },
  button: { textTransform: "none", fontWeight: 600 },
};

const sharedShape = { borderRadius: 12 };

export const createAppTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "light" ? "#1565C0" : "#64B5F6",
        dark: "#0D47A1",
        light: "#42A5F5",
        contrastText: "#fff",
      },
      secondary: {
        main: mode === "light" ? "#00897B" : "#4DB6AC",
      },
      background: {
        default: mode === "light" ? "#F4F6F8" : "#121212",
        paper: mode === "light" ? "#FFFFFF" : "#1E1E1E",
      },
      divider: mode === "light" ? "#E8ECF0" : "#2A2A2A",
      success: { main: "#2E7D32" },
      error: { main: "#C62828" },
    },
    typography: sharedTypography,
    shape: sharedShape,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            overflowX: "hidden",
            WebkitFontSmoothing: "antialiased",
          },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderBottom: "1px solid",
            borderColor: mode === "light" ? "#E8ECF0" : "#2A2A2A",
          },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 10,
            minHeight: 44,
            padding: "8px 20px",
          },
          contained: {
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          },
        },
      },
      MuiTextField: {
        defaultProps: { variant: "outlined", size: "medium" },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: "1px solid",
            borderColor: mode === "light" ? "#E8ECF0" : "#2A2A2A",
          },
        },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            height: 64,
            borderTop: "1px solid",
            borderColor: mode === "light" ? "#E8ECF0" : "#2A2A2A",
          },
        },
      },
      MuiBottomNavigationAction: {
        styleOverrides: {
          root: {
            minWidth: 0,
            padding: "6px 0",
            "&.Mui-selected": {
              fontSize: "0.75rem",
            },
          },
          label: {
            fontSize: "0.7rem",
            "&.Mui-selected": {
              fontSize: "0.75rem",
            },
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            height: 8,
          },
        },
      },
    },
  });
