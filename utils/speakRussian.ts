import { AI_CONFIG, aiFetch } from "../services/aiConfig";

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
let unlockCtx: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;
let currentPlaybackCtx: AudioContext | null = null;

const getAudioContextCtor = () => {
  if (typeof window === "undefined") return null;
  return (
    window.AudioContext ||
    (
      window as Window & {
        webkitAudioContext?: typeof AudioContext;
      }
    ).webkitAudioContext ||
    null
  );
};

const withTimeout = <T,>(promise: Promise<T>, ms: number, label: string) =>
  new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);
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

/** Call from a user tap (Start). Unlocks iOS Safari audio playback. Never blocks long. */
export const unlockAudioSession = async () => {
  if (typeof window === "undefined") return;

  const run = async () => {
    const Ctor = getAudioContextCtor();
    if (Ctor) {
      if (!unlockCtx || unlockCtx.state === "closed") {
        unlockCtx = new Ctor();
      }
      if (unlockCtx.state === "suspended") {
        await unlockCtx.resume().catch(() => undefined);
      }
      try {
        const buffer = unlockCtx.createBuffer(1, 1, 22050);
        const source = unlockCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(unlockCtx.destination);
        source.start(0);
      } catch {
        // ignore
      }
    }

    try {
      const silent = new Audio(
        "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA="
      );
      silent.volume = 0.01;
      (silent as HTMLAudioElement & { playsInline?: boolean }).playsInline = true;
      await Promise.race([
        silent.play().catch(() => undefined),
        new Promise<void>((resolve) => setTimeout(resolve, 200)),
      ]);
      silent.pause();
    } catch {
      // ignore
    }
  };

  await Promise.race([
    run(),
    new Promise<void>((resolve) => setTimeout(resolve, 400)),
  ]);
};

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

      // iOS sometimes never fires onend.
      const approxMs = Math.min(20000, Math.max(2500, text.length * 80));
      setTimeout(() => resolve(), approxMs);
    }),
    25000,
    "browser-tts"
  );

const prepareAudioElement = (audio: HTMLAudioElement) => {
  audio.setAttribute("playsinline", "true");
  audio.setAttribute("webkit-playsinline", "true");
  (audio as HTMLAudioElement & { playsInline?: boolean }).playsInline = true;
  audio.preload = "auto";
};

const playBlobWithHtmlAudio = async (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  try {
    await withTimeout(
      new Promise<void>((resolve, reject) => {
        const audio = new Audio();
        prepareAudioElement(audio);
        audio.src = url;
        currentAudio = audio;

        let settled = false;
        const finishOk = () => {
          if (settled) return;
          settled = true;
          resolve();
        };
        const finishErr = (error: Error) => {
          if (settled) return;
          settled = true;
          reject(error);
        };

        audio.onended = finishOk;
        audio.onerror = () => finishErr(new Error("Audio playback failed"));
        audio.onloadedmetadata = () => {
          // Fallback if onended never fires (common on iOS).
          const durationMs = Number.isFinite(audio.duration)
            ? Math.ceil(audio.duration * 1000) + 400
            : 15000;
          setTimeout(finishOk, durationMs);
        };

        audio.play().catch(finishErr);
      }),
      45000,
      "html-audio"
    );
  } finally {
    URL.revokeObjectURL(url);
    if (currentAudio) {
      currentAudio = null;
    }
  }
};

const speakWithLocalTts = async (
  text: string,
  language = "ru",
  foreignLanguage?: string
) => {
  const response = await aiFetch(
    AI_CONFIG.ttsUrl,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: text,
        language,
        foreign_language: foreignLanguage || undefined,
      }),
    },
    AI_CONFIG.ttsTimeoutMs
  );

  if (!response.ok) {
    throw new Error(`TTS error ${response.status}`);
  }

  const blob = await response.blob();
  // Silero returns mp3 — iOS WebAudio often can't decode it and hangs.
  // Always prefer HTMLAudioElement for TTS playback.
  await playBlobWithHtmlAudio(blob);
};

export const speakRussian = async (
  text: string,
  language = "ru",
  foreignLanguage?: string
) => {
  stopSpeaking();
  try {
    await withTimeout(
      speakWithLocalTts(text, language, foreignLanguage),
      AI_CONFIG.ttsTimeoutMs + 10_000,
      "speakRussian"
    );
  } catch {
    try {
      await speakWithBrowser(text);
    } catch {
      // Never block the dialogue UI on TTS failure.
    }
  }
};

export const stopSpeaking = () => {
  if (typeof window !== "undefined") {
    window.speechSynthesis?.cancel();
  }
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.removeAttribute("src");
      currentAudio.load();
    } catch {
      // ignore
    }
    currentAudio = null;
  }
  if (currentSource) {
    try {
      currentSource.stop();
    } catch {
      // ignore
    }
    currentSource = null;
  }
  if (currentPlaybackCtx) {
    void currentPlaybackCtx.close().catch(() => undefined);
    currentPlaybackCtx = null;
  }
};
