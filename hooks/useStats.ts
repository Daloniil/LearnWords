import { useContext } from "react";
import { StatsContext } from "../providers/StatsProvider";

export const useStats = () => {
  const { stats, addWord, addStats, deleteStats } = useContext(StatsContext);

  return {
    stats,
    addWord,
    addStats,
    deleteStats,
  };
};
