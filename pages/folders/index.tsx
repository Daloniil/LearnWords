import { Box, Button, capitalize, Modal, Typography } from "@mui/material";
import Router from "next/router";
import { useEffect, useState } from "react";
import { AddFolder } from "../../components/AddFolder";
import { useFolders } from "../../hooks/useFolders";
import { useLogin } from "../../hooks/useLogin";
import { useTheme } from "../../hooks/useTheme";
import { LoginStatus } from "../../services/localKey";
import { modalStyle } from "../../Styles/DictionaryStyle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  deleteButtonStyle,
  elemStats,
  indentsBoxStyle,
  statsBoxStyle,
  titleTestStyle,
} from "../../Styles/StatsStyle";
import { titleFolders, topBarFolder } from "../../Styles/FoldersStyle";
import { useLanguage } from "../../hooks/useLanguage";
import { folderTranslation } from "../../translation/Folder";
import { setTranslation } from "../../utils/setTranslation";

const FoldersPage = () => {
  const { getFolders, deleteFolder, foldersHook } = useFolders();
  const { checkingLogin } = useLogin();
  const { themeContext } = useTheme();
  const { languageContext } = useLanguage();

  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(!openModal);
    getFolders();
  };

  const translation = (key: string) => {
    return setTranslation(key, folderTranslation, languageContext);
  };

  useEffect(() => {
    checkingLogin(LoginStatus.OTHER);
    getFolders();
  }, []);
  return (
    <>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box
          sx={modalStyle}
          style={{
            backgroundColor: themeContext === "dark" ? "#232323" : "white",
          }}
        >
          <AddFolder handleCloseModal={handleCloseModal} />
        </Box>
      </Modal>
      <Box sx={topBarFolder}>
        <Typography sx={titleFolders}>{translation("folders")}</Typography>
        <Button
          onClick={() => handleCloseModal()}
          sx={{ margin: "0 0 0 auto" }}
        >
          {translation("add")}
        </Button>
      </Box>

      <Box>
        {foldersHook.map((item, index) => (
          <Box key={item.id} sx={statsBoxStyle}>
            <Typography
              sx={deleteButtonStyle}
              onClick={() => deleteFolder(item.id)}
              color={"error"}
            >
              <DeleteForeverIcon />
            </Typography>
            <Box
              sx={indentsBoxStyle}
              onClick={() => Router.push(`/folders/${item.id}`)}
            >
              <Typography sx={titleTestStyle}>{item.name}</Typography>

              <Typography sx={elemStats} lang="ru">
                {item.englishWords[0]
                  ? `     1. ${capitalize(item.englishWords[0].word)}
                - 
                ${capitalize(item.englishWords[0].correctTranslation)}`
                  : ""}
              </Typography>

              {item.englishWords[1]
                ? `     2. ${capitalize(item.englishWords[1].word)}
                - 
                ${capitalize(item.englishWords[1].correctTranslation)}`
                : ""}
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default FoldersPage;
