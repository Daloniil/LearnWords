import { Enter } from "../Interfaces/EnterInterface";

export const lowerText = (data: Enter) => {
  data.englishWord = data.englishWord.toLowerCase();
  data.russianWord = data.russianWord.toLowerCase();
  return data;
};
