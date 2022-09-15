import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, capitalize, TextField, Typography } from "@mui/material";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { LanguageKeys, WordsParams } from "../../services/localKey";
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
import { useWords } from "../../hooks/useWords";

const emptyField = "This Field Cannot Be Empty";

const schema = yup.object().shape({
  englishWord: yup.string().required(emptyField),
  russianWord: yup.string().required(emptyField),
});

export const EditWord = ({
  editId,
  wordEdit,
  handleCloseModal,
  setStatusLoadingUser,
}: WordEditProps) => {
  const { languageContext } = useLanguage();
  const { updateWord, deleteWord } = useWords();

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

  const update = async (data: Enter, id: number) => {
    setStatusLoadingUser(true);
    await updateWord(id, data);
    updateModal();
  };

  const editWord = (data: Enter) => {
    update(data, editId);
  };

  const handleDeleteWord = async (id: number) => {
    await deleteWord(id);
    setStatusDelete(true);
    handleCloseModal();
    setStatusLoadingUser(true);
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
