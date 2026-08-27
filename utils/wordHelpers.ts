import { PairConfig } from "./learningPair";
import { Word } from "../Interfaces/ProvidersInterface";
import { Enter } from "../Interfaces/EnterInterface";

export const getWordArrays = (
  data: Record<string, unknown>,
  config: PairConfig
) => ({
  sourceWords: (data[config.sourceKey] ?? []) as Word[],
  targetWords: (data[config.targetKey] ?? []) as Word[],
});

export const ensureWordArrays = (
  data: Record<string, unknown>,
  config: PairConfig
) => {
  if (!data[config.sourceKey]) {
    data[config.sourceKey] = [];
  }
  if (!data[config.targetKey]) {
    data[config.targetKey] = [];
  }
  return data;
};

export const mapFolderToWordsContext = (
  folder: Record<string, unknown>,
  config: PairConfig
) => {
  const { sourceWords, targetWords } = getWordArrays(folder, config);
  return { sourceWords, targetWords };
};

export const buildWordPair = (id: number, data: Enter) => {
  const sourceWord = {
    id,
    word: data.sourceWord,
    correctTranslation: data.targetWord,
    point: 0,
  };
  const targetWord = {
    id,
    word: data.targetWord,
    correctTranslation: data.sourceWord,
    point: 0,
  };
  return { sourceWord, targetWord };
};

export const isDuplicateWord = (
  data: Enter,
  sourceWords: Word[],
  targetWords: Word[],
  excludeId?: number
) => {
  const sourceDuplicate = sourceWords.some(
    (item) => item.word === data.sourceWord && item.id !== excludeId
  );
  const targetDuplicate = targetWords.some(
    (item) => item.word === data.targetWord && item.id !== excludeId
  );
  return sourceDuplicate && targetDuplicate;
};

export const isDuplicateOnEdit = (
  data: Enter,
  sourceWords: Word[],
  targetWords: Word[],
  id: number
) => {
  const sourceExists = sourceWords.some(
    (item) => item.word === data.sourceWord && item.id !== id
  );
  const targetExists = targetWords.some(
    (item) => item.word === data.targetWord && item.id !== id
  );
  return sourceExists && targetExists;
};
