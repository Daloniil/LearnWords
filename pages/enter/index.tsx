import {
  Box,
  Button,
  capitalize,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Enter } from "../../Interfaces/EnterInterface";
import { lowerText } from "../../utils/lowerText";
import { useNotification } from "../../hooks/useNotification";
import {
  addStyle,
  modalContainerStyle,
  textFieldStyle,
  titleStyle,
} from "../../Styles/EnterStyle";
import {
  LanguageKeys,
  LoginStatus,
  NotificationKeys,
  WordsParams,
} from "../../services/localKey";
import { findLongestWord } from "../../utils/longWord";

import { useEffect, useState } from "react";
import { Translation } from "../../models/translation/translation";
import { TranslationService } from "../../services/translationService";
import { TranslationData } from "../../models/translation/translationResult";
import { useDebounce } from "../../hooks/useDebounce";
import { boxTranslationStyle, loadingStyle } from "../../Styles/TestStyle";
import { enterTranslation } from "../../translation/Enter";
import { useLanguage } from "../../hooks/useLanguage";
import { setTranslation } from "../../utils/setTranslation";
import { useLogin } from "../../hooks/useLogin";
import { useWords } from "../../hooks/useWords";

const EnterPage = () => {
  const { addNotification } = useNotification();
  const { languageContext } = useLanguage();
  const { checkingLogin } = useLogin();
  const { addWord, speakWord } = useWords();

  const [translateEnglish, setTranslateEnglish] = useState("");
  const debouncedSearchValue = useDebounce(translateEnglish, 200);
  const [loading, setLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState([] as TranslationData[]);
  const [statusLoading, setStatusLoadingUser] = useState(false);

  const schema = yup.object().shape({
    englishWord: yup.string().required("This Field Cannot Be Empty"),
    russianWord: yup.string().required("This Field Cannot Be Empty"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    setValue,
  } = useForm<Enter>({ resolver: yupResolver(schema) });

  const closeModalAdd = () => {
    reset({
      englishWord: "",
      russianWord: "",
    });
  };

  const setLongError = (data: Enter) => {
    let status = true;

    Object.keys(data).forEach((word) => {
      const current = word as keyof typeof data;
      if (findLongestWord(data[current]).length > WordsParams.MAXLENGHT) {
        const errorKey =
          word === LanguageKeys.ENGLISH
            ? LanguageKeys.ENGLISH
            : LanguageKeys.RUSSIAN;
        setError(errorKey, {
          type: "manual",
          message: `${data[errorKey]} Too Big A Word`,
        });
        status = false;
      }
    });
    return status;
  };

  const addWords = async (data: Enter) => {
    setStatusLoadingUser(true);
    await addWord(data);
    setTranslateEnglish("");
    closeModalAdd();
    setStatusLoadingUser(false);
  };

  const handleTranslate = async (data: Translation[]) => {
    const request = await TranslationService.translate(data).catch((e) => {
      addNotification(e.message, NotificationKeys.ERROR), setLoading(false);
    });
    const result = request?.data as TranslationData[] | undefined;
    setLoading(false);
    if (result) {
      setTranslatedText(result);
    }
  };

  const translation = (key: string) => {
    return setTranslation(key, enterTranslation, languageContext);
  };

  useEffect(() => {
    handleTranslate([{ Text: debouncedSearchValue }]);
  }, [debouncedSearchValue]);

  useEffect(() => {
    checkingLogin(LoginStatus.OTHER);
  }, []);

  return (
    <>
      <Box sx={titleStyle}>{translation("enterWord")}</Box>
      <form
        onSubmit={handleSubmit((data) => {
          if (setLongError(data)) {
            data = lowerText(data);
            addWords(data);
          }
        })}
        style={{ margin: "0 auto" }}
      >
        <Box sx={modalContainerStyle}>
          <Box sx={{ display: "flex", margin: "0 0 0 -35px" }}>
            <Typography
              onClick={() => speakWord(translateEnglish)}
              sx={{ margin: "15px 0 0 0", transform: "translate(-10px, 0)" }}
            >
              <VolumeUpIcon fontSize="large" color="primary" />
            </Typography>
            <TextField
              error={!!errors.englishWord}
              sx={textFieldStyle}
              label={translation("english")}
              {...register("englishWord", { required: true })}
              InputLabelProps={{
                shrink: true,
              }}
              helperText={errors.englishWord?.message}
              onChange={(e) => {
                setLoading(true);
                setTranslateEnglish(e.target.value);
              }}
            />
          </Box>

          <Box>
            <TextField
              error={!!errors.russianWord}
              sx={textFieldStyle}
              label={translation("russian")}
              {...register("russianWord", { required: true })}
              InputLabelProps={{
                shrink: true,
              }}
              helperText={errors.russianWord?.message}
            />
            <Box sx={{ display: "flex" }}>
              {statusLoading ? (
                <Box
                  sx={{
                    transform: "translate(-50px, 20px)",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                ""
              )}
              <Box
                style={{
                  margin: statusLoading
                    ? "-5px 0 5px -25px"
                    : "-5px 0 5px 15px",
                  display: translateEnglish ? "" : "none",
                }}
              >
                <Typography sx={{ textAlign: "center" }}>
                  {translation("translation")}
                </Typography>

                {loading ? (
                  <Box sx={loadingStyle}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box
                    sx={boxTranslationStyle}
                    onClick={() =>
                      setValue(
                        "russianWord",
                        translatedText[0].translations[0].text
                      )
                    }
                  >
                    <Typography
                      sx={{
                        margin: "5px",
                      }}
                    >
                      {translatedText[0]
                        ? capitalize(translatedText[0].translations[0].text)
                        : ""}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        <Button variant="outlined" size="medium" type="submit" sx={addStyle}>
          {translation("addButton")}
        </Button>
      </form>
    </>
  );
};

export default EnterPage;
