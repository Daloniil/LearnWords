import { Word } from "../Interfaces/ProvidersInterface";

export const useSearch = () => {
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

  return { search };
};
