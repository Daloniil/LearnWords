import { FoldersType } from "../Interfaces/ProvidersInterface";
import { LearningPair } from "../utils/learningPair";

const CACHE_PREFIX = "app-folders-cache";

export const FOLDERS_CACHE_TTL_MS = 5 * 60 * 1000;

type CachedFolders = {
  folders: FoldersType[];
  fetchedAt: number;
  uid: string;
  pair: LearningPair;
};

export class FoldersCacheService {
  private static key(uid: string, pair: LearningPair) {
    return `${CACHE_PREFIX}:${uid}:${pair}`;
  }

  public static get(uid: string, pair: LearningPair): CachedFolders | null {
    try {
      const raw = localStorage.getItem(this.key(uid, pair));
      if (!raw) return null;
      const parsed = JSON.parse(raw) as CachedFolders;
      if (parsed.uid !== uid || parsed.pair !== pair) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  public static set(uid: string, pair: LearningPair, folders: FoldersType[]) {
    const entry: CachedFolders = {
      folders,
      fetchedAt: Date.now(),
      uid,
      pair,
    };
    localStorage.setItem(this.key(uid, pair), JSON.stringify(entry));
  }

  public static isFresh(entry: CachedFolders) {
    return Date.now() - entry.fetchedAt < FOLDERS_CACHE_TTL_MS;
  }

  public static clear(uid: string, pair?: LearningPair) {
    if (pair) {
      localStorage.removeItem(this.key(uid, pair));
      return;
    }

    Object.keys(localStorage)
      .filter((key) => key.startsWith(`${CACHE_PREFIX}:${uid}:`))
      .forEach((key) => localStorage.removeItem(key));
  }
}
