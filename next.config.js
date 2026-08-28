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
    NEXT_PUBLIC_LLM_BASE_URL: "http://127.0.0.1:1234/v1",
    NEXT_PUBLIC_LLM_MODEL: "qwen2.5-14b-instruct-mlx",
    NEXT_PUBLIC_WHISPER_URL:
      "http://127.0.0.1:8000/v1/audio/transcriptions",
    NEXT_PUBLIC_TTS_URL: "http://127.0.0.1:8000/v1/audio/speech",
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
