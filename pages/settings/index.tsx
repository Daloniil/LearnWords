import {
  Box,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { useTheme } from "../../hooks/useTheme";
import { settingsTranslation } from "../../translation/Settings";
import { setTranslation } from "../../utils/setTranslation";

const SettingsPage = () => {
  const { languageContext, setLanguageContext } = useLanguage();
  const { themeContext, setThemeContext } = useTheme();

  const [language, setLanguage] = useState(languageContext);
  const [theme, setTheme] = useState(themeContext);

  const handleChangeLanguage = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
    setLanguageContext(event.target.value as string);
  };

  const handleChangeTheme = (event: SelectChangeEvent) => {
    setTheme(event.target.value as string);
    setThemeContext(event.target.value);
  };

  const translation = (key: string) => {
    return setTranslation(key, settingsTranslation, languageContext);
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Typography
          sx={{
            fontSize: "20px",
            textAlign: "center",
            fontWeight: "bold",
            margin: "10px 10px 5px 0",
          }}
        >
          {translation("changeLanguage")}
        </Typography>

        <Select
          labelId="demo-simple-select"
          id="demo-simple-select"
          value={language}
          label="language"
          onChange={handleChangeLanguage}
          defaultValue={language}
          sx={{ width: "125px", height: "50px" }}
        >
          <MenuItem value={"russian"}>{translation("russian")}</MenuItem>
          <MenuItem value={"english"}> {translation("english")}</MenuItem>
        </Select>
      </Box>
      <Box sx={{ display: "flex", margin: "10px 0 0 0" }}>
        <Typography
          sx={{
            fontSize: "20px",
            textAlign: "center",
            fontWeight: "bold",
            margin: "10px 10px 5px 0",
          }}
        >
          {translation("changeTheme")}
        </Typography>

        <Select
          labelId="demo-simple-select"
          id="demo-simple"
          value={theme}
          label="theme"
          onChange={handleChangeTheme}
          defaultValue={language}
          sx={{ width: "125px", height: "50px" }}
        >
          <MenuItem value={"dark"}>{translation("dark")}</MenuItem>
          <MenuItem value={"light"}> {translation("light")}</MenuItem>
        </Select>
      </Box>
    </>
  );
};

export default SettingsPage;
