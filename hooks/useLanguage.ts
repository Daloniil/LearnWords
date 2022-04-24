import { useContext } from "react";
import { LanguageContext } from "../providers/LanguageProvider";

export const useLanguage = () => {
  const { languageContext, setLanguageContext } = useContext(LanguageContext);

  return {
    languageContext,
    setLanguageContext,
  };
};
