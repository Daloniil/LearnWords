import { Stats, Word } from "../Interfaces/ProvidersInterface";
import { ContextKey } from "./localKey";

type ItemType = string;

export class LocalStorageService {
  public static getItem<T>(key: ItemType) {
    try {
      let item = localStorage.getItem(key);
      item = item ?? sessionStorage.getItem(key);

      return item ? (JSON.parse(item) as T) : null;
    } catch {
      return null;
    }
  }
  public static setWord(value: Word, key: ItemType, session = false) {
    const storage = session ? sessionStorage : localStorage;
    const words = LocalStorageService.getItem<Word[]>(key) ?? [];

    value.id = words.length > 0 ? words[words.length - 1].id + 1 : 1;
    words.push(value);
    storage.setItem(key, JSON.stringify(words));
  }

  public static updateWord(value: Word, key: ItemType, session = false) {
    const storage = session ? sessionStorage : localStorage;
    const words = LocalStorageService.getItem<Word[]>(key) ?? [];
    const index = words.map((id) => id.id).indexOf(value.id);

    words[index] = value;
    storage.setItem(key, JSON.stringify(words));
  }

  public static deleteWord(id: number, key: ItemType, session = false) {
    const storage = session ? sessionStorage : localStorage;
    const words = LocalStorageService.getItem<Word[]>(key) ?? [];
    const index = words.map((id) => id.id).indexOf(id);

    words.splice(index, 1);
    storage.setItem(key, JSON.stringify(words));
  }

  public static setTestWords(value: Word[], session = false) {
    const storage = session ? sessionStorage : localStorage;
    storage.setItem(ContextKey.TEST, JSON.stringify(value));
  }
  public static setWordVariants(value: string[], session = false) {
    const storage = session ? sessionStorage : localStorage;
    storage.setItem(ContextKey.WORD, JSON.stringify(value));
  }

  public static deleteTest(session = false) {
    const storage = session ? sessionStorage : localStorage;
    storage.setItem(ContextKey.TEST, JSON.stringify([]));
    storage.setItem(ContextKey.WORD, JSON.stringify([]));
    storage.setItem(ContextKey.PERCENT, JSON.stringify(0));
  }

  public static setPercentTest(value: number, session = false) {
    const storage = session ? sessionStorage : localStorage;
    storage.setItem(ContextKey.PERCENT, JSON.stringify(value));
  }

  public static setLanguage(value: string, session = false) {
    const storage = session ? sessionStorage : localStorage;
    storage.setItem(ContextKey.LANGUAGE, JSON.stringify(value));
  }

  public static addStats(key: ItemType, session = false) {
    const storage = session ? sessionStorage : localStorage;
    const stats = LocalStorageService.getItem<Stats[]>(key) ?? [];

    const idNewStats = stats.length > 0 ? stats[stats.length - 1].id + 1 : 0;

    stats.push({ id: idNewStats, stat: [] });
    storage.setItem(key, JSON.stringify(stats));
  }

  public static addWordStats(
    word: string,
    translation: string,
    key: ItemType,
    session = false
  ) {
    const storage = session ? sessionStorage : localStorage;
    const stats = LocalStorageService.getItem<Stats[]>(key) ?? [];
    if (stats.length > 0) {
      stats[stats.length - 1].stat.push({
        word: word,
        translation: translation,
      });
    } else {
      stats.push({ id: 0, stat: [] });
    }

    storage.setItem(key, JSON.stringify(stats));
  }

  public static deleteStats(value: number, key: ItemType, session = false) {
    const storage = session ? sessionStorage : localStorage;
    const stats = LocalStorageService.getItem<Stats[]>(key) ?? [];
    const index = stats.map((id) => id.id).indexOf(value);

    stats.splice(index, 1);
    stats.map((id, index) =>
      id.id > value ? (stats[index].id = id.id - 1) : ""
    );

    storage.setItem(key, JSON.stringify(stats));
  }

  public static setTheme(theme: string, key: ItemType, session = false) {
    const storage = session ? sessionStorage : localStorage;
    storage.setItem(key, JSON.stringify(theme));
  }
}
