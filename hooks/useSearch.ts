import { useWords } from "./useWords";

import { Enter } from "../Interfaces/EnterInterface";
import { Word } from "../Interfaces/ProvidersInterface";
import { ContextKey } from "../services/localKey";

export const useSearch = () => {
  const { englishWords: words } = useWords();

  const findWords = (data: Enter, key: string) => {
    if (key === ContextKey.ENGLISH) {
      return words.find((item) => item.word === data.englishWord);
    }
    return words.find((item) => item.correctTranslation === data.russianWord);
  };

  const search = (englishWords: Word[], searchWord: string) => {
    const wordsArray: Word[] = [];
    englishWords
      .filter((word) => {
        return (
          word.word.toLowerCase().includes(searchWord) ||
          word.correctTranslation.toLowerCase().includes(searchWord)
        );
      })
      .forEach((e) => {
        wordsArray.push(e);
      });
    return wordsArray;
  };

  return { findWords, search };
};
