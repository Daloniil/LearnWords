import { useContext } from "react";

import { ThemeContext } from "../providers/ThemeProvider";

export const useTheme = () => {
  const { themeContext, setThemeContext } = useContext(ThemeContext);

  return {
    themeContext,
    setThemeContext,
  };
};
