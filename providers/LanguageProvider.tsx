import React, { useState, useCallback } from "react";
import { LanguageContextType } from "../Interfaces/ProvidersInterface";
import { ContextKey } from "../services/localKey";

import { LocalStorageService } from "../services/localStorageService";

export const LanguageContext = React.createContext<LanguageContextType>({
  languageContext: "",
  setLanguageContext: () => {},
});

const appGetLanguage = (key: string): string => {
  return LocalStorageService.getItem<string>(key) ?? "";
};

export const LanguageProvider: React.FC = ({ children }) => {
  const [languageContext, setLanguageContext] = useState(
    appGetLanguage(ContextKey.LANGUAGE).length > 0
      ? appGetLanguage(ContextKey.LANGUAGE)
      : "english"
  );

  const handleSetLanguage = (language: string) => {
    LocalStorageService.setLanguage(language);
    setLanguageContext(appGetLanguage(ContextKey.LANGUAGE));
  };

  const value = {
    languageContext,
    setLanguageContext: useCallback(
      (language: string) => handleSetLanguage(language),
      []
    ),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
