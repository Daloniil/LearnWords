import {axiosInstance} from "../custom-axios";
import {Translation} from "../Interfaces/translation/translation";
import {TranslationResult} from "../Interfaces/translation/translationResult";


export class TranslationService {
    static translate(data: Translation[], lang: string) {
        const encodedParams = new URLSearchParams();
        encodedParams.append("source_language", lang === "en" ? "ru" : "en");
        encodedParams.append("target_language", lang === "ru" ? "ru" : "en");
        encodedParams.append("text", data[0].Text);

        return axiosInstance.post<TranslationResult>("/translate", encodedParams);
    }
}
