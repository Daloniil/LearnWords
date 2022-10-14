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
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFolders } from "../../hooks/useFolders";
import { useLanguage } from "../../hooks/useLanguage";
import { useLogin } from "../../hooks/useLogin";
import { Word } from "../../Interfaces/ProvidersInterface";
import { LoginStatus } from "../../services/localKey";
import {
  circularProgressDictionary,
  modalStyle,
  rowStyle,
  rowStyleDark,
  searchStyle,
  tableCellStyle,
  titleWordsStyle,
  wordsStyle,
} from "../../Styles/DictionaryStyle";
import { dictionaryTranslation } from "../../translation/Dictionary";
import { setTranslation } from "../../utils/setTranslation";
import SearchIcon from "@mui/icons-material/Search";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useTheme } from "../../hooks/useTheme";
import { useWords } from "../../hooks/useWords";
import { useSearch } from "../../hooks/useSearch";
import { EditWord } from "../../components/EditWord";

const FolderPage = () => {
  const router = useRouter();
  const { search } = useSearch();
  const { checkingLogin } = useLogin();
  const { getFolders, foldersHook } = useFolders();
  const { languageContext } = useLanguage();
  const { themeContext } = useTheme();
  const { speakWord } = useWords();

  const [folderName, setFolderName] = useState("");
  const [folderId, setFolderId] = useState(0);
  const [folderWord, setFolderWord] = useState([] as Word[]);
  const [searchWord, setSearchWord] = useState("");
  const [statusLoading, setStatusLoadingUser] = useState(false);
  const [windowHeight, setWindowHeight] = useState(550);
  const [editId, setEditId] = useState(0);
  const [editWord, setEditWord] = useState({} as Word);
  const [openModalEdit, setOpenModalEdit] = useState(false);

  const handleCloseModalEdit = () => {
    setOpenModalEdit(!openModalEdit);
    setTimeout(() => {
      getFolders();
    }, 500);
  };

  const translation = (key: string) => {
    return setTranslation(key, dictionaryTranslation, languageContext);
  };

  const textFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value.toLowerCase());
  };

  const searchingWord = () => {
    const wordsArray = search(folderWord, searchWord);
    setFolderWord(wordsArray);
  };

  const setWordModal = (word: Word) => {
    handleCloseModalEdit();
    setEditWord(word);
    setEditId(word.id);
  };

  useEffect(() => {
    if (searchWord) {
      searchingWord();
    } else {
      getFolders();
      setStatusLoadingUser(true);
    }
  }, [searchWord]);

  useEffect(() => {
    if (foldersHook && foldersHook.length > 0) {
      const folderInfo =
        foldersHook[
          foldersHook.map((id) => id.id).indexOf(Number(router.query.id))
        ];
      if (folderInfo) {
        setFolderId(folderInfo.id);
        setFolderWord(folderInfo.englishWords);
        setFolderName(folderInfo.name);
        setWindowHeight(window.outerHeight);
        setStatusLoadingUser(false);
      } else {
        Router.push("/folders");
      }
    }
  }, [foldersHook]);

  useEffect(() => {
    checkingLogin(LoginStatus.OTHER);
    getFolders();
    setStatusLoadingUser(true);
  }, []);

  return (
    <>
      <Modal
        open={openModalEdit}
        onClose={handleCloseModalEdit}
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
            folderId={folderId}
            editId={editId}
            wordEdit={editWord}
            handleCloseModal={handleCloseModalEdit}
            setStatusLoadingUser={setStatusLoadingUser}
          />
        </Box>
      </Modal>

      <Typography
        sx={{
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "800",
          margin: "0 0 10px 0 ",
        }}
      >
        {folderName}
      </Typography>
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
          sx={{ maxHeight: (windowHeight / 100) * 63, margin: "0 0 0 0" }}
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
              <CircularProgress sx={circularProgressDictionary} />
            ) : (
              <TableBody>
                {folderWord.map((item, index) => (
                  <TableRow
                    key={index}
                    onClick={() => {
                      setWordModal(item);
                    }}
                    sx={themeContext === "dark" ? rowStyleDark : rowStyle}
                  >
                    <TableCell sx={{ maxWidth: "150px" }}>
                      <Typography sx={tableCellStyle}>
                        <Typography
                          onClick={(e) => {
                            e.stopPropagation(), speakWord(item.word);
                          }}
                          sx={{ margin: "3px 0 0 0" }}
                        >
                          <VolumeUpIcon fontSize="medium" color="primary" />
                        </Typography>
                        <Typography lang="en" sx={wordsStyle}>
                          {capitalize(item.word)}
                        </Typography>
                      </Typography>
                    </TableCell>
                    <TableCell
                      onClick={handleCloseModalEdit}
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

export default FolderPage;
