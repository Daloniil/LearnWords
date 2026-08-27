import {
  Avatar,
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import InstallMobileOutlinedIcon from "@mui/icons-material/InstallMobileOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../hooks/useLanguage";
import { useLearningPair } from "../../hooks/useLearningPair";
import { useLogin } from "../../hooks/useLogin";
import { usePwaInstall } from "../../hooks/usePwaInstall";
import { useTheme } from "../../hooks/useTheme";
import { settingsTranslation } from "../../translation/Settings";
import { setTranslation } from "../../utils/setTranslation";
import { LearningPair } from "../../utils/learningPair";
import { PageHeader } from "../../components/PageHeader";
import { pageStack, surfaceCard } from "../../Styles/shared";

const SettingRow = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <Stack spacing={1}>
    <Stack direction="row" spacing={1} alignItems="center">
      {icon}
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
    </Stack>
    {children}
  </Stack>
);

const SettingsPage = () => {
  const { languageContext, setLanguageContext } = useLanguage();
  const { learningPair, setLearningPair } = useLearningPair();
  const { themeContext, setThemeContext } = useTheme();
  const { signOutGoogle } = useLogin();
  const { authContext } = useAuth();
  const { canInstall, isInstalled, isIos, install } = usePwaInstall();

  const [language, setLanguage] = useState(languageContext);
  const [pair, setPair] = useState(learningPair);
  const [theme, setTheme] = useState(themeContext);
  const [user, setUser] = useState("");

  const translation = (key: string) =>
    setTranslation(key, settingsTranslation, languageContext);

  useEffect(() => {
    if (!authContext.user.uid) {
      setUser("");
      Router.push("/login");
    } else {
      setUser(authContext.user.displayName || "");
    }
  }, [authContext.user.uid]);

  const selectSx = { width: "100%", borderRadius: 2 };

  return (
    <Box sx={pageStack}>
      <PageHeader title={translation("changeLanguage").replace(":", "")} />

      <Box sx={surfaceCard}>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
            {user.charAt(0).toUpperCase() || "U"}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography fontWeight={700} noWrap>
              {user}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {languageContext === "english" ? "Account" : "Аккаунт"}
            </Typography>
          </Box>
          <Button
            color="error"
            variant="outlined"
            size="small"
            startIcon={<LogoutOutlinedIcon />}
            onClick={signOutGoogle}
          >
            Log out
          </Button>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={2.5}>
          <SettingRow
            icon={<LanguageOutlinedIcon fontSize="small" color="primary" />}
            label={translation("changeLanguage").replace(":", "")}
          >
            <Select value={language} onChange={(e: SelectChangeEvent) => {
              setLanguage(e.target.value);
              setLanguageContext(e.target.value);
            }} sx={selectSx}>
              <MenuItem value="russian">{translation("russian")}</MenuItem>
              <MenuItem value="english">{translation("english")}</MenuItem>
            </Select>
          </SettingRow>

          <SettingRow
            icon={<SchoolOutlinedIcon fontSize="small" color="primary" />}
            label={translation("changeLearningPair").replace(":", "")}
          >
            <Select value={pair} onChange={(e: SelectChangeEvent) => {
              const value = e.target.value as LearningPair;
              setPair(value);
              setLearningPair(value);
            }} sx={selectSx}>
              <MenuItem value="en-ru">{translation("pairEnRu")}</MenuItem>
              <MenuItem value="es-ru">{translation("pairEsRu")}</MenuItem>
            </Select>
          </SettingRow>

          <SettingRow
            icon={<PaletteOutlinedIcon fontSize="small" color="primary" />}
            label={translation("changeTheme").replace(":", "")}
          >
            <Select value={theme || "light"} onChange={(e: SelectChangeEvent) => {
              setTheme(e.target.value);
              setThemeContext(e.target.value);
            }} sx={selectSx}>
              <MenuItem value="light">{translation("light")}</MenuItem>
              <MenuItem value="dark">{translation("dark")}</MenuItem>
            </Select>
          </SettingRow>
        </Stack>
      </Box>

      <Box sx={surfaceCard}>
        <SettingRow
          icon={<InstallMobileOutlinedIcon fontSize="small" color="primary" />}
          label={translation("installApp")}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {translation("installAppDescription")}
          </Typography>

          {isInstalled ? (
            <Button
              variant="outlined"
              fullWidth
              disabled
              startIcon={<CheckCircleOutlineIcon />}
            >
              {translation("installAppInstalled")}
            </Button>
          ) : canInstall ? (
            <Button
              variant="contained"
              fullWidth
              startIcon={<InstallMobileOutlinedIcon />}
              onClick={() => install()}
            >
              {translation("installAppAction")}
            </Button>
          ) : isIos ? (
            <Typography variant="body2" color="text.secondary">
              {translation("installAppIosHint")}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {translation("installAppUnavailable")}
            </Typography>
          )}
        </SettingRow>
      </Box>
    </Box>
  );
};

export default SettingsPage;
