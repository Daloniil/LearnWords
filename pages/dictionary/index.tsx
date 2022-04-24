import {
  Box,
  capitalize,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { useWords } from "../../hooks/useWords";

import { useSearch } from "../../hooks/useSearch";
import { Word } from "../../Interfaces/ProvidersInterface";
import {
  modalStyle,
  rowStyle,
  rowStyleDark,
  searchStyle,
  titleWordsStyle,
  wordsStyle,
} from "../../Styles/DictionaryStyle";
import { EditWord } from "../../components/EditWord";
import { useLanguage } from "../../hooks/useLanguage";
import { dictionaryTranslation } from "../../translation/Dictionary";
import { setTranslation } from "../../utils/setTranslation";
import { useTheme } from "../../hooks/useTheme";

const DictionaryPage = () => {
  const { englishWords } = useWords();
  const { search } = useSearch();
  const { languageContext } = useLanguage();
  const { themeContext } = useTheme();

  const [words, setWords] = useState(englishWords);
  const [statusDelete, setStatusDelete] = useState(false);
  const [editWord, setEditWord] = useState({} as Word);
  const [searchWord, setSearchWord] = useState("");
  const [editId, setEditId] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(!openModal);
  };

  const textFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value.toLowerCase());
  };

  const searchingWord = () => {
    const wordsArray = search(englishWords, searchWord);
    setWords(wordsArray);
  };

  const setWordModal = (word: Word) => {
    handleCloseModal();
    setEditWord(word);
    setEditId(word.id);
  };

  const translation = (key: string) => {
    return setTranslation(key, dictionaryTranslation, languageContext);
  };

  useEffect(() => {
    setStatusDelete(false);
  }, [statusDelete]);

  useEffect(() => {
    if (searchWord) {
      searchingWord();
    } else {
      setWords(englishWords);
    }
  }, [englishWords, searchWord]);

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
          <EditWord
            editId={editId}
            wordEdit={editWord}
            handleCloseModal={handleCloseModal}
          />
        </Box>
      </Modal>

      <TextField
        hiddenLabel
        id="filled-hidden-label-small"
        variant="filled"
        size="small"
        placeholder={translation("searchWord")}
        sx={searchStyle}
        onChange={textFieldChange}
        InputProps={{
          endAdornment: <SearchIcon />,
        }}
      />

      <Paper sx={{ overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 625 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography sx={titleWordsStyle}>
                    {translation("english")}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={titleWordsStyle}>
                    {translation("russian")}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {words.map((item, index) => (
                <TableRow
                  key={index}
                  onClick={() => {
                    setWordModal(item);
                  }}
                  sx={themeContext === "dark" ? rowStyleDark : rowStyle}
                >
                  <TableCell>
                    <Typography sx={wordsStyle}>
                      {capitalize(item.word)}
                    </Typography>
                  </TableCell>
                  <TableCell onClick={handleCloseModal}>
                    <Typography sx={wordsStyle}>
                      {capitalize(item.correctTranslation)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default DictionaryPage;
