import React, { useCallback, useState } from "react";

import { LocalStorageService } from "../services/localStorageService";

import { Word, WordsContextType } from "../Interfaces/ProvidersInterface";
import { ContextKey } from "../services/localKey";

export const WordsContext = React.createContext<WordsContextType>({
  englishWords: [],
  russianWords: [],
  setWord: () => {},
  updateWord: () => {},
  deleteWord: () => {},
});

const appGetWords = (key: string): Word[] => {
  return LocalStorageService.getItem<Word[]>(key) ?? [];
};

export const WordsProvider: React.FC = ({ children }) => {
  const [englishWords, setEnglishWords] = useState(
    appGetWords(ContextKey.ENGLISH)
  );
  const [russianWords, setRussianWords] = useState(
    appGetWords(ContextKey.RUSSIAN)
  );

  const updateState = (key: string) => {
    if (key === ContextKey.ENGLISH) {
      setEnglishWords(appGetWords(ContextKey.ENGLISH));
    } else {
      setRussianWords(appGetWords(ContextKey.RUSSIAN));
    }
  };

  const handleAddWord = (word: Word, key: string) => {
    LocalStorageService.setWord(word, key);
    updateState(key);
  };

  const handleUpdateWord = (word: Word, key: string) => {
    LocalStorageService.updateWord(word, key);
    updateState(key);
  };

  const handleDeleteWord = (id: number, key: string) => {
    LocalStorageService.deleteWord(id, key);
    updateState(key);
  };

  const value = {
    englishWords,
    russianWords,

    setWord: useCallback(
      (word: Word, key: string) => handleAddWord(word, key),
      []
    ),

    updateWord: useCallback(
      (word: Word, key: string) => handleUpdateWord(word, key),
      []
    ),

    deleteWord: useCallback(
      (id: number, key: string) => handleDeleteWord(id, key),
      []
    ),
  };

  return (
    <WordsContext.Provider value={value}>{children}</WordsContext.Provider>
  );
};
