import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useFolders } from "../../hooks/useFolders";
import {
  buttonStyle,
  textFieldStyle,
  titleStyle,
} from "../../Styles/EditWordStyle";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { folderTranslation } from "../../translation/Folder";
import { useLanguage } from "../../hooks/useLanguage";
import { setTranslation } from "../../utils/setTranslation";

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
    defaultValues: {
      nameFolder: "",
    },
    resolver: yupResolver(schema),
  });

  const updateModal = () => {
    setTimeout(() => {
      reset({
        nameFolder: "",
      });
      handleCloseModal();
    }, 500);
  };

  const translation = (key: string) => {
    return setTranslation(key, folderTranslation, languageContext);
  };

  const addFolder = (nameFolder: string) => {
    createFolder(nameFolder);
    updateModal();
  };

  return (
    <>
      <Typography sx={titleStyle}>{translation("addFolder")}</Typography>
      <form
        onSubmit={handleSubmit((data) => {
          addFolder(data.nameFolder);
        })}
      >
        <Box sx={{ margin: "10px 0 0 0" }}>
          <TextField
            error={!!errors.nameFolder}
            label={"Name Folder"}
            sx={textFieldStyle}
            {...register("nameFolder", { required: true })}
            InputLabelProps={{
              shrink: true,
            }}
            helperText={errors.nameFolder?.message}
          />
        </Box>
        <Button variant="outlined" size="medium" sx={buttonStyle} type="submit">
          {translation("add")}
        </Button>
      </form>
    </>
  );
};
