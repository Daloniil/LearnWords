import { useContext } from "react";
import { LearningPairContext } from "../providers/LearningPairProvider";
import { getPairConfig } from "../utils/learningPair";

export const useLearningPair = () => {
  const { learningPair, setLearningPair } = useContext(LearningPairContext);
  const pairConfig = getPairConfig(learningPair);

  return {
    learningPair,
    setLearningPair,
    pairConfig,
  };
};
