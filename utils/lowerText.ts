import { Enter } from "../Interfaces/EnterInterface";

export const lowerText = (data: Enter) => {
  data.sourceWord = data.sourceWord.toLowerCase();
  data.targetWord = data.targetWord.toLowerCase();
  return data;
};
