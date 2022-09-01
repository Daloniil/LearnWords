import {
  Box,
  Button,
  capitalize,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Enter } from "../../Interfaces/EnterInterface";
import { lowerText } from "../../utils/lowerText";
import { useSearch } from "../../hooks/useSearch";
import { useNotification } from "../../hooks/useNotification";
import {
  addStyle,
  modalContainerStyle,
  textFieldStyle,
  titleStyle,
} from "../../Styles/EnterStyle";
import {
  ContextKey,
  LanguageKeys,
  LoginStatus,
  NotificationKeys,
  WordsParams,
} from "../../services/localKey";
import { findLongestWord } from "../../utils/longWord";

import { useCallback, useEffect, useState } from "react";
import { Translation } from "../../models/translation/translation";
import { TranslationService } from "../../services/translationService";
import { TranslationData } from "../../models/translation/translationResult";
import { useDebounce } from "../../hooks/useDebounce";
import { useEnter } from "../../hooks/useEnter";
import { boxTranslationStyle, loadingStyle } from "../../Styles/TestStyle";
import { enterTranslation } from "../../translation/Enter";
import { useLanguage } from "../../hooks/useLanguage";
import { setTranslation } from "../../utils/setTranslation";
import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { firebaseConfig } from "../../firebase-config";
import { useLogin } from "../../hooks/useLogin";

const EnterPage = () => {
  const { addNotification } = useNotification();
  const { findWords } = useSearch();
  const { words, addWord, addUpdateWord } = useEnter();
  const { languageContext } = useLanguage();
  const { checkingLogin } = useLogin();

  const auth = getAuth(firebaseConfig);

  const [translateEnglish, setTranslateEnglish] = useState("");
  const debouncedSearchValue = useDebounce(translateEnglish, 200);

  const [loading, setLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState([] as TranslationData[]);

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
    addNotification("wordAdd", NotificationKeys.SUCCESS);
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

  const addWords = (data: Enter) => {
    if (words.length > 0) {
      const keys = [ContextKey.ENGLISH, ContextKey.RUSSIAN];
      const repeatingWord = [] as string[];
      keys.forEach((lang) => {
        if (findWords(data, lang)) {
          repeatingWord.push(lang);
        }
      });
      if (repeatingWord.length !== 0) {
        if (repeatingWord.length > 1) {
          addNotification("hasAlready", NotificationKeys.ERROR);
          return;
        }
        addUpdateWord(data, repeatingWord[0]);
        closeModalAdd();
        return;
      }
    }

    setTranslateEnglish("");
    addWord(data, ContextKey.ENGLISH);
    addWord(data, ContextKey.RUSSIAN);
    closeModalAdd();
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

  const getWordForUser = () => {
    if (auth.currentUser) {
      const db = getFirestore();
      const colRef = collection(db, "words");
      console.log(auth.currentUser?.uid);
      getDocs(colRef).then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.useruid === auth.currentUser?.uid) {
            console.log(data);
          }
        });
      });
    }
  };

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
            <Box
              style={{
                margin: "-5px 0 5px 5px",
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

        <Button variant="outlined" size="medium" type="submit" sx={addStyle}>
          {translation("addButton")}
        </Button>
      </form>
      <Button onClick={getWordForUser}>Get Words</Button>
      {/* <Button onClick={signOutWithGoogle}>Log Out</Button> */}
    </>
  );
};

export default EnterPage;
