import { AI_CONFIG, AI_FETCH_HEADERS } from "./aiConfig";

type TranscribeOptions = {
  language?: string | null;
  prompt?: string;
};

export const transcribeAudio = async (
  blob: Blob,
  languageOrOptions?: string | TranscribeOptions
): Promise<string> => {
  const options: TranscribeOptions =
    typeof languageOrOptions === "string" || languageOrOptions == null
      ? { language: languageOrOptions ?? undefined }
      : languageOrOptions;

  const form = new FormData();
  const extension = blob.type.includes("mp4")
    ? "mp4"
    : blob.type.includes("mpeg")
    ? "mp3"
    : blob.type.includes("wav")
    ? "wav"
    : "webm";

  form.append("file", blob, `speech.${extension}`);
  form.append("model", "whisper-1");

  // Omit language for mixed RU + EN/ES speech so Whisper keeps Latin words.
  if (options.language) {
    form.append("language", options.language);
  }
  if (options.prompt) {
    form.append("prompt", options.prompt);
  }

  const response = await fetch(AI_CONFIG.whisperUrl, {
    method: "POST",
    headers: AI_FETCH_HEADERS,
    body: form,
  });

  if (!response.ok) {
    let detail = `Whisper error ${response.status}`;
    try {
      const data = await response.json();
      detail = data.detail || data.error || detail;
    } catch {
      // ignore parse errors
    }
    throw new Error(detail);
  }

  const data = await response.json();
  const text = (data.text || "").trim();
  if (!text) {
    throw new Error("Empty transcription");
  }
  return text;
};

export const buildMixedSpeechPrompt = (
  sourceWords: string[],
  sourceLang: "en" | "es"
) => {
  const samples = sourceWords.filter(Boolean).slice(0, 40).join(", ");
  const langName = sourceLang === "es" ? "Spanish" : "English";
  return [
    "The student mostly speaks Russian.",
    `Answers may include ${langName} vocabulary words mixed into Russian sentences.`,
    "Keep Latin-script words in Latin letters, do not transliterate them into Cyrillic.",
    samples ? `Dictionary words that may appear: ${samples}.` : "",
  ]
    .filter(Boolean)
    .join(" ");
};
