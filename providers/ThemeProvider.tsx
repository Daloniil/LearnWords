import React, { useState, useCallback } from "react";
import { ThemeContextType } from "../Interfaces/ProvidersInterface";
import { ContextKey } from "../services/localKey";
import { LocalStorageService } from "../services/localStorageService";

export const ThemeContext = React.createContext<ThemeContextType>({
  themeContext: "light",
  setThemeContext: () => {},
});

const appGetTheme = (key: string): string => {
  return LocalStorageService.getItem<string>(key) ?? "";
};

export const ThemeProviderContext: React.FC = ({ children }) => {
  const [themeContext, setThemeContext] = useState(
    appGetTheme(ContextKey.THEME)
  );

  const handleSetLanguage = (theme: string) => {
    LocalStorageService.setTheme(theme, ContextKey.THEME);
    setThemeContext(appGetTheme(ContextKey.THEME));
  };

  const value = {
    themeContext,
    setThemeContext: useCallback(
      (theme: string) => handleSetLanguage(theme),
      []
    ),
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
