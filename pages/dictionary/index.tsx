import {
  Box,
  capitalize,
  CircularProgress,
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
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";

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
import { LoginStatus } from "../../services/localKey";
import { useLogin } from "../../hooks/useLogin";
import { useWords } from "../../hooks/useWords";

const DictionaryPage = () => {
  const { search } = useSearch();
  const { languageContext } = useLanguage();
  const { themeContext } = useTheme();
  const { checkingLogin } = useLogin();
  const { getWord, wordsHook, speakWord } = useWords();

  const [words, setWords] = useState([] as Word[]);
  const [statusDelete, setStatusDelete] = useState(false);
  const [editWord, setEditWord] = useState({} as Word);
  const [searchWord, setSearchWord] = useState("");

  const [editId, setEditId] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [statusLoading, setStatusLoadingUser] = useState(false);
  const [windowHieght, setWindowHieght] = useState(550);

  const handleCloseModal = () => {
    setOpenModal(!openModal);
    getWord();
  };

  const textFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value.toLowerCase());
  };

  const searchingWord = () => {
    const wordsArray = search(words, searchWord);
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
      setStatusLoadingUser(true);
      getWord();
    }
  }, [searchWord]);

  useEffect(() => {
    setWords(wordsHook);
    setWindowHieght(window.outerHeight);
    setStatusLoadingUser(false);
  }, [wordsHook]);

  useEffect(() => {
    checkingLogin(LoginStatus.OTHER);
    setStatusLoadingUser(true);
    getWord();
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
          <EditWord
            editId={editId}
            wordEdit={editWord}
            handleCloseModal={handleCloseModal}
            setStatusLoadingUser={setStatusLoadingUser}
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
        <TableContainer
          sx={{ maxHeight: (windowHieght / 100) * 63, margin: "0 0 0 0" }}
        >
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
            {statusLoading ? (
              <CircularProgress
                sx={{
                  minWidth: "100px",
                  minHeight: "100px",
                  margin: "25px 0 25px 90%",
                }}
              />
            ) : (
              <TableBody>
                {words.map((item, index) => (
                  <TableRow
                    key={index}
                    onClick={() => {
                      setWordModal(item);
                    }}
                    sx={themeContext === "dark" ? rowStyleDark : rowStyle}
                  >
                    <TableCell sx={{ maxWidth: "150px" }}>
                      <Typography
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          margin: "0 0 0 5px",
                        }}
                      >
                        <Typography
                          onClick={(e) => {
                            e.stopPropagation(), speakWord(item.word);
                          }}
                          sx={{ margin: "3px 0 0 0" }}
                        >
                          <VolumeUpIcon fontSize="medium" color="primary" />
                        </Typography>
                        <Typography lang="en-US" sx={wordsStyle}>
                          {capitalize(item.word)}
                        </Typography>
                      </Typography>
                    </TableCell>
                    <TableCell
                      onClick={handleCloseModal}
                      sx={{ maxWidth: "150px" }}
                    >
                      <Typography lang="ru" sx={wordsStyle}>
                        {capitalize(item.correctTranslation)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default DictionaryPage;
