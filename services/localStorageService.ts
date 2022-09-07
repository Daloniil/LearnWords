import { Auth, Stats, Word } from "../Interfaces/ProvidersInterface";
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

  public static setPercentTest(value: number, session = false) {
    const storage = session ? sessionStorage : localStorage;
    storage.setItem(ContextKey.PERCENT, JSON.stringify(value));
  }

  public static setLanguage(value: string, session = false) {
    const storage = session ? sessionStorage : localStorage;
    storage.setItem(ContextKey.LANGUAGE, JSON.stringify(value));
  }

  public static setTheme(theme: string, key: ItemType, session = false) {
    const storage = session ? sessionStorage : localStorage;
    storage.setItem(key, JSON.stringify(theme));
  }

  public static setAuth(auth: Auth, session = false) {
    const storage = session ? sessionStorage : localStorage;
    storage.setItem(ContextKey.AUTH, JSON.stringify(auth));
  }

  public static removeAuth(session = false) {
    const storage = session ? sessionStorage : localStorage;
    storage.setItem(ContextKey.AUTH, JSON.stringify({}));
  }
}
