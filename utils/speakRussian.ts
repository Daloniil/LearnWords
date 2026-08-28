import { AI_CONFIG, aiFetch } from "../services/aiConfig";
import { isIOSDevice } from "./isIOS";
import { voiceSession } from "./voiceSession";

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

export type SpeakResult = { ok: true } | { ok: false; blob: Blob; text: string };

const withTimeout = <T,>(promise: Promise<T>, ms: number) =>
  new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });

export const unlockAudioSession = async () => {
  // Prefer the shared session when available.
  if (voiceSession.isReady) {
    return;
  }
};

export const reclaimPlaybackSession = () => {
  // No-op: shared AudioContext handles reclaim.
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

const pickRussianVoice = (): SpeechSynthesisVoice | null => {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  if (cachedVoice !== undefined) return cachedVoice;
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

const speakWithBrowser = (text: string) =>
  withTimeout(
    new Promise<void>((resolve) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        resolve();
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ru-RU";
      utterance.rate = 0.9;
      const voice = pickRussianVoice();
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || "ru-RU";
      }
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve();
      };
      utterance.onend = finish;
      utterance.onerror = finish;
      window.speechSynthesis.speak(utterance);
      setTimeout(finish, Math.min(20000, Math.max(2500, text.length * 80)));
    }),
    25000
  );

const playHtmlAudio = async (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  try {
    await withTimeout(
      new Promise<void>((resolve, reject) => {
        const audio = new Audio();
        audio.setAttribute("playsinline", "true");
        (audio as HTMLAudioElement & { playsInline?: boolean }).playsInline =
          true;
        audio.src = url;
        currentAudio = audio;
        let settled = false;
        const ok = () => {
          if (settled) return;
          settled = true;
          resolve();
        };
        audio.onended = ok;
        audio.onerror = () => reject(new Error("Audio playback failed"));
        audio.onloadedmetadata = () => {
          const ms = Number.isFinite(audio.duration)
            ? Math.ceil(audio.duration * 1000) + 400
            : 15000;
          setTimeout(ok, ms);
        };
        audio.play().catch(reject);
      }),
      45000
    );
  } finally {
    URL.revokeObjectURL(url);
    currentAudio = null;
  }
};

const fetchTtsBlob = async (
  text: string,
  language = "ru",
  foreignLanguage?: string
) => {
  // WAV + shared AudioContext is the only reliable path after mic on iOS.
  const audioFormat = isIOSDevice() || voiceSession.isReady ? "wav" : "mp3";
  const response = await aiFetch(
    AI_CONFIG.ttsUrl,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: text,
        language,
        foreign_language: foreignLanguage || undefined,
        audio_format: audioFormat,
      }),
    },
    AI_CONFIG.ttsTimeoutMs
  );
  if (!response.ok) {
    throw new Error(`TTS error ${response.status}`);
  }
  return response.blob();
};

export const playSpeechBlob = async (blob: Blob) => {
  if (voiceSession.isReady) {
    await voiceSession.playBlob(blob);
    return;
  }
  await playHtmlAudio(blob);
};

export const speakRussian = async (
  text: string,
  language = "ru",
  foreignLanguage?: string
): Promise<SpeakResult> => {
  stopSpeaking();
  try {
    const blob = await fetchTtsBlob(text, language, foreignLanguage);
    try {
      if (voiceSession.isReady) {
        await voiceSession.playBlob(blob);
      } else {
        await playHtmlAudio(blob);
      }
      return { ok: true };
    } catch {
      return { ok: false, blob, text };
    }
  } catch {
    try {
      await speakWithBrowser(text);
      return { ok: true };
    } catch {
      return { ok: false, blob: new Blob(), text };
    }
  }
};

export const stopSpeaking = () => {
  if (typeof window !== "undefined") {
    window.speechSynthesis?.cancel();
  }
  voiceSession.stopSpeaking();
  if (currentAudio) {
    try {
      currentAudio.pause();
    } catch {
      // ignore
    }
    currentAudio = null;
  }
};
