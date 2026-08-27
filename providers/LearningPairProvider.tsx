import React, { useCallback, useState } from "react";
import { LearningPairContextType } from "../Interfaces/ProvidersInterface";
import { ContextKey } from "../services/localKey";
import { LocalStorageService } from "../services/localStorageService";
import {
  DEFAULT_LEARNING_PAIR,
  LearningPair,
} from "../utils/learningPair";

export const LearningPairContext = React.createContext<LearningPairContextType>({
  learningPair: DEFAULT_LEARNING_PAIR,
  setLearningPair: () => {},
});

const getStoredPair = (): LearningPair => {
  const stored = LocalStorageService.getItem<string>(ContextKey.LEARNING_PAIR);
  return stored === "es-ru" ? "es-ru" : DEFAULT_LEARNING_PAIR;
};

export const LearningPairProvider: React.FC = ({ children }) => {
  const [learningPair, setLearningPairState] = useState<LearningPair>(
    getStoredPair()
  );

  const setLearningPair = useCallback((pair: LearningPair) => {
    LocalStorageService.setLearningPair(pair);
    setLearningPairState(getStoredPair());
  }, []);

  return (
    <LearningPairContext.Provider value={{ learningPair, setLearningPair }}>
      {children}
    </LearningPairContext.Provider>
  );
};
