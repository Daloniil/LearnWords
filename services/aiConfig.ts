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
};

/** Bypass ngrok free interstitial when calling the tunnel from the browser. */
export const AI_FETCH_HEADERS: Record<string, string> = {
  "ngrok-skip-browser-warning": "1",
};
