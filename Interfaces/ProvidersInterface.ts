import { LearningPair } from "../utils/learningPair";

export type WordsContextType = {
  sourceWords: Word[];
  targetWords: Word[];
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
