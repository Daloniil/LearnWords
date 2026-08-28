const NGROK_BASE =
  process.env.NEXT_PUBLIC_AI_BASE_URL ||
  "https://percental-quinn-wizardly.ngrok-free.dev";

export const AI_CONFIG = {
  // Public tunnel → local whisper-api (:8000), which proxies LLM to LM Studio.
  llmBaseUrl:
    process.env.NEXT_PUBLIC_LLM_BASE_URL || `${NGROK_BASE}/v1`,
  llmModel:
    process.env.NEXT_PUBLIC_LLM_MODEL || "qwen2.5-14b-instruct-mlx",
  whisperUrl:
    process.env.NEXT_PUBLIC_WHISPER_URL ||
    `${NGROK_BASE}/v1/audio/transcriptions`,
  ttsUrl:
    process.env.NEXT_PUBLIC_TTS_URL || `${NGROK_BASE}/v1/audio/speech`,
  maxWordsInPrompt: 80,
  maxReplyTokens: 400,
  llmTimeoutMs: 90_000,
  whisperTimeoutMs: 60_000,
  ttsTimeoutMs: 60_000,
};

/** Bypass ngrok free interstitial when calling the tunnel from the browser. */
export const AI_FETCH_HEADERS: Record<string, string> = {
  "ngrok-skip-browser-warning": "1",
};

export const aiFetch = async (
  input: string,
  init: RequestInit = {},
  timeoutMs = 60_000
) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = new Headers(init.headers || {});
    Object.entries(AI_FETCH_HEADERS).forEach(([key, value]) => {
      if (!headers.has(key)) headers.set(key, value);
    });

    return await fetch(input, {
      ...init,
      headers,
      cache: "no-store",
      credentials: "omit",
      mode: "cors",
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`AI request timed out after ${Math.round(timeoutMs / 1000)}s`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
};
