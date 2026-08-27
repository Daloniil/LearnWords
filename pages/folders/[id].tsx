import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Router from "next/router";
import {
  Box,
  capitalize,
  CircularProgress,
  IconButton,
  InputAdornment,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFolders } from "../../hooks/useFolders";
import { useLanguage } from "../../hooks/useLanguage";
import { useLearningPair } from "../../hooks/useLearningPair";
import { getWordArrays } from "../../utils/wordHelpers";
import { useLogin } from "../../hooks/useLogin";
import { Word } from "../../Interfaces/ProvidersInterface";
import { LoginStatus } from "../../services/localKey";
import { dictionaryTranslation } from "../../translation/Dictionary";
import { setTranslation } from "../../utils/setTranslation";
import { useSearch } from "../../hooks/useSearch";
import { useWords } from "../../hooks/useWords";
import { EditWord } from "../../components/EditWord";
import { WordCard } from "../../components/WordCard";
import { AppModal } from "../../components/AppModal";
import { EmptyState } from "../../components/EmptyState";
import {
  centeredLoader,
  pageStack,
  scrollList,
  surfaceCard,
} from "../../Styles/shared";

const FolderPage = () => {
  const router = useRouter();
  const { search } = useSearch();
  const { checkingLogin } = useLogin();
  const { getFolders, foldersHook } = useFolders();
  const { languageContext } = useLanguage();
  const { learningPair, pairConfig } = useLearningPair();
  const { speakWord } = useWords();

  const [folderName, setFolderName] = useState("");
  const [folderId, setFolderId] = useState(0);
  const [allFolderWords, setAllFolderWords] = useState([] as Word[]);
  const [folderWord, setFolderWord] = useState([] as Word[]);
  const [searchWord, setSearchWord] = useState("");
  const [statusLoading, setStatusLoadingUser] = useState(false);
  const [editId, setEditId] = useState(0);
  const [editWord, setEditWord] = useState({} as Word);
  const [openModalEdit, setOpenModalEdit] = useState(false);

  const translation = (key: string) =>
    setTranslation(key, dictionaryTranslation, languageContext);

  const handleCloseModalEdit = () => {
    setOpenModalEdit(false);
    setTimeout(() => getFolders(), 500);
  };

  const setWordModal = (word: Word) => {
    setEditWord(word);
    setEditId(word.id);
    setOpenModalEdit(true);
  };

  useEffect(() => {
    if (searchWord) {
      setFolderWord(search(allFolderWords, searchWord));
    } else {
      setFolderWord(allFolderWords);
    }
  }, [searchWord, allFolderWords]);

  useEffect(() => {
    if (foldersHook?.length > 0) {
      const folderInfo = foldersHook.find(
        (f) => f.id === Number(router.query.id)
      );
      if (folderInfo) {
        setFolderId(folderInfo.id);
        const { sourceWords } = getWordArrays(folderInfo, pairConfig);
        setAllFolderWords(sourceWords);
        setFolderWord(sourceWords);
        setFolderName(folderInfo.name);
        setStatusLoadingUser(false);
      } else {
        Router.push("/folders");
      }
    }
  }, [foldersHook, learningPair]);

  useEffect(() => {
    checkingLogin(LoginStatus.OTHER);
    getFolders();
    setStatusLoadingUser(true);
  }, [learningPair]);

  return (
    <Box sx={pageStack}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {folderName}
        </Typography>
        <IconButton onClick={() => Router.push("/folders")} aria-label="back">
          <ArrowBackIcon />
        </IconButton>
      </Stack>

      <Box sx={surfaceCard}>
        <TextField
          fullWidth
          size="small"
          placeholder={translation("searchWord")}
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value.toLowerCase())}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {statusLoading ? (
        <Box sx={centeredLoader}>
          <CircularProgress />
        </Box>
      ) : folderWord.length === 0 ? (
        <EmptyState
          title={
            languageContext === "english"
              ? "Folder is empty"
              : "Папка пуста"
          }
        />
      ) : (
        <Stack sx={scrollList}>
          {folderWord.map((item) => (
            <WordCard
              key={item.id}
              word={item}
              sourceLang={pairConfig.sourceLang}
              targetLang={pairConfig.targetLang}
              onPress={() => setWordModal(item)}
              onSpeak={() => speakWord(item.word)}
            />
          ))}
        </Stack>
      )}

      <Modal open={openModalEdit} onClose={handleCloseModalEdit}>
        <AppModal>
          <EditWord
            folderId={folderId}
            editId={editId}
            wordEdit={editWord}
            handleCloseModal={handleCloseModalEdit}
            setStatusLoadingUser={setStatusLoadingUser}
          />
        </AppModal>
      </Modal>
    </Box>
  );
};

export default FolderPage;
