import React, { useCallback, useState } from "react";
import { TestContextType, Word } from "../Interfaces/ProvidersInterface";
import { ContextKey } from "../services/localKey";
import { LocalStorageService } from "../services/localStorageService";

export const TestContext = React.createContext<TestContextType>({
  testWordsContext: [],
  wordVariantsContext: [],
  percentTestContext: 0,
  setTestWordsContext: () => {},
  setWordVariantsContext: () => {},
  setPercentContext: () => {},
  deleteTestContext: () => {},
});

const appGetTestWords = (key: string): Word[] => {
  return LocalStorageService.getItem<Word[]>(key) ?? [];
};

const appGetWordVariants = (key: string): string[] => {
  return LocalStorageService.getItem<string[]>(key) ?? [];
};

const appGetPercentTest = (key: string): number => {
  return LocalStorageService.getItem<number>(key) ?? 0;
};

export const TestProvider: React.FC = ({ children }) => {
  const [testWordsContext, setTestWordsContext] = useState(
    appGetTestWords(ContextKey.TEST)
  );
  const [wordVariantsContext, setWordVariantsContext] = useState(
    appGetWordVariants(ContextKey.WORD)
  );

  const [percentTestContext, setPercentTextContext] = useState(
    appGetPercentTest(ContextKey.PERCENT)
  );

  const updateState = () => {
    setTestWordsContext(appGetTestWords(ContextKey.TEST));
    setWordVariantsContext(appGetWordVariants(ContextKey.WORD));
    setPercentTextContext(appGetPercentTest(ContextKey.PERCENT));
  };

  const handleAddTestWord = (word: Word[]) => {
    LocalStorageService.setTestWords(word);
    updateState();
  };

  const handleSetWordVariants = (word: string[]) => {
    LocalStorageService.setWordVariants(word);
    updateState();
  };

  const handleSetPercentTest = (percent: number) => {
    LocalStorageService.setPercentTest(percent);
    updateState();
  };

  const handleDeleteTest = () => {
    LocalStorageService.deleteTest();
    updateState();
  };

  const value = {
    testWordsContext,
    wordVariantsContext,
    percentTestContext,
    setTestWordsContext: useCallback(
      (word: Word[]) => handleAddTestWord(word),
      []
    ),

    setWordVariantsContext: useCallback(
      (word: string[]) => handleSetWordVariants(word),
      []
    ),

    deleteTestContext: useCallback(() => handleDeleteTest(), []),

    setPercentContext: useCallback(
      (percent: number) => handleSetPercentTest(percent),
      []
    ),
  };

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
};
