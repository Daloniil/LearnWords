import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useFolders } from "../../hooks/useFolders";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { folderTranslation } from "../../translation/Folder";
import { useLanguage } from "../../hooks/useLanguage";
import { setTranslation } from "../../utils/setTranslation";
import { fullWidthButton } from "../../Styles/shared";

const emptyField = "This Field Cannot Be Empty";

const schema = yup.object().shape({
  nameFolder: yup.string().required(emptyField),
});

export const AddFolder = ({
  handleCloseModal,
}: {
  handleCloseModal: () => void;
}) => {
  const { createFolder } = useFolders();
  const { languageContext } = useLanguage();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ nameFolder: string }>({
    defaultValues: { nameFolder: "" },
    resolver: yupResolver(schema),
  });

  const translation = (key: string) =>
    setTranslation(key, folderTranslation, languageContext);

  const addFolder = (nameFolder: string) => {
    createFolder(nameFolder);
    reset({ nameFolder: "" });
    handleCloseModal();
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        {translation("addFolder")}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit((data) => addFolder(data.nameFolder))}
      >
        <Stack spacing={2}>
          <TextField
            fullWidth
            autoFocus
            error={!!errors.nameFolder}
            label={languageContext === "english" ? "Folder name" : "Название папки"}
            {...register("nameFolder", { required: true })}
            helperText={errors.nameFolder?.message}
          />
          <Button variant="contained" type="submit" sx={fullWidthButton}>
            {translation("add")}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};
