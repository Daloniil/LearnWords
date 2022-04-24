import { Box, Container, CssBaseline, Paper, Toolbar } from "@mui/material";

import Router, { useRouter } from "next/router";
import React from "react";

import { useEffect, useState } from "react";
import { Bar } from "../components/Bar";
import { DrawerBar } from "../components/Drawer";
import { useLanguage } from "../hooks/useLanguage";
import { useNotification } from "../hooks/useNotification";
import { useTheme } from "../hooks/useTheme";
import { useWords } from "../hooks/useWords";
import { LayoutProps } from "../Interfaces/LayoutInterface";
import { NotificationKeys, WordsParams } from "../services/localKey";
import { paths } from "../utils/path";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { englishWords } = useWords();
  const { addNotification } = useNotification();
  const { languageContext } = useLanguage();
  const { themeContext } = useTheme();

  const [mode, setMode] = useState("light");

  const [open, setOpen] = useState(false);
  const items = paths.find((path) => path.pathName === router.asPath);

  const status =
    englishWords.length <= WordsParams.MINLENGTH && router.asPath === "/test";

  const theme = createTheme({
    palette: {
      //@ts-ignore
      mode,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            overflow: "hidden",
          },
        },
      },
    },
  });

  useEffect(() => {
    if (status) {
      addNotification("leastFive", NotificationKeys.ERROR);
      Router.push("/enter");
    }
  }, []);

  // useEffect(() => {
  //   setMode(themeContext);
  // }, [themeContext]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Bar
          title={
            languageContext === "english" ? items?.en ?? "" : items?.ru ?? ""
          }
          setOpen={setOpen}
        />
        <DrawerBar openDrawer={open} setOpenDrawer={setOpen} />

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4, width: "100vw" }}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              {!status ? children : ""}
            </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
