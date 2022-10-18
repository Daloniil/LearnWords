import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useFolders } from "../../hooks/useFolders";
import { useLanguage } from "../../hooks/useLanguage";
import { useTheme } from "../../hooks/useTheme";
import { Word } from "../../Interfaces/ProvidersInterface";
import { modalStyle } from "../../Styles/DictionaryStyle";
import { titleStyle } from "../../Styles/EditWordStyle";
import { boxSelect } from "../../Styles/FoldersStyle";
import { folderTranslation } from "../../translation/Folder";
import { setTranslation } from "../../utils/setTranslation";
import { AddFolder } from "../AddFolder";

export const AddToFolder = ({
  handleCloseModal,
  moveWord,
}: {
  handleCloseModal: () => void;
  moveWord: Word[];
}) => {
  const { getFolders, foldersHook, addWords } = useFolders();
  const { themeContext } = useTheme();
  const { languageContext } = useLanguage();

  const [openModal, setOpenModal] = useState(false);

  const [title, setTitle] = useState("-1");

  const handleChange = (event: SelectChangeEvent) => {
    setTitle(event.target.value as string);
  };

  const handleCloseModalAdd = () => {
    setOpenModal(!openModal);
    getFolders();
  };

  const translation = (key: string) => {
    return setTranslation(key, folderTranslation, languageContext);
  };

  useEffect(() => {
    getFolders();
  }, []);

  return (
    <>
      <Modal
        open={openModal}
        onClose={handleCloseModalAdd}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box
          sx={modalStyle}
          style={{
            backgroundColor: themeContext === "dark" ? "#232323" : "white",
          }}
        >
          <AddFolder handleCloseModal={handleCloseModalAdd} />
        </Box>
      </Modal>
      <Box sx={{ width: "200px" }}>
        <Typography sx={titleStyle}>{translation("selectFolder")}</Typography>

        <Box sx={boxSelect}>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                {translation("Folders")}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={title}
                label="Age"
                onChange={handleChange}
              >
                <MenuItem value={-1}>{translation("none")}</MenuItem>
                {foldersHook.map((item) => (
                  <MenuItem
                    onClick={() => {
                      handleCloseModal(), addWords(moveWord, item.id);
                    }}
                    value={item.id}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Button onClick={() => handleCloseModalAdd()}>
            {translation("add")}
          </Button>
        </Box>
      </Box>
    </>
  );
};
