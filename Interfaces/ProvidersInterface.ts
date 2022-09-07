export type WordsContextType = {
  englishWords: Word[];
  russianWords: Word[];
  setWord: (word: Word, key: string) => void;
  updateWord: (word: Word, key: string) => void;
  deleteWord: (index: number, key: string) => void;
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

export type NotificationContextType = {
  notification: string | null;
  statusNotification: string | null;
  addNotification: (message: string, status: string) => void;
  removeNotification: () => void;
};

export type TitleContextType = {
  title: string | null;
  addTitle: (title: string) => void;
};

export type LanguageContextType = {
  languageContext: string;
  setLanguageContext: (language: string) => void;
};

export type OneStat = {
  word: string;
  translation: string;
};

export type Stats = {
  id: number;
  stat: OneStat[];
};

export type StatsContextType = {
  stats: Stats[];
  addWord: (word: string, translation: string) => void;
  addStats: () => void;
  deleteStats: (id: number) => void;
};

export type ThemeContextType = {
  themeContext: string;
  setThemeContext: (theme: string) => void;
};
