/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: "https://text-translator2.p.rapidapi.com/",
    NEXT_PUBLIC_AI_BASE_URL: "https://percental-quinn-wizardly.ngrok-free.dev",
    NEXT_PUBLIC_LLM_BASE_URL:
      "https://percental-quinn-wizardly.ngrok-free.dev/v1",
    NEXT_PUBLIC_LLM_MODEL: "qwen2.5-14b-instruct-mlx",
    NEXT_PUBLIC_WHISPER_URL:
      "https://percental-quinn-wizardly.ngrok-free.dev/v1/audio/transcriptions",
    NEXT_PUBLIC_TTS_URL:
      "https://percental-quinn-wizardly.ngrok-free.dev/v1/audio/speech",
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/enter",
        permanent: true,
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
