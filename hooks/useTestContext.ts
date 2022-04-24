import { useContext } from "react";
import { TestContext } from "../providers/TestProvider";

export const useTestContext = () => {
  const {
    testWordsContext,
    wordVariantsContext,
    percentTestContext,
    setTestWordsContext,
    setWordVariantsContext,
    deleteTestContext,
    setPercentContext,
  } = useContext(TestContext);

  return {
    testWordsContext,
    wordVariantsContext,
    percentTestContext,
    setTestWordsContext,
    setWordVariantsContext,
    deleteTestContext,
    setPercentContext,
  };
};
