import React from "react";
import type { AppProps } from "next/app";
import Layout from "../layouts";

import { NotificationProvider } from "../providers/NotificationProvider";
import { Notification } from "../components/Notification";
import { WordsProvider } from "../providers/WordsProvider";
import { LanguageProvider } from "../providers/LanguageProvider";
import { ThemeProviderContext } from "../providers/ThemeProvider";
import { AuthProvider } from "../providers/AuthProvider";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProviderContext>
      <LanguageProvider>
        <NotificationProvider>
          <AuthProvider>
            <WordsProvider>
              <Layout>
                <Component {...pageProps} />
                <Notification />
              </Layout>
            </WordsProvider>
          </AuthProvider>
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProviderContext>
  );
};

export default MyApp;
