import { useEffect, useState } from "react";
import { useNotification } from "../../hooks/useNotification";

import {
  LoginStatus,
  NotificationKeys,
  WordsParams,
} from "../../services/localKey";
import DoneIcon from "@mui/icons-material/Done";

import {
  Box,
  Button,
  capitalize,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import {
  barStyle,
  circularProgress,
  doneCorrectStyle,
  doneFailStyle,
  percentBarStyle,
  pointsStyle,
  pointStyle,
  restartButtonStyle,
  statusBarStyle,
  titleStyle,
  variantsBoxStyle,
  variantStyle,
  variantTestStyle,
} from "../../Styles/TestStyle";
import { shuffle } from "../../utils/shuffle";
import Router from "next/router";
import { useTest } from "../../hooks/useTest";
import { amountPoint } from "../../utils/amountPoint";
import { LinearProgressWithLabel } from "../../components/LinearProgress/LinearProgress";
import { modalStyle } from "../../Styles/DictionaryStyle";
import { RestartTest } from "../../components/RestartTest";
import { useLanguage } from "../../hooks/useLanguage";
import { testTranslation } from "../../translation/Test";
import { setTranslation } from "../../utils/setTranslation";
import { Word, WordsContextType } from "../../Interfaces/ProvidersInterface";
import { useLogin } from "../../hooks/useLogin";
import { useTestContext } from "../../hooks/useTestServer";
import { useStats } from "../../hooks/useStats";
import { useWords } from "../../hooks/useWords";
import { SelectFolder } from "../../components/SelectFolder";

const TestPage = () => {
  const { checkingLogin } = useLogin();
  const { getWord, wordsHook, speakWord } = useWords();

  const { addStatsServer, addWordStatsServer, getStats, statsHook } =
    useStats();

  const {
    allWordsHook,
    setTestWordsServer,
    getTest,
    testWordHook,
    setPercentServer,
    getPercentServer,
    percentHook,
    deleteTestServer,
    selectFolderStatus,
  } = useTestContext();

  const {
    createVariantsWord,
    recreateWords,
    setColor,
    editPoint,
    clearPoint,
    findLang,
  } = useTest();

  const { addNotification } = useNotification();
  const { languageContext } = useLanguage();

  const [wordsServer, setWordsServer] = useState({} as WordsContextType);
  const [wordVariants, setWordVariants] = useState([]);
  const [testWords, setTestWord] = useState([] as Word[]);
  const [words, setWords] = useState(null as null | Word[]);

  const [allPercent, setAllPercent] = useState(0);
  const [percent, setPercent] = useState(-1);
  const [translatedWord, setTranslatedWord] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);

  const [showPoint, setShowPoint] = useState(0);
  const [correctSelectWord, setCorrectSelectWord] = useState("");
  const [errorSelectWord, setErrorSelectWord] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [click, setClick] = useState(true);
  const [openModalFolder, setOpenModalFolder] = useState(false);
  const [folderId, setFolderId] = useState(null as null | number);

  const handleCloseModal = () => {
    setOpenModal(!openModal);
  };

  const handleCloseModalFolder = (id: number) => {
    setFolderId(id);
    setOpenModalFolder(!openModalFolder);
    getTest(id);
  };

  const clearSelectWord = () => {
    setCorrectSelectWord("");
    setErrorSelectWord("");
  };

  const pointCreate = (status: boolean) => {
    setTestWord(editPoint(testWords, testWords[0].point, status));
    setTestWordsServer(testWords);
    setShowPoint(testWords[0].point);
  };

  const sameWord = (words: Word[], showWord: string) => {
    if (words[1] && words[1].word === showWord) {
      setShowPoint(words[0].point);
      setTimeout(() => {
        setWordVariants(
          createVariantsWord(
            words[0].correctTranslation,
            wordsServer.englishWords,
            wordsServer.russianWords
          )
        );
      }, 1000);
      clearSelectWord();
    }
  };

  const timeOut = (words: Word[], status: boolean) => {
    setTimeout(() => {
      if (status) {
        setTestWord(words.splice(0, 1));
      }
      setTestWord(words);
      setTranslatedWord(words[0].word);
    }, 1000);
  };

  const editWords = (status: boolean, words: Word[]) => {
    timeOut(words, status);
    sameWord(words, translatedWord);
  };

  const restartTest = () => {
    Router.push("/enter");
    addNotification("testPassed", NotificationKeys.SUCCESS);
    clearPoint(testWords);
    deleteTestServer();
  };

  const selectCorrectWord = (word: string) => {
    setClick(false);
    setCorrectSelectWord(testWords[0].correctTranslation);
    const wordToSpeak = findLang(testWords[0], wordsServer.englishWords);

    if (testWords[0].correctTranslation === word) {
      if (testWords.length === 1) {
        restartTest();
        addStatsServer();
        speakWord(wordToSpeak);
        setTimeout(() => setClick(true), 1000);

        return;
      }
      editWords(true, testWords);

      setPercent(percent + 1);
      pointCreate(true);
      speakWord(wordToSpeak);
      setTimeout(() => setClick(true), 1000);

      return;
    }
    addWordStatsServer(testWords[0].word, testWords[0].correctTranslation);
    setErrorSelectWord(word);

    setPercent(
      percent - testWords[0].point < 0 ? 0 : percent - testWords[0].point
    );

    const recreate = recreateWords(
      testWords,
      wordsServer.englishWords,
      wordsServer.russianWords
    );
    editWords(false, recreate);
    pointCreate(false);
    speakWord(wordToSpeak);

    setTimeout(() => setClick(true), 1000);

    return;
  };

  const translation = (key: string) => {
    return setTranslation(key, testTranslation, languageContext);
  };

  useEffect(() => {
    if (percent > 0) {
      setPercentServer(percent);
    }
  }, [percent]);

  useEffect(() => {
    if (testWords[0]) {
      setWordVariants(
        createVariantsWord(
          testWords[0].correctTranslation,
          wordsServer.englishWords,
          wordsServer.russianWords
        )
      );
      setShowPoint(testWords[0].point);
      clearSelectWord();
    }
  }, [translatedWord, testWords]);

  useEffect(() => {
    if (testWords[0] && !translatedWord) {
      setShowPoint(testWords[0].point);
      setTranslatedWord(testWords[0].word ?? "");
    }

    if (testWords.length) {
      //@ts-ignore
      setTestWordsServer(testWords, folderId);
    }
  }, [testWords]);

  useEffect(() => {
    if (
      allWordsHook.englishWords &&
      allWordsHook.englishWords.length <= WordsParams.MINLENGTH
    ) {
      addNotification("leastFive", NotificationKeys.ERROR);
      Router.push("/enter");
      return;
    }
    setWordsServer(allWordsHook);
  }, [allWordsHook]);

  useEffect(() => {
    getWord();
    getStats();
    checkingLogin(LoginStatus.OTHER);
    setStatusLoading(true);
    getPercentServer();
    getTest();
  }, []);

  useEffect(() => {
    if (statsHook && statsHook.length === 0) {
      addStatsServer();
    }
  }, [statsHook]);

  useEffect(() => {
    setPercent(percentHook);
  }, [percentHook]);

  useEffect(() => {
    if (
      !!testWordHook?.length &&
      !!!testWords.length &&
      wordsServer.englishWords
    ) {
      setTestWord(testWordHook);
      setStatusLoading(false);
    }

    if (
      wordsServer.englishWords &&
      !!!testWords.length &&
      !!!testWordHook?.length
    ) {
      setTestWord(
        shuffle([
          ...wordsServer.englishWords,
          ...wordsServer.russianWords,
          ...wordsServer.englishWords,
        ])
      );
      setStatusLoading(false);
    }

    if (wordsServer.englishWords) {
      setAllPercent(wordsServer.englishWords.length * 3);
    }
  }, [wordsServer, testWordHook]);

  useEffect(() => {
    setWords(wordsHook);
  }, [wordsHook]);

  useEffect(() => {
    if (selectFolderStatus) {
      setOpenModalFolder(true);
    }
  }, [selectFolderStatus]);

  return (
    <>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box sx={modalStyle}>
          <RestartTest
            handleCloseModal={handleCloseModal}
            restartTest={restartTest}
          />
        </Box>
      </Modal>

      <Modal
        open={openModalFolder}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box sx={modalStyle}>
          <SelectFolder handleCloseModal={handleCloseModalFolder} />
        </Box>
      </Modal>

      {statusLoading ? (
        <CircularProgress sx={circularProgress} />
      ) : (
        <>
          <Button
            onClick={handleCloseModal}
            sx={restartButtonStyle}
            variant="outlined"
            color="error"
          >
            {translation("restart")}
          </Button>
          <Typography sx={titleStyle}>{capitalize(translatedWord)}</Typography>
          <Box sx={pointsStyle}>
            {amountPoint.map((point, index) => (
              <Box key={index} sx={pointStyle}>
                <Box sx={point <= showPoint ? doneCorrectStyle : doneFailStyle}>
                  {point <= showPoint ? (
                    <DoneIcon sx={{ color: "white" }} />
                  ) : (
                    ""
                  )}
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={variantsBoxStyle}>
            {wordVariants.map((item, index) => (
              <Box
                key={index}
                onClick={() => {
                  click ? selectCorrectWord(item) : "";
                }}
                sx={variantStyle}
              >
                <Typography
                  sx={variantTestStyle}
                  lang={"ru" || "en"}
                  style={{
                    color: setColor(errorSelectWord, correctSelectWord, item),
                  }}
                >
                  {capitalize(item)}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box sx={statusBarStyle}>
            <Typography sx={percentBarStyle}>
              {Math.floor((percent / allPercent) * 100)}%
            </Typography>
            <LinearProgressWithLabel
              value={Math.floor((percent / allPercent) * 100)}
              sx={barStyle}
            />
          </Box>
        </>
      )}
    </>
  );
};

export default TestPage;
