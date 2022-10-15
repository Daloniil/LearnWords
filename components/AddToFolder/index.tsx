import { Box, Button, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useFolders } from "../../hooks/useFolders";
import { useLanguage } from "../../hooks/useLanguage";
import { useTheme } from "../../hooks/useTheme";
import { Word } from "../../Interfaces/ProvidersInterface";
import { modalStyle } from "../../Styles/DictionaryStyle";
import { titleStyle } from "../../Styles/EditWordStyle";
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

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            margin: "-20px 0 0 0",
          }}
        >
          <Box sx={{ margin: "30px 0 0 0" }}>
            {foldersHook.map((item) => (
              <Typography
                onClick={() => {
                  handleCloseModal(), addWords(moveWord, item.id);
                }}
                sx={{
                  margin: "2.5px 0 2.5px 5px",
                  fontSize: "16px",
                  padding: "2px",
                  border: "solid 1px",
                  textAlign: "center",
                }}
              >
                {item.name}
              </Typography>
            ))}
          </Box>

          <Button onClick={() => handleCloseModalAdd()}>
            {translation("add")}
          </Button>
        </Box>
      </Box>
    </>
  );
};
