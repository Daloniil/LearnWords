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
import { useEffect, useMemo, useRef, useState } from "react";
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

const WORDS_PAGE_SIZE = 25;

const DictionaryPage = () => {
  const { search } = useSearch();
  const { languageContext } = useLanguage();
  const { learningPair, pairConfig } = useLearningPair();
  const { checkingLogin } = useLogin();
  const { getWord, wordsHook, speakWord, isLoading, isValidating } = useWords();
  const { addNotification } = useNotification();

  const [editWord, setEditWord] = useState({} as Word);
  const [searchWord, setSearchWord] = useState("");
  const [editId, setEditId] = useState(0);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalFolder, setOpenModalFolder] = useState(false);
  const [selectStatus, setSelectStatus] = useState(false);
  const [selectStatusComp, setSelectStatusComp] = useState([] as boolean[]);
  const [moveWord, setMoveWord] = useState([] as Word[]);
  const [studyMode, setStudyMode] = useState(false);
  const [revealedIds, setRevealedIds] = useState<number[]>([]);
  const [visibleCount, setVisibleCount] = useState(WORDS_PAGE_SIZE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const words = useMemo(() => {
    if (!searchWord) return wordsHook;
    return search(wordsHook, searchWord);
  }, [wordsHook, searchWord, search]);

  const visibleWords = useMemo(
    () => words.slice(0, visibleCount),
    [words, visibleCount]
  );

  const hasMoreWords = visibleWords.length < words.length;

  const translation = (key: string) =>
    setTranslation(key, dictionaryTranslation, languageContext);

  const showingWordsLabel = translation("showingWords")
    .replace("{shown}", String(visibleWords.length))
    .replace("{total}", String(words.length));

  const resetSelection = () => {
    setSelectStatusComp(words.map(() => false));
  };

  const clearStatus = (stat?: boolean) => {
    setSelectStatus(stat ?? !selectStatus);
    resetSelection();
    setMoveWord([]);
  };

  const handleCloseModalEdit = () => {
    setOpenModalEdit(false);
    getWord({ force: true });
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
    resetSelection();
  }, [wordsHook]);

  useEffect(() => {
    setVisibleCount(WORDS_PAGE_SIZE);
  }, [searchWord, wordsHook, learningPair]);

  useEffect(() => {
    checkingLogin(LoginStatus.OTHER);
  }, [learningPair]);

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || !hasMoreWords) return;

    const scrollRoot = sentinel.closest("main");

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + WORDS_PAGE_SIZE, words.length)
          );
        }
      },
      {
        root: scrollRoot,
        rootMargin: "120px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMoreWords, words.length, visibleWords.length]);

  const showLoader = isLoading && words.length === 0;

  return (
    <Box sx={pageStack}>
      <PageHeader
        title={translation(pairConfig.sourceLabelKey) + " / " + translation(pairConfig.targetLabelKey)}
        subtitle={
          languageContext === "english"
            ? `${words.length} words${isValidating ? " · updating…" : ""}`
            : `${words.length} слов${isValidating ? " · обновление…" : ""}`
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

      {showLoader ? (
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
        <Stack spacing={1.5}>
          <Stack sx={scrollList}>
            {visibleWords.map((item, index) => (
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

          {hasMoreWords ? (
            <Box
              ref={loadMoreRef}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 2,
                minHeight: 48,
              }}
            >
              <CircularProgress size={22} />
            </Box>
          ) : words.length > WORDS_PAGE_SIZE ? (
            <Typography
              variant="caption"
              color="text.secondary"
              textAlign="center"
              display="block"
              sx={{ pb: 1 }}
            >
              {showingWordsLabel}
            </Typography>
          ) : null}
        </Stack>
      )}

      <Modal open={openModalEdit} onClose={() => setOpenModalEdit(false)}>
        <AppModal>
          <EditWord
            editId={editId}
            wordEdit={editWord}
            handleCloseModal={handleCloseModalEdit}
            setStatusLoadingUser={() => {}}
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
