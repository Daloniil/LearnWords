import React from "react";
import type {AppProps} from "next/app";
import Layout from "../layouts";

import {NotificationProvider} from "../providers/NotificationProvider";
import {Notification} from "../components/Notification";
import {LanguageProvider} from "../providers/LanguageProvider";
import {ThemeProviderContext} from "../providers/ThemeProvider";
import {AuthProvider} from "../providers/AuthProvider";

const MyApp = ({Component, pageProps}: AppProps) => {
    return (
        <ThemeProviderContext>
            <LanguageProvider>
                <NotificationProvider>
                    <AuthProvider>
                        <Layout>
                            {
                                // @ts-ignore
                                <Component {...pageProps} />
                            }
                            <Notification/>
                        </Layout>
                    </AuthProvider>
                </NotificationProvider>
            </LanguageProvider>
        </ThemeProviderContext>
    );
};

export default MyApp;
