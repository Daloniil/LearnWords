import {axiosInstance} from "../custom-axios";
import {Translation} from "../Interfaces/translation/translation";
import {TranslationResult} from "../Interfaces/translation/translationResult";
import {PairConfig} from "../utils/learningPair";

export class TranslationService {
    static translate(data: Translation[], sourceLang: string, targetLang: string) {
        const encodedParams = new URLSearchParams();
        encodedParams.append("source_language", sourceLang);
        encodedParams.append("target_language", targetLang);
        encodedParams.append("text", data[0].Text);

        return axiosInstance.post<TranslationResult>("/translate", encodedParams);
    }

    static translateFromConfig(
        data: Translation[],
        config: PairConfig,
        inputLang: "source" | "target"
    ) {
        const sourceLang = inputLang === "source" ? config.sourceLang : config.targetLang;
        const targetLang = inputLang === "source" ? config.targetLang : config.sourceLang;
        return this.translate(data, sourceLang, targetLang);
    }
}
