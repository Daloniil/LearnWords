import {
  Box,
  Button,
  capitalize,
  Chip,
  CircularProgress,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Enter } from "../../Interfaces/EnterInterface";
import { lowerText } from "../../utils/lowerText";
import { useNotification } from "../../hooks/useNotification";
import { LoginStatus, NotificationKeys } from "../../services/localKey";
import { useEffect, useState } from "react";
import { Translation } from "../../Interfaces/translation/translation";
import { TranslationService } from "../../services/translationService";
import { useDebounce } from "../../hooks/useDebounce";
import { enterTranslation } from "../../translation/Enter";
import { useLanguage } from "../../hooks/useLanguage";
import { useLearningPair } from "../../hooks/useLearningPair";
import { setTranslation } from "../../utils/setTranslation";
import { useLogin } from "../../hooks/useLogin";
import { useWords } from "../../hooks/useWords";
import { fullWidthButton, pageStack, surfaceCard } from "../../Styles/shared";

const EnterPage = () => {
  const { addNotification } = useNotification();
  const { languageContext } = useLanguage();
  const { pairConfig } = useLearningPair();
  const { checkingLogin } = useLogin();
  const { addWord, speakWord, getWord, wordsHook } = useWords();

  const [translateSource, setTranslateSource] = useState("");
  const [translateTarget, setTranslateTarget] = useState("");
  const debouncedSearchValueSource = useDebounce(translateSource, 1000);
  const debouncedSearchValueTarget = useDebounce(translateTarget, 1000);
  const [loading, setLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [statusLoading, setStatusLoadingUser] = useState(false);
  const [inputLang, setInputLang] = useState<"source" | "target">("source");

  const schema = yup.object().shape({
    sourceWord: yup.string().required("This Field Cannot Be Empty"),
    targetWord: yup.string().required("This Field Cannot Be Empty"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<Enter>({ resolver: yupResolver(schema) });

  const sourceValue = watch("sourceWord");
  const targetValue = watch("targetWord");
  const isTyping = Boolean(translateSource || translateTarget);

  const closeModalAdd = () => {
    reset({ sourceWord: "", targetWord: "" });
    setTranslateSource("");
    setTranslateTarget("");
    setTranslatedText("");
  };

  const addWords = async (data: Enter) => {
    setStatusLoadingUser(true);
    await addWord(data);
    await getWord();
    closeModalAdd();
    setStatusLoadingUser(false);
  };

  const handleTranslate = async (data: Translation[], lang: "source" | "target") => {
    setInputLang(lang);
    setLoading(true);
    const request = await TranslationService.translateFromConfig(
      data,
      pairConfig,
      lang
    ).catch((e) => {
      addNotification(e.message, NotificationKeys.ERROR);
      setLoading(false);
    });

    setLoading(false);
    const result = request?.data.data.translatedText as string | undefined;
    if (result) setTranslatedText(result);
  };

  const translation = (key: string) =>
    setTranslation(key, enterTranslation, languageContext);

  const applyTranslation = () => {
    if (!translatedText) return;
    if (inputLang === "source") {
      setValue("targetWord", translatedText);
    } else {
      setValue("sourceWord", translatedText);
    }
  };

  const pasteFromClipboard = async () => {
    if (!navigator.clipboard?.readText) {
      addNotification("clipboardDenied", NotificationKeys.ERROR);
      return;
    }

    try {
      const text = (await navigator.clipboard.readText()).trim();
      if (!text) {
        addNotification("clipboardEmpty", NotificationKeys.ERROR);
        return;
      }

      setValue("sourceWord", text, { shouldValidate: true, shouldDirty: true });
      setLoading(true);
      setTranslateSource(text);
    } catch {
      addNotification("clipboardDenied", NotificationKeys.ERROR);
    }
  };

  useEffect(() => {
    if (debouncedSearchValueSource) {
      handleTranslate([{ Text: debouncedSearchValueSource }], "source");
    }
  }, [debouncedSearchValueSource]);

  useEffect(() => {
    if (debouncedSearchValueTarget) {
      handleTranslate([{ Text: debouncedSearchValueTarget }], "target");
    }
  }, [debouncedSearchValueTarget]);

  useEffect(() => {
    checkingLogin(LoginStatus.OTHER);
    getWord();
  }, []);

  return (
    <Box sx={pageStack}>
      <Box
        sx={{
          ...surfaceCard,
          background: (theme) =>
            theme.palette.mode === "light"
              ? "linear-gradient(135deg, #E3F2FD 0%, #FFFFFF 60%)"
              : "linear-gradient(135deg, #0D47A1 0%, #1E1E1E 70%)",
          border: "1px solid",
          borderColor: "primary.light",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AddCircleOutlineIcon />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              {translation("enterWord")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              {translation("enterSubtitle")}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Chip
                size="small"
                label={translation(pairConfig.sourceLabelKey)}
                color="primary"
                variant="filled"
              />
              <ArrowDownwardIcon sx={{ fontSize: 16, color: "text.secondary", transform: "rotate(-90deg)" }} />
              <Chip
                size="small"
                label={translation(pairConfig.targetLabelKey)}
                variant="outlined"
              />
            </Stack>
          </Box>
        </Stack>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit((data) => addWords(lowerText(data)))}
      >
        <Stack spacing={2}>
          <Box sx={surfaceCard}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
              <Typography
                variant="caption"
                color="primary"
                sx={{ fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}
              >
                1 · {translation("stepSource")}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                startIcon={<ContentPasteIcon />}
                onClick={pasteFromClipboard}
                sx={{ flexShrink: 0 }}
              >
                {translation("pasteFromClipboard")}
              </Button>
            </Stack>
            <TextField
              fullWidth
              sx={{ mt: 1 }}
              error={!!errors.sourceWord}
              placeholder={
                languageContext === "english"
                  ? `e.g. ${pairConfig.sourceLang === "es" ? "hola" : "hello"}`
                  : `напр. ${pairConfig.sourceLang === "es" ? "hola" : "hello"}`
              }
              {...register("sourceWord", { required: true })}
              helperText={errors.sourceWord?.message}
              onChange={(e) => {
                setLoading(true);
                setTranslateSource(e.target.value);
              }}
              InputProps={{
                endAdornment: sourceValue ? (
                  <InputAdornment position="end">
                    <VolumeUpOutlinedIcon
                      color="primary"
                      sx={{ cursor: "pointer" }}
                      onClick={() => speakWord(sourceValue)}
                    />
                  </InputAdornment>
                ) : undefined,
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "center", py: 0.5 }}>
              <ArrowDownwardIcon color="disabled" />
            </Box>

            <Typography
              variant="caption"
              color="primary"
              sx={{ fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}
            >
              2 · {translation("stepTarget")}
            </Typography>
            <TextField
              fullWidth
              sx={{ mt: 1 }}
              error={!!errors.targetWord}
              placeholder={
                languageContext === "english" ? "e.g. привет" : "напр. привет"
              }
              {...register("targetWord", { required: true })}
              helperText={errors.targetWord?.message}
              onChange={(e) => {
                setLoading(true);
                setTranslateTarget(e.target.value);
              }}
            />

            {(sourceValue || targetValue) && (
              <>
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary">
                      {translation(pairConfig.sourceLabelKey)}
                    </Typography>
                    <Typography fontWeight={600} noWrap>
                      {sourceValue ? capitalize(sourceValue) : "—"}
                    </Typography>
                  </Box>
                  <ArrowDownwardIcon
                    sx={{ fontSize: 18, color: "text.disabled", transform: "rotate(-90deg)" }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0, textAlign: "right" }}>
                    <Typography variant="caption" color="text.secondary">
                      {translation(pairConfig.targetLabelKey)}
                    </Typography>
                    <Typography fontWeight={600} noWrap>
                      {targetValue ? capitalize(targetValue) : "—"}
                    </Typography>
                  </Box>
                </Stack>
              </>
            )}
          </Box>

          <Box sx={surfaceCard}>
            <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
              <AutoAwesomeOutlinedIcon color="primary" fontSize="small" />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {translation("translation")}
              </Typography>
            </Stack>

            {loading && isTyping ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress size={28} />
              </Box>
            ) : translatedText && isTyping ? (
              <Box
                onClick={applyTranslation}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px dashed",
                  borderColor: "primary.main",
                  bgcolor: (theme) =>
                    theme.palette.mode === "light" ? "#F3F8FF" : "rgba(21, 101, 192, 0.12)",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "transform 0.12s ease",
                  "&:active": { transform: "scale(0.99)" },
                }}
              >
                <Typography
                  lang={
                    inputLang === "source"
                      ? pairConfig.targetLang
                      : pairConfig.sourceLang
                  }
                  sx={{ fontWeight: 700, fontSize: "1.15rem" }}
                >
                  {capitalize(translatedText)}
                </Typography>
                <Typography variant="caption" color="primary" sx={{ mt: 0.5, display: "block" }}>
                  {translation("tapToApply")}
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  py: 2.5,
                  px: 2,
                  borderRadius: 2,
                  bgcolor: "action.hover",
                  textAlign: "center",
                }}
              >
                <AutoAwesomeOutlinedIcon sx={{ color: "text.disabled", mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {translation("suggestionEmpty")}
                </Typography>
              </Box>
            )}
          </Box>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="center"
            sx={{ color: "text.secondary" }}
          >
            <MenuBookOutlinedIcon fontSize="small" />
            <Typography variant="body2">
              <strong>{wordsHook.length}</strong> {translation("wordsInDictionary")}
            </Typography>
          </Stack>

          <Button
            variant="contained"
            size="large"
            type="submit"
            disabled={statusLoading || !sourceValue || !targetValue}
            startIcon={
              statusLoading ? undefined : <AddCircleOutlineIcon />
            }
            sx={{ ...fullWidthButton, py: 1.4, fontSize: "1rem" }}
          >
            {statusLoading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              translation("addButton")
            )}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default EnterPage;
