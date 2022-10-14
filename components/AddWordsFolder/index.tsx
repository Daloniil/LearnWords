import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { useFolders } from "../../hooks/useFolders";
import { Word } from "../../Interfaces/ProvidersInterface";
import { titleStyle } from "../../Styles/EditWordStyle";

export const AddWordsFolder = ({
  handleCloseModal,
  moveWord,
}: {
  handleCloseModal: () => void;
  moveWord: Word[];
}) => {
  const { getFolders, foldersHook, addWords } = useFolders();

  useEffect(() => {
    getFolders();
  }, []);

  return (
    <Box sx={{ width: "200px" }}>
      <Typography sx={titleStyle}>Select Folder</Typography>

      {foldersHook.map((item) => (
        <Typography
          onClick={() => {
            handleCloseModal(), addWords(moveWord, item.id);
          }}
          sx={{ margin: "2.5px 0 2.5px 5px" }}
        >
          {item.name}
        </Typography>
      ))}
    </Box>
  );
};
