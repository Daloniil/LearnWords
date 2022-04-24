/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL:'https://microsoft-translator-text.p.rapidapi.com'
  },async redirects() {
    return [
      {
        source: '/',
        destination: '/enter',
        permanent: true,
      }, 
    ]
  },
}

module.exports = nextConfig
