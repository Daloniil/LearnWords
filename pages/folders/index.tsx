import { Box, Modal, Typography } from "@mui/material";
import Router from "next/router";
import { useEffect, useState } from "react";
import { AddFolders } from "../../components/AddFolders";
import { useFolders } from "../../hooks/useFolders";
import { useLogin } from "../../hooks/useLogin";
import { useTheme } from "../../hooks/useTheme";
import { LoginStatus } from "../../services/localKey";
import { modalStyle } from "../../Styles/DictionaryStyle";

const FoldersPage = () => {
  const { getFolders, deleteFolder, foldersHook } = useFolders();
  const { checkingLogin } = useLogin();
  const { themeContext } = useTheme();

  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(!openModal);
    getFolders();
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
          <AddFolders handleCloseModal={handleCloseModal} />
        </Box>
      </Modal>
      Folders
      <div onClick={() => handleCloseModal()}>Add</div>
      <Box>
        {foldersHook.map((item, index) => (
          <Box
            sx={{ display: "flex" }}
            onClick={() => Router.push(`/folders/${item.id}`)}
          >
            <Typography>{item.name}</Typography>
            <Typography onClick={() => deleteFolder(item.id)}>
              Delete
            </Typography>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default FoldersPage;
