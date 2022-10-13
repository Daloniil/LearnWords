import { Box, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AddFolders } from "../../components/AddFolders";
import { useFolders } from "../../hooks/useFolders";
import { useTheme } from "../../hooks/useTheme";
import { modalStyle } from "../../Styles/DictionaryStyle";

const FoldersPage = () => {
  const { getFolders, deleteFolder, foldersHook } = useFolders();
  const { themeContext } = useTheme();

  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(!openModal);
    getFolders();
  };

  console.log(foldersHook);

  useEffect(() => {
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
          <Box sx={{ display: "flex" }}>
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
