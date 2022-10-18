export interface TranslationResult {
  data: TranslationData[];
}

export interface TranslationData {
  detectedLanguage: { language: string; score: number };
  translations: Translations[];
}

interface Translations {
  text: string;
  ro: string;
}
