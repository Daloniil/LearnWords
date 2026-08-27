import React from "react";
import type {AppProps} from "next/app";
import Layout from "../layouts";

import {NotificationProvider} from "../providers/NotificationProvider";
import {Notification} from "../components/Notification";
import {LanguageProvider} from "../providers/LanguageProvider";
import {LearningPairProvider} from "../providers/LearningPairProvider";
import {ThemeProviderContext} from "../providers/ThemeProvider";
import {AuthProvider} from "../providers/AuthProvider";
import {WordsProvider} from "../providers/WordsProvider";
import {FoldersProvider} from "../providers/FoldersProvider";

const MyApp = ({Component, pageProps}: AppProps) => {
    return (
        <ThemeProviderContext>
            <LanguageProvider>
                <LearningPairProvider>
                    <NotificationProvider>
                        <AuthProvider>
                            <WordsProvider>
                                <FoldersProvider>
                                    <Layout>
                                        {
                                            // @ts-ignore
                                            <Component {...pageProps} />
                                        }
                                        <Notification/>
                                    </Layout>
                                </FoldersProvider>
                            </WordsProvider>
                        </AuthProvider>
                    </NotificationProvider>
                </LearningPairProvider>
            </LanguageProvider>
        </ThemeProviderContext>
    );
};

export default MyApp;
