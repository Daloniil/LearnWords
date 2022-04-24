import React, { useState, useCallback } from "react";
import { Stats, StatsContextType } from "../Interfaces/ProvidersInterface";
import { ContextKey } from "../services/localKey";
import { LocalStorageService } from "../services/localStorageService";

export const StatsContext = React.createContext<StatsContextType>({
  stats: [{ id: 0, stat: [] }],
  addWord: () => {},
  addStats: () => {},
  deleteStats: () => {},
});

const appGetStats = (key: string): Stats[] => {
  return LocalStorageService.getItem<Stats[]>(key) ?? [];
};

export const StatsProvider: React.FC = ({ children }) => {
  const [stats, setStats] = useState(appGetStats(ContextKey.STATS));

  const handleAddWord = (word: string, translation: string) => {
    LocalStorageService.addWordStats(word, translation, ContextKey.STATS);
    setStats(appGetStats(ContextKey.STATS));
  };

  const handleAddStats = () => {
    LocalStorageService.addStats(ContextKey.STATS);
    setStats(appGetStats(ContextKey.STATS));
  };

  const handleDeleteStats = (id: number) => {
    LocalStorageService.deleteStats(id, ContextKey.STATS);
    setStats(appGetStats(ContextKey.STATS));
  };

  const value = {
    stats,
    addWord: useCallback(
      (word: string, translation: string) => handleAddWord(word, translation),
      []
    ),
    addStats: useCallback(() => handleAddStats(), []),
    deleteStats: useCallback((id: number) => handleDeleteStats(id), []),
  };

  return (
    <StatsContext.Provider value={value}>{children}</StatsContext.Provider>
  );
};
