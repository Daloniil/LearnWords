import { Word } from "../Interfaces/ProvidersInterface";
import { LearningPair } from "../utils/learningPair";

const CACHE_PREFIX = "app-words-cache";

export const WORDS_CACHE_TTL_MS = 5 * 60 * 1000;

type CachedWords = {
  words: Word[];
  fetchedAt: number;
  uid: string;
  pair: LearningPair;
};

export class WordsCacheService {
  private static key(uid: string, pair: LearningPair) {
    return `${CACHE_PREFIX}:${uid}:${pair}`;
  }

  public static get(uid: string, pair: LearningPair): CachedWords | null {
    try {
      const raw = localStorage.getItem(this.key(uid, pair));
      if (!raw) return null;
      const parsed = JSON.parse(raw) as CachedWords;
      if (parsed.uid !== uid || parsed.pair !== pair) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  public static set(uid: string, pair: LearningPair, words: Word[]) {
    const entry: CachedWords = {
      words,
      fetchedAt: Date.now(),
      uid,
      pair,
    };
    localStorage.setItem(this.key(uid, pair), JSON.stringify(entry));
  }

  public static isFresh(entry: CachedWords) {
    return Date.now() - entry.fetchedAt < WORDS_CACHE_TTL_MS;
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
