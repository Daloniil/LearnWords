import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  InputAdornment,
  Modal,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { useSearch } from "../../hooks/useSearch";
import { Word } from "../../Interfaces/ProvidersInterface";
import { EditWord } from "../../components/EditWord";
import { useLanguage } from "../../hooks/useLanguage";
import { useLearningPair } from "../../hooks/useLearningPair";
import { dictionaryTranslation } from "../../translation/Dictionary";
import { setTranslation } from "../../utils/setTranslation";
import { LoginStatus, NotificationKeys } from "../../services/localKey";
import { useLogin } from "../../hooks/useLogin";
import { useWords } from "../../hooks/useWords";
import { AddToFolder } from "../../components/AddToFolder";
import { useNotification } from "../../hooks/useNotification";
import { PageHeader } from "../../components/PageHeader";
import { EmptyState } from "../../components/EmptyState";
import { WordCard } from "../../components/WordCard";
import { AppModal } from "../../components/AppModal";
import {
  centeredLoader,
  pageStack,
  scrollList,
  surfaceCard,
} from "../../Styles/shared";

const DictionaryPage = () => {
  const { search } = useSearch();
  const { languageContext } = useLanguage();
  const { learningPair, pairConfig } = useLearningPair();
  const { checkingLogin } = useLogin();
  const { getWord, wordsHook, speakWord } = useWords();
  const { addNotification } = useNotification();

  const [words, setWords] = useState([] as Word[]);
  const [editWord, setEditWord] = useState({} as Word);
  const [searchWord, setSearchWord] = useState("");
  const [editId, setEditId] = useState(0);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalFolder, setOpenModalFolder] = useState(false);
  const [statusLoading, setStatusLoadingUser] = useState(false);
  const [selectStatus, setSelectStatus] = useState(false);
  const [selectStatusComp, setSelectStatusComp] = useState([] as boolean[]);
  const [moveWord, setMoveWord] = useState([] as Word[]);
  const [studyMode, setStudyMode] = useState(false);
  const [revealedIds, setRevealedIds] = useState<number[]>([]);

  const translation = (key: string) =>
    setTranslation(key, dictionaryTranslation, languageContext);

  const emptyStatus = () => {
    setSelectStatusComp(words.map(() => false));
  };

  const clearStatus = (stat?: boolean) => {
    setSelectStatus(stat ?? !selectStatus);
    emptyStatus();
    setMoveWord([]);
  };

  const handleCloseModalEdit = () => {
    setOpenModalEdit(false);
    getWord();
    clearStatus(false);
  };

  const handleCloseModalFolder = () => {
    if (moveWord.length) {
      setOpenModalFolder(false);
    } else {
      addNotification("selectWords", NotificationKeys.ERROR);
    }
  };

  const setWordModal = (word: Word) => {
    if (selectStatus) return;
    if (studyMode && !revealedIds.includes(word.id)) return;
    setEditWord(word);
    setEditId(word.id);
    setOpenModalEdit(true);
  };

  const toggleStudyMode = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setStudyMode(checked);
    setRevealedIds([]);
  };

  const revealTranslation = (id: number) => {
    setRevealedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const clickSelectButton = (index: number, item: Word) => {
    const next = [...selectStatusComp];
    next[index] = !next[index];
    setSelectStatusComp(next);

    if (next[index]) {
      setMoveWord((prev) => [...prev, item]);
    } else {
      setMoveWord((prev) => prev.filter((w) => w.id !== item.id));
    }
  };

  useEffect(() => {
    if (searchWord) {
      setWords(search(wordsHook, searchWord));
    } else {
      setStatusLoadingUser(true);
      getWord();
    }
  }, [searchWord]);

  useEffect(() => {
    setWords(wordsHook);
    setStatusLoadingUser(false);
    emptyStatus();
  }, [wordsHook]);

  useEffect(() => {
    checkingLogin(LoginStatus.OTHER);
    setStatusLoadingUser(true);
    getWord();
  }, [learningPair]);

  return (
    <Box sx={pageStack}>
      <PageHeader
        title={translation(pairConfig.sourceLabelKey) + " / " + translation(pairConfig.targetLabelKey)}
        subtitle={
          languageContext === "english"
            ? `${words.length} words`
            : `${words.length} слов`
        }
        action={
          <Button
            size="small"
            variant={selectStatus ? "outlined" : "contained"}
            onClick={() => clearStatus()}
          >
            {selectStatus ? translation("cancel") : translation("select")}
          </Button>
        }
      />

      <Box sx={surfaceCard}>
        <FormControlLabel
          control={
            <Switch
              checked={studyMode}
              onChange={toggleStudyMode}
              color="primary"
            />
          }
          label={
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {translation("studyMode")}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                {translation("studyModeDescription")}
              </Typography>
            </Box>
          }
          sx={{ m: 0, width: "100%", alignItems: "flex-start" }}
        />
      </Box>

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

      {selectStatus && moveWord.length > 0 ? (
        <Button variant="contained" onClick={() => setOpenModalFolder(true)}>
          {translation("add")} ({moveWord.length})
        </Button>
      ) : null}

      {statusLoading ? (
        <Box sx={centeredLoader}>
          <CircularProgress />
        </Box>
      ) : words.length === 0 ? (
        <EmptyState
          title={
            languageContext === "english"
              ? "No words yet"
              : "Слов пока нет"
          }
          description={
            languageContext === "english"
              ? "Add your first word to start learning"
              : "Добавьте первое слово, чтобы начать"
          }
        />
      ) : (
        <Stack sx={scrollList}>
          {words.map((item, index) => (
            <WordCard
              key={`${item.id}-${item.word}`}
              word={item}
              sourceLang={pairConfig.sourceLang}
              targetLang={pairConfig.targetLang}
              onPress={() => setWordModal(item)}
              onSpeak={() => speakWord(item.word)}
              selectable={selectStatus}
              selected={selectStatusComp[index]}
              onToggleSelect={() => clickSelectButton(index, item)}
              blurTarget={studyMode}
              targetRevealed={revealedIds.includes(item.id)}
              onRevealTarget={() => revealTranslation(item.id)}
              revealHint={translation("tapToReveal")}
            />
          ))}
        </Stack>
      )}

      <Modal open={openModalEdit} onClose={() => setOpenModalEdit(false)}>
        <AppModal>
          <EditWord
            editId={editId}
            wordEdit={editWord}
            handleCloseModal={handleCloseModalEdit}
            setStatusLoadingUser={setStatusLoadingUser}
          />
        </AppModal>
      </Modal>

      <Modal open={openModalFolder} onClose={handleCloseModalFolder}>
        <AppModal>
          <AddToFolder
            handleCloseModal={handleCloseModalFolder}
            moveWord={moveWord}
          />
        </AppModal>
      </Modal>
    </Box>
  );
};

export default DictionaryPage;
