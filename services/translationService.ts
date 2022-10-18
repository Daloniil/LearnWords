import { axiosInstanceEn, axiosInstanceRu } from "../custom-axios";
import { Translation } from "../Interfaces/translation/translation";
import { TranslationResult } from "../Interfaces/translation/translationResult";

export class TranslationService {
  static translate(data: Translation[], lang: string) {
    if (lang === "en") {
      return axiosInstanceEn.post<TranslationResult>("/translate", data);
    }
    return axiosInstanceRu.post<TranslationResult>("/translate", data);
  }
}
