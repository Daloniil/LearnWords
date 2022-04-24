import { axiosInstance } from "../custom-axios";
import { Translation } from "../models/translation/translation";
import { TranslationResult } from "../models/translation/translationResult";

export class TranslationService {
  static translate(data: Translation[]) {
    return axiosInstance.post<TranslationResult>("/translate", data);
  }
}
