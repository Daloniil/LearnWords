import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import { useEffect } from "react";
import { useLogin } from "../../hooks/useLogin";
import { LoginStatus } from "../../services/localKey";
import { useLanguage } from "../../hooks/useLanguage";
import { fullWidthButton, surfaceCard } from "../../Styles/shared";

const loginText = {
  title: { en: "LearnWords", ru: "LearnWords" },
  subtitle: {
    en: "Build your vocabulary and practice with smart tests",
    ru: "Собирай словарь и тренируйся в умных тестах",
  },
  signIn: { en: "Sign in with Google", ru: "Войти через Google" },
};

const LoginPage = () => {
  const { signIn, checkingLogin } = useLogin();
  const { languageContext } = useLanguage();
  const lang = languageContext === "english" ? "en" : "ru";

  useEffect(() => {
    checkingLogin(LoginStatus.LOGIN);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "calc(100dvh - 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 1,
      }}
    >
      <Box sx={{ ...surfaceCard, width: "100%", maxWidth: 400, p: 3 }}>
        <Stack spacing={3} alignItems="center">
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 2,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TranslateOutlinedIcon sx={{ fontSize: 36 }} />
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              {loginText.title[lang]}
            </Typography>
            <Typography color="text.secondary">{loginText.subtitle[lang]}</Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={signIn}
            sx={fullWidthButton}
          >
            {loginText.signIn[lang]}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default LoginPage;
