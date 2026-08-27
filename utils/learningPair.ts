import { FoldersType } from "../Interfaces/ProvidersInterface";

export type LearningPair = "en-ru" | "es-ru";
export type FoldersDocKey = "foldersEnRu" | "foldersEsRu";

export interface PairConfig {
  pair: LearningPair;
  sourceKey: "englishWords" | "spanishWords";
  targetKey: "russianWords" | "russianWordsEs";
  foldersKey: FoldersDocKey;
  sourceLang: "en" | "es";
  targetLang: "ru";
  sourceLabelKey: "english" | "spanish";
  targetLabelKey: "russian";
}

export const DEFAULT_LEARNING_PAIR: LearningPair = "en-ru";

export const getPairConfig = (pair: LearningPair): PairConfig => {
  if (pair === "es-ru") {
    return {
      pair: "es-ru",
      sourceKey: "spanishWords",
      targetKey: "russianWordsEs",
      foldersKey: "foldersEsRu",
      sourceLang: "es",
      targetLang: "ru",
      sourceLabelKey: "spanish",
      targetLabelKey: "russian",
    };
  }

  return {
    pair: "en-ru",
    sourceKey: "englishWords",
    targetKey: "russianWords",
    foldersKey: "foldersEnRu",
    sourceLang: "en",
    targetLang: "ru",
    sourceLabelKey: "english",
    targetLabelKey: "russian",
  };
};

export const createEmptyWordsDoc = (uid: string) => ({
  englishWords: [],
  russianWords: [],
  spanishWords: [],
  russianWordsEs: [],
  uid,
});

export const createEmptyFoldersDoc = (uid: string) => ({
  uid,
  foldersEnRu: [],
  foldersEsRu: [],
});

export const createEmptyFolder = (id: number, name: string, pair: LearningPair) => {
  if (pair === "es-ru") {
    return {
      id,
      name,
      spanishWords: [],
      russianWordsEs: [],
    };
  }

  return {
    id,
    name,
    englishWords: [],
    russianWords: [],
  };
};

export const migrateFoldersDoc = (data: Record<string, unknown>) => {
  if (Array.isArray(data.foldersEnRu) && Array.isArray(data.foldersEsRu)) {
    return { ...data };
  }

  const legacy = (data.folders ?? []) as FoldersType[];
  const foldersEnRu: FoldersType[] = [];
  const foldersEsRu: FoldersType[] = [];

  legacy.forEach(({ id, name, englishWords, russianWords, spanishWords, russianWordsEs }) => {
    const hasEnRu =
      (englishWords?.length ?? 0) > 0 || (russianWords?.length ?? 0) > 0;
    const hasEsRu =
      (spanishWords?.length ?? 0) > 0 || (russianWordsEs?.length ?? 0) > 0;

    if (hasEnRu) {
      foldersEnRu.push({
        id,
        name,
        englishWords: englishWords ?? [],
        russianWords: russianWords ?? [],
      });
    }

    if (hasEsRu) {
      foldersEsRu.push({
        id,
        name,
        spanishWords: spanishWords ?? [],
        russianWordsEs: russianWordsEs ?? [],
      });
    }

    if (!hasEnRu && !hasEsRu) {
      foldersEnRu.push({
        id,
        name,
        englishWords: [],
        russianWords: [],
      });
    }
  });

  return {
    ...data,
    foldersEnRu,
    foldersEsRu,
  };
};

const hasEnRuWords = (folder: FoldersType) =>
  (folder.englishWords?.length ?? 0) > 0 ||
  (folder.russianWords?.length ?? 0) > 0;

const hasEsRuWords = (folder: FoldersType) =>
  (folder.spanishWords?.length ?? 0) > 0 ||
  (folder.russianWordsEs?.length ?? 0) > 0;

export const cleanupGhostFolders = (data: Record<string, unknown>) => {
  const enRu = [...((data.foldersEnRu ?? []) as FoldersType[])];
  const esRu = [...((data.foldersEsRu ?? []) as FoldersType[])];
  const esRuById = new Map(esRu.map((folder) => [folder.id, folder]));
  const enRuById = new Map(enRu.map((folder) => [folder.id, folder]));

  const foldersEnRu = enRu.filter((folder) => {
    if (hasEnRuWords(folder)) return true;
    const esSibling = esRuById.get(folder.id);
    return !(esSibling && hasEsRuWords(esSibling));
  });

  const foldersEsRu = esRu.filter((folder) => {
    if (hasEsRuWords(folder)) return true;
    const enSibling = enRuById.get(folder.id);
    if (enSibling && hasEnRuWords(enSibling)) return false;
    return false;
  });

  return {
    ...data,
    foldersEnRu,
    foldersEsRu,
  };
};

export const normalizeFoldersDoc = (data: Record<string, unknown>) => {
  const migrated = migrateFoldersDoc(data);
  const cleaned = cleanupGhostFolders(migrated) as Record<string, unknown>;
  delete cleaned.folders;
  return cleaned;
};

export const foldersDocChanged = (
  raw: Record<string, unknown>,
  normalized: Record<string, unknown>
) =>
  raw.folders !== undefined ||
  JSON.stringify(raw.foldersEnRu ?? []) !==
    JSON.stringify(normalized.foldersEnRu ?? []) ||
  JSON.stringify(raw.foldersEsRu ?? []) !==
    JSON.stringify(normalized.foldersEsRu ?? []);

export const getFoldersFromDoc = (
  data: Record<string, unknown>,
  config: PairConfig
): FoldersType[] => {
  const normalized = normalizeFoldersDoc(data);
  return (normalized[config.foldersKey] ?? []) as FoldersType[];
};

export const findFolderInDoc = (
  data: Record<string, unknown>,
  folderId: number,
  config: PairConfig
) => getFoldersFromDoc(data, config).find((folder) => folder.id === folderId);

export const persistFoldersDoc = (
  data: Record<string, unknown>,
  config: PairConfig,
  folders: FoldersType[]
) => {
  const normalized = normalizeFoldersDoc(data);
  normalized[config.foldersKey] = folders;
  delete normalized.folders;
  return normalized;
};
