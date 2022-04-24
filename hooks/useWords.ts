import { useContext } from "react";
import { WordsContext } from "../providers/WordsProvider";

export const useWords = () => {
  const { englishWords, russianWords, setWord, updateWord, deleteWord } =
    useContext(WordsContext);

  return {
    englishWords,
    russianWords,
    setWord,
    updateWord,
    deleteWord,
  };
};
