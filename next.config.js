/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // iOS Safari + Workbox often swallows cross-origin AI POSTs (ngrok).
  // Force network-only so chat/TTS/STT never hit the service worker cache.
  runtimeCaching: [
    {
      urlPattern: ({ url }) =>
        /ngrok/i.test(url.hostname) ||
        url.pathname.startsWith("/v1/") ||
        url.pathname.includes("/audio/") ||
        url.pathname.includes("/chat/"),
      handler: "NetworkOnly",
      method: "GET",
    },
    {
      urlPattern: ({ url }) =>
        /ngrok/i.test(url.hostname) ||
        url.pathname.startsWith("/v1/") ||
        url.pathname.includes("/audio/") ||
        url.pathname.includes("/chat/"),
      handler: "NetworkOnly",
      method: "POST",
    },
    {
      urlPattern: ({ url }) =>
        url.hostname === "127.0.0.1" || url.hostname === "localhost",
      handler: "NetworkOnly",
    },
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
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
