import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  capitalize,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { WordEditProps } from "../../Interfaces/EditWordInterface";
import { Enter } from "../../Interfaces/EnterInterface";
import { lowerText } from "../../utils/lowerText";
import { editWordTranslation } from "../../translation/EditWord";
import { useLanguage } from "../../hooks/useLanguage";
import { useLearningPair } from "../../hooks/useLearningPair";
import { setTranslation } from "../../utils/setTranslation";
import { useWords } from "../../hooks/useWords";
import { useFolders } from "../../hooks/useFolders";
import { fullWidthButton } from "../../Styles/shared";

const emptyField = "This Field Cannot Be Empty";

const schema = yup.object().shape({
  sourceWord: yup.string().required(emptyField),
  targetWord: yup.string().required(emptyField),
});

export const EditWord = ({
  folderId,
  editId,
  wordEdit,
  handleCloseModal,
  setStatusLoadingUser,
}: WordEditProps) => {
  const { languageContext } = useLanguage();
  const { pairConfig } = useLearningPair();
  const { updateWord, deleteWord } = useWords();
  const { updateWords, deleteWords } = useFolders();

  const [statusDelete, setStatusDelete] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Enter>({
    defaultValues: {
      sourceWord: capitalize(wordEdit.word),
      targetWord: capitalize(wordEdit.correctTranslation),
    },
    resolver: yupResolver(schema),
  });

  const updateModal = () => {
    reset({ sourceWord: "", targetWord: "" });
    handleCloseModal();
  };

  const update = async (data: Enter, id: number) => {
    setStatusLoadingUser(true);
    if (folderId) {
      await updateWords(folderId, id, data);
    } else {
      await updateWord(id, data);
    }
    updateModal();
  };

  const handleDeleteWord = async (id: number) => {
    if (folderId) {
      await deleteWords(folderId, id);
    } else {
      await deleteWord(id);
    }
    setStatusDelete(true);
    handleCloseModal();
    setStatusLoadingUser(true);
  };

  const translation = (key: string) =>
    setTranslation(key, editWordTranslation, languageContext);

  useEffect(() => {
    setStatusDelete(false);
  }, [statusDelete]);

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        {translation("editWord")}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit((data) => update(lowerText(data), editId))}
      >
        <Stack spacing={2}>
          <TextField
            fullWidth
            error={!!errors.sourceWord}
            label={translation(pairConfig.sourceLabelKey)}
            {...register("sourceWord", { required: true })}
            helperText={errors.sourceWord?.message}
          />
          <TextField
            fullWidth
            error={!!errors.targetWord}
            label={translation(pairConfig.targetLabelKey)}
            {...register("targetWord", { required: true })}
            helperText={errors.targetWord?.message}
          />

          <Button variant="contained" type="submit" sx={fullWidthButton}>
            {translation("editButton")}
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={fullWidthButton}
            onClick={() => handleDeleteWord(editId)}
          >
            {translation("deleteButton")}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};
