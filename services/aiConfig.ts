export const AI_CONFIG = {
  // All AI traffic goes through local whisper-api (:8000), which proxies LLM
  // to LM Studio and sends Private Network Access headers for deployed HTTPS UIs.
  llmBaseUrl:
    process.env.NEXT_PUBLIC_LLM_BASE_URL || "http://127.0.0.1:8000/v1",
  llmModel:
    process.env.NEXT_PUBLIC_LLM_MODEL || "qwen2.5-14b-instruct-mlx",
  whisperUrl:
    process.env.NEXT_PUBLIC_WHISPER_URL ||
    "http://127.0.0.1:8000/v1/audio/transcriptions",
  ttsUrl:
    process.env.NEXT_PUBLIC_TTS_URL || "http://127.0.0.1:8000/v1/audio/speech",
  maxWordsInPrompt: 80,
  maxReplyTokens: 400,
};
