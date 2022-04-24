import { TranslationType } from "../Interfaces/TranslationInterface";

export const setTranslation = (
  key: string,
  translation: TranslationType[],
  languageContext: string
) => {
  let sentence = "";
  translation.forEach((translate) => {
    if (translate.title === key) {
      sentence = languageContext === "english" ? translate.en : translate.ru;
    }
  });
  return sentence;
};
