import { AI_CONFIG, AI_FETCH_HEADERS } from "../services/aiConfig";

const PREFERRED_VOICE_NAMES = [
  /milena/i,
  /katya/i,
  /ekaterina/i,
  /tanya/i,
  /irina/i,
  /natalia/i,
  /yandex/i,
  /google.*рус/i,
  /microsoft.*irina/i,
  /microsoft.*russian/i,
];

let cachedVoice: SpeechSynthesisVoice | null | undefined;
let currentAudio: HTMLAudioElement | null = null;

const pickRussianVoice = (): SpeechSynthesisVoice | null => {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return null;
  }

  if (cachedVoice !== undefined) {
    return cachedVoice;
  }

  const voices = window.speechSynthesis.getVoices();
  const russian = voices.filter((voice) =>
    voice.lang.toLowerCase().startsWith("ru")
  );

  for (const pattern of PREFERRED_VOICE_NAMES) {
    const match = russian.find((voice) => pattern.test(voice.name));
    if (match) {
      cachedVoice = match;
      return match;
    }
  }

  cachedVoice =
    russian.find((voice) => voice.localService) || russian[0] || null;
  return cachedVoice;
};

export const warmUpSpeechVoices = () => {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  const refresh = () => {
    cachedVoice = undefined;
    pickRussianVoice();
  };

  refresh();
  window.speechSynthesis.onvoiceschanged = refresh;
};

const speakWithBrowser = (text: string) =>
  new Promise<void>((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ru-RU";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voice = pickRussianVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || "ru-RU";
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });

const speakWithLocalTts = async (
  text: string,
  language = "ru",
  foreignLanguage?: string
) => {
  const response = await fetch(AI_CONFIG.ttsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...AI_FETCH_HEADERS,
    },
    body: JSON.stringify({
      input: text,
      language,
      foreign_language: foreignLanguage || undefined,
    }),
  });

  if (!response.ok) {
    throw new Error(`TTS error ${response.status}`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  await new Promise<void>((resolve, reject) => {
    const audio = new Audio(url);
    currentAudio = audio;
    audio.onended = () => {
      URL.revokeObjectURL(url);
      if (currentAudio === audio) currentAudio = null;
      resolve();
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      if (currentAudio === audio) currentAudio = null;
      reject(new Error("Audio playback failed"));
    };
    audio.play().catch(reject);
  });
};

export const speakRussian = async (
  text: string,
  language = "ru",
  foreignLanguage?: string
) => {
  stopSpeaking();
  try {
    await speakWithLocalTts(text, language, foreignLanguage);
  } catch {
    await speakWithBrowser(text);
  }
};

export const stopSpeaking = () => {
  if (typeof window !== "undefined") {
    window.speechSynthesis?.cancel();
  }
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
  }
};
