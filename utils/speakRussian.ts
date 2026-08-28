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

const prepareAudioElement = (audio: HTMLAudioElement) => {
  audio.setAttribute("playsinline", "true");
  audio.setAttribute("webkit-playsinline", "true");
  (audio as HTMLAudioElement & { playsInline?: boolean }).playsInline = true;
  audio.preload = "auto";
};

const playBlobWithWebAudio = async (blob: Blob) => {
  const Ctor =
    window.AudioContext ||
    (
      window as Window & {
        webkitAudioContext?: typeof AudioContext;
      }
    ).webkitAudioContext;
  if (!Ctor) {
    throw new Error("Web Audio unavailable");
  }

  const ctx = new Ctor();
  try {
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await new Promise<AudioBuffer>((resolve, reject) => {
      let settled = false;
      const ok = (buffer: AudioBuffer) => {
        if (settled) return;
        settled = true;
        resolve(buffer);
      };
      const fail = (error?: DOMException | string) => {
        if (settled) return;
        settled = true;
        reject(error || new Error("decodeAudioData failed"));
      };
      try {
        const maybePromise = ctx.decodeAudioData(
          arrayBuffer.slice(0),
          ok,
          fail
        ) as Promise<AudioBuffer> | void;
        if (maybePromise && typeof maybePromise.then === "function") {
          maybePromise.then(ok, fail);
        }
      } catch (error) {
        fail(error as DOMException);
      }
    });

    await new Promise<void>((resolve, reject) => {
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => resolve();
      try {
        source.start(0);
      } catch (error) {
        reject(error);
      }
    });
  } finally {
    try {
      await ctx.close();
    } catch {
      // ignore
    }
  }
};

const playBlobWithHtmlAudio = async (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  await new Promise<void>((resolve, reject) => {
    const audio = new Audio();
    prepareAudioElement(audio);
    audio.src = url;
    currentAudio = audio;

    const finish = () => {
      URL.revokeObjectURL(url);
      if (currentAudio === audio) currentAudio = null;
    };

    audio.onended = () => {
      finish();
      resolve();
    };
    audio.onerror = () => {
      finish();
      reject(new Error("Audio playback failed"));
    };
    audio.play().catch((error) => {
      finish();
      reject(error);
    });
  });
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

  // Prefer a fresh Web Audio context — more reliable on iOS after mic use.
  try {
    await playBlobWithWebAudio(blob);
  } catch {
    await playBlobWithHtmlAudio(blob);
  }
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
    currentAudio.removeAttribute("src");
    currentAudio.load();
    currentAudio = null;
  }
};
