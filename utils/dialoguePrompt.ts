import { Word } from "../Interfaces/ProvidersInterface";
import { AI_CONFIG } from "../services/aiConfig";
import { LearningPair, PairConfig } from "./learningPair";

const shuffleCopy = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const pickPracticeWords = (words: Word[]): Word[] => {
  if (words.length <= AI_CONFIG.maxWordsInPrompt) {
    return words;
  }
  return shuffleCopy(words).slice(0, AI_CONFIG.maxWordsInPrompt);
};

export const buildDictionaryLines = (words: Word[]): string =>
  words.map((item) => `${item.word} — ${item.correctTranslation}`).join("\n");

export const buildWelcomeText = (pairConfig: PairConfig): string => {
  const sourceLabel =
    pairConfig.sourceLang === "es" ? "испанским" : "английским";

  return [
    "Привет! Я твой голосовой репетитор.",
    `Сейчас мы потренируем слова из твоего словаря: ${sourceLabel} и русским.`,
    "Я буду задавать короткие вопросы, а ты отвечай голосом.",
    "Когда будешь готов — нажми микрофон.",
  ].join(" ");
};

export const buildDialogueSystemPrompt = (
  words: Word[],
  pairConfig: PairConfig
): string => {
  const sourceLabel =
    pairConfig.sourceLang === "es" ? "испанский" : "английский";
  const dictionary = buildDictionaryLines(words);

  return [
    "Ты дружелюбный голосовой репетитор для практики слов.",
    `Студент учит: ${sourceLabel} и русский.`,
    "Отвечай студенту по-русски полноценными фразами.",
    "В каждом ответе: коротко оцени предыдущий ответ (если был) и задай один новый вопрос по слову из словаря.",
    "Длина ответа: 1–3 предложения, удобно для озвучки.",
    "Не повторяй инструкции. Не пиши служебные фразы вроде «язык ответа» или «только русский».",
    "Не используй markdown, списки и эмодзи.",
    "Пример хорошего ответа: Привет! Давай начнём. Как по-русски будет gently?",
    "",
    "Словарь для практики:",
    dictionary,
  ].join("\n");
};

export const buildFirstQuestionUserPrompt = (pair: LearningPair): string => {
  const source = pair === "es-ru" ? "испанский" : "английский";
  return `Задай первый простой вопрос по одному слову из словаря. Спроси перевод на ${source} или на русский. Ответь 1–2 предложениями.`;
};

export const buildContinueUserPrompt = (userText: string): string =>
  `Ответ студента: ${userText}\nКоротко отреагируй и задай следующий вопрос по другому слову из словаря.`;
