import type { AppProps } from "next/app";

import { NotificationProvider } from "../providers/NotificationProvider";
import { Notification } from "../components/Notification";
import { WordsProvider } from "../providers/WordsProvider";

import Layout from "../layouts";
import { TestProvider } from "../providers/TestProvider";
import { LanguageProvider } from "../providers/LanguageProvider";
import { StatsProvider } from "../providers/StatsProvider";
import React from "react";
import { ThemeProviderContext } from "../providers/ThemeProvider";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProviderContext>
      <LanguageProvider>
        <NotificationProvider>
          <WordsProvider>
            <TestProvider>
              <StatsProvider>
                <Layout>
                  <Component {...pageProps} />
                  <Notification />
                </Layout>
              </StatsProvider>
            </TestProvider>
          </WordsProvider>
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProviderContext>
  );
};

export default MyApp;
