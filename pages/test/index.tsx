import { useEffect, useState } from "react";
import { useNotification } from "../../hooks/useNotification";
import { useWords } from "../../hooks/useWords";

import { NotificationKeys } from "../../services/localKey";
import DoneIcon from "@mui/icons-material/Done";

import { Box, Button, capitalize, Modal, Typography } from "@mui/material";
import {
  barStyle,
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
import { useTestContext } from "../../hooks/useTestContext";
import { modalStyle } from "../../Styles/DictionaryStyle";
import { RestartTest } from "../../components/RestartTest";
import { useLanguage } from "../../hooks/useLanguage";
import { testTranslation } from "../../translation/Test";
import { setTranslation } from "../../utils/setTranslation";
import { useStats } from "../../hooks/useStats";
import { Word } from "../../Interfaces/ProvidersInterface";

const TestPage = () => {
  const {
    setTestWordsContext,
    setWordVariantsContext,
    setPercentContext,
    deleteTestContext,
    testWordsContext,
    wordVariantsContext,
    percentTestContext,
  } = useTestContext();

  const { englishWords, russianWords } = useWords();

  const { createVariantsWord, recreateWords, setColor, editPoint, clearPoint } =
    useTest();
  const { addNotification } = useNotification();
  const { languageContext } = useLanguage();
  const { addStats, addWord, stats } = useStats();

  const [wordVariants, setWordVariants] = useState(wordVariantsContext);
  const [testWords, setTestWord] = useState(
    testWordsContext.length > 0
      ? testWordsContext
      : (shuffle([...englishWords, ...russianWords, ...englishWords]) as Word[])
  );

  const [allPercent] = useState(englishWords.length * 3);

  const [percent, setPercent] = useState(percentTestContext);

  const [translatedWord, setTranslatedWord] = useState("");

  const [showPoint, setShowPoint] = useState(0);
  const [correctSelectWord, setCorrectSelectWord] = useState("");
  const [errorSelectWord, setErrorSelectWord] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(!openModal);
  };

  const clearSelectWord = () => {
    setCorrectSelectWord("");
    setErrorSelectWord("");
  };

  const pointCreate = (status: boolean) => {
    setTestWord(editPoint(testWords, testWords[0].point, status));
    setTestWordsContext(testWords);
    setShowPoint(testWords[0].point);
  };

  const sameWord = (words: Word[], showWord: string) => {
    if (words[1] && words[1].word === showWord) {
      setShowPoint(words[0].point);
      setTimeout(() => {
        setWordVariants(createVariantsWord(words[0].correctTranslation));
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
    deleteTestContext();
  };

  const selectCorrectWord = (word: string) => {
    setCorrectSelectWord(testWords[0].correctTranslation);
    if (testWords[0].correctTranslation === word) {
      if (testWords.length === 1) {
        restartTest();
        addStats();
        return;
      }
      editWords(true, testWords);

      setPercent(percent + 1);
      pointCreate(true);
      return;
    }
    addWord(testWords[0].word, testWords[0].correctTranslation);
    setErrorSelectWord(word);

    setPercent(
      percent - testWords[0].point < 0 ? 0 : percent - testWords[0].point
    );

    const recreate = recreateWords(testWords);
    editWords(false, recreate);
    pointCreate(false);

    return;
  };

  const translation = (key: string) => {
    return setTranslation(key, testTranslation, languageContext);
  };

  useEffect(() => {
    setPercentContext(percent);
  }, [percent]);

  useEffect(() => {
    setTestWordsContext(testWords);
  }, [testWords]);

  useEffect(() => {
    setWordVariantsContext(wordVariants);
  }, [wordVariants]);

  useEffect(() => {
    setWordVariants(createVariantsWord(testWords[0].correctTranslation));
    setShowPoint(testWords[0].point);
    clearSelectWord();
  }, [translatedWord, testWords]);

  useEffect(() => {
    if (stats.length < 1) {
      addStats();
    }
    setShowPoint(testWords[0].point);
    setTranslatedWord(testWords[0].word ?? "");
  }, []);

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
              {point <= showPoint ? <DoneIcon sx={{ color: "white" }} /> : ""}
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={variantsBoxStyle}>
        {wordVariants.map((item, index) => (
          <Box
            key={index}
            onClick={() => {
              selectCorrectWord(item);
            }}
            sx={variantStyle}
          >
            <Typography
              sx={variantTestStyle}
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
  );
};

export default TestPage;
