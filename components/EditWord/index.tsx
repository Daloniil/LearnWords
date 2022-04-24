import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, capitalize, TextField, Typography } from "@mui/material";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useNotification } from "../../hooks/useNotification";
import { useSearch } from "../../hooks/useSearch";
import { useWords } from "../../hooks/useWords";
import {
  ContextKey,
  LanguageKeys,
  NotificationKeys,
  WordsParams,
} from "../../services/localKey";
import {
  buttonStyle,
  modalContainerStyle,
  textFieldStyle,
  titleStyle,
} from "../../Styles/EditWordStyle";
import { WordEditProps } from "../../Interfaces/EditWordInterface";
import { Enter } from "../../Interfaces/EnterInterface";
import { lowerText } from "../../utils/lowerText";
import { findLongestWord } from "../../utils/longWord";
import { editWordTranslation } from "../../translation/EditWord";
import { useLanguage } from "../../hooks/useLanguage";
import { setTranslation } from "../../utils/setTranslation";

const emptyField = "This Field Cannot Be Empty";

const schema = yup.object().shape({
  englishWord: yup.string().required(emptyField),
  russianWord: yup.string().required(emptyField),
});

export const EditWord = ({
  editId,
  wordEdit,
  handleCloseModal,
}: WordEditProps) => {
  const { findWords } = useSearch();
  const { addNotification } = useNotification();
  const { deleteWord, updateWord } = useWords();
  const { languageContext } = useLanguage();

  const [statusDelete, setStatusDelete] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<Enter>({
    defaultValues: {
      englishWord: capitalize(wordEdit.word),
      russianWord: capitalize(wordEdit.correctTranslation),
    },
    resolver: yupResolver(schema),
  });

  const updateModal = () => {
    reset({
      englishWord: "",
      russianWord: "",
    });
    addNotification("wordEdit", NotificationKeys.SUCCESS);

    handleCloseModal();
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

  const update = (data: Enter, key: string, id: number) => {
    const newWord = {
      id: id,
      word: key === ContextKey.ENGLISH ? data.englishWord : data.russianWord,
      correctTranslation:
        key === ContextKey.ENGLISH ? data.russianWord : data.englishWord,
      point: 0,
    };

    updateWord(newWord, key);
  };

  const editWord = (data: Enter) => {
    const keys = [ContextKey.ENGLISH, ContextKey.RUSSIAN];
    const repeatingWord = [] as string[];
    keys.forEach((lang) => {
      if (findWords(data, lang)) {
        repeatingWord.push(lang);
      }
    });

    if (repeatingWord.length > 1) {
      addNotification("hasAlready", NotificationKeys.ERROR);
      return;
    }

    update(data, ContextKey.ENGLISH, editId);
    update(data, ContextKey.RUSSIAN, editId);

    updateModal();
  };

  const handleDeleteWord = (id: number) => {
    deleteWord(id, ContextKey.ENGLISH);
    deleteWord(id, ContextKey.RUSSIAN);
    setStatusDelete(true);
    addNotification("wordDelete", NotificationKeys.SUCCESS);
    handleCloseModal();
  };

  const translation = (key: string) => {
    return setTranslation(key, editWordTranslation, languageContext);
  };

  useEffect(() => {
    setStatusDelete(false);
  }, [statusDelete]);

  return (
    <>
      <Typography sx={titleStyle}> {translation("editWord")}</Typography>
      <form
        onSubmit={handleSubmit((data) => {
          if (setLongError(data)) {
            data = lowerText(data);
            editWord(data);
          }
        })}
      >
        <Box sx={modalContainerStyle}>
          <TextField
            error={!!errors.englishWord}
            label={translation("english")}
            sx={textFieldStyle}
            {...register("englishWord", { required: true })}
            InputLabelProps={{
              shrink: true,
            }}
            helperText={errors.englishWord?.message}
          />

          <TextField
            error={!!errors.russianWord}
            label={translation("russian")}
            sx={textFieldStyle}
            {...register("russianWord", { required: true })}
            InputLabelProps={{
              shrink: true,
            }}
            helperText={errors.russianWord?.message}
          />
        </Box>

        <Box>
          <Button
            variant="outlined"
            size="medium"
            sx={buttonStyle}
            type="submit"
          >
            {translation("editButton")}
          </Button>
          <Button
            variant="outlined"
            size="medium"
            color="error"
            sx={buttonStyle}
            onClick={() => {
              handleDeleteWord(editId);
            }}
          >
            {translation("deleteButton")}
          </Button>
        </Box>
      </form>
    </>
  );
};
