import { Enter } from "../Interfaces/EnterInterface";
import { useWords } from "./useWords";
import { ContextKey, EnterKeys, LanguageKeys } from "../services/localKey";

export const useEnter = () => {
  const { englishWords: words, updateWord, setWord } = useWords();

  const addUpdateWord = (data: Enter, key: string) => {
    const checkLanguage = key === ContextKey.ENGLISH;
    const params = {
      language: checkLanguage ? EnterKeys.word : EnterKeys.correctTranslation,
      wordIndex: checkLanguage ? LanguageKeys.ENGLISH : LanguageKeys.RUSSIAN,
      newLanguage: checkLanguage
        ? EnterKeys.correctTranslation
        : EnterKeys.word,
      addWord: checkLanguage ? LanguageKeys.RUSSIAN : LanguageKeys.ENGLISH,
    };

    const index = words
      .map((word) => word[params.language])
      .indexOf(data[params.wordIndex]);

    const newEnglish = words[index];
    const newRussian = words[index];

    newEnglish[params.newLanguage] = `${newEnglish[params.newLanguage]}, ${
      data[params.addWord]
    }`;
    updateWord(newEnglish, ContextKey.ENGLISH);

    newRussian[params.newLanguage] = `${newRussian[params.newLanguage]}, ${
      data[params.addWord]
    } `;
    updateWord(newRussian, ContextKey.RUSSIAN);
  };

  const addWord = (data: Enter, key: string) => {
    const newWord = {
      id: 0,
      word: key === ContextKey.ENGLISH ? data.englishWord : data.russianWord,
      correctTranslation:
        key === ContextKey.ENGLISH ? data.russianWord : data.englishWord,
      point: 0,
    };

    setWord(newWord, key);
  };

  return { words, addWord, addUpdateWord };
};
