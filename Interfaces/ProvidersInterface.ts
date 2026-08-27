import { Enter } from "./EnterInterface";
import { LearningPair } from "../utils/learningPair";

export type WordsContextType = {
  sourceWords: Word[];
  targetWords: Word[];
};

export type WordsProviderContextType = {
  wordsHook: Word[];
  isLoading: boolean;
  isValidating: boolean;
  getWord: (options?: { force?: boolean }) => Promise<void>;
  addWord: (data: Enter) => Promise<void>;
  updateWord: (id: number, data: Enter) => Promise<void>;
  deleteWord: (id: number) => Promise<void>;
  speakWord: (text: string) => void;
  invalidateWords: () => void;
};

export type AuthContextType = {
  authContext: Auth;
  setAuth: (auth: Auth) => void;
  removeAuth: () => void;
};

export type Auth = {
  user: CurrentUser;
};

export type CurrentUser = {
  uid: string;
  displayName: string;
};

export type Word = {
  id: number;
  word: string;
  correctTranslation: string;
  point: number;
};

export type FoldersType = {
  id: number;
  name: string;
  englishWords?: Word[];
  russianWords?: Word[];
  spanishWords?: Word[];
  russianWordsEs?: Word[];
};

export type FoldersProviderContextType = {
  foldersHook: FoldersType[];
  isLoading: boolean;
  isValidating: boolean;
  getFolders: (options?: { force?: boolean }) => Promise<void>;
  createFolder: (nameFolder: string) => Promise<void>;
  deleteFolder: (id: number) => Promise<void>;
  addWords: (data: Word[], id: number) => Promise<void>;
  deleteWords: (idFolder: number, idWord: number) => Promise<void>;
  updateWords: (idFolder: number, idWord: number, data: Enter) => Promise<void>;
  invalidateFolders: () => void;
};

export type NotificationContextType = {
  notification: string | null;
  statusNotification: string | null;
  addNotification: (message: string, status: string) => void;
  removeNotification: () => void;
};

export type LanguageContextType = {
  languageContext: string;
  setLanguageContext: (language: string) => void;
};

export type LearningPairContextType = {
  learningPair: LearningPair;
  setLearningPair: (pair: LearningPair) => void;
};

export type OneStat = {
  word: string;
  translation: string;
};

export type Stats = {
  id: number;
  stat: OneStat[];
};

export type ThemeContextType = {
  themeContext: string;
  setThemeContext: (theme: string) => void;
};
