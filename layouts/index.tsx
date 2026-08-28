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
      <Box sx={{ display: "flex", height: "100dvh", bgcolor: "background.default" }}>
        <CssBaseline />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: "100%",
            height: "100dvh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Container
            maxWidth="sm"
            sx={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              px: { xs: 1.5, sm: 2 },
              pt: { xs: 1.5, sm: 2 },
              pb: {
                xs: "calc(56px + env(safe-area-inset-bottom) + 12px)",
                sm: 2,
              },
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
