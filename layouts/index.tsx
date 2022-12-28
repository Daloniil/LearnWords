import {Box, Container, CssBaseline, Paper, Toolbar} from "@mui/material";

import {useRouter} from "next/router";
import React from "react";

import {useEffect, useState} from "react";
import {Bar} from "../components/Bar";
import {DrawerBar} from "../components/Drawer";
import {useLanguage} from "../hooks/useLanguage";
import {useTheme} from "../hooks/useTheme";
import {LayoutProps} from "../Interfaces/LayoutInterface";
import {Mode} from "../services/localKey";
import {paths} from "../utils/path";
import {createTheme, ThemeProvider} from "@mui/material/styles";

import Snowfall from 'react-snowfall'

const Layout = ({children}: LayoutProps) => {
    const router = useRouter();
    const {languageContext} = useLanguage();
    const {themeContext} = useTheme();

    const [mode, setMode] = useState<Mode.DARK | Mode.LIGHT>(Mode.LIGHT);

    const [open, setOpen] = useState(false);
    const items = paths.find((path) => path.pathName === router.asPath);

    const theme = createTheme({
        palette: {
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
        setMode(
            themeContext ? (themeContext as Mode.DARK | Mode.LIGHT) : Mode.LIGHT
        );
    }, [themeContext]);


    return (
        <ThemeProvider theme={theme}>
            <Snowfall/>
            <Box sx={{display: "flex"}}>
                <CssBaseline/>
                <Bar
                    title={
                        languageContext === "english" ? items?.en ?? "" : items?.ru ?? ""
                    }
                    setOpen={setOpen}
                />
                <DrawerBar openDrawer={open} setOpenDrawer={setOpen}/>

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
                    <Toolbar/>
                    <Container maxWidth="lg" sx={{mt: 4, mb: 4, width: "100vw"}}>
                        <Paper sx={{p: 2, display: "flex", flexDirection: "column"}}>
                            {children}
                        </Paper>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default Layout;
