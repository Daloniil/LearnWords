import { Box, Container, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { BottomNav } from "../components/BottomNav";
import { useTheme } from "../hooks/useTheme";
import { LayoutProps } from "../Interfaces/LayoutInterface";
import { Mode } from "../services/localKey";
import { createAppTheme } from "../theme/appTheme";
import { useAuth } from "../hooks/useAuth";
import { BlockedAccessCard } from "../components/BlockedAccess";

const Layout = ({ children }: LayoutProps) => {
  const { themeContext } = useTheme();
  const { authContext } = useAuth();

  const [mode, setMode] = useState<Mode.DARK | Mode.LIGHT>(Mode.LIGHT);
  const theme = createAppTheme(mode);

  useEffect(() => {
    setMode(
      themeContext ? (themeContext as Mode.DARK | Mode.LIGHT) : Mode.LIGHT
    );
  }, [themeContext]);

  if (authContext.user.uid === "hh") {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BlockedAccessCard />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100dvh", bgcolor: "background.default" }}>
        <CssBaseline />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: "100%",
            minHeight: "100dvh",
            overflow: "auto",
          }}
        >
          <Container
            maxWidth="sm"
            sx={{
              px: { xs: 1.5, sm: 2 },
              pt: { xs: 1.5, sm: 2 },
              pb: { xs: "calc(64px + env(safe-area-inset-bottom))", sm: 2 },
            }}
          >
            {children}
          </Container>
        </Box>

        <BottomNav />
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
