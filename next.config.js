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
