/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL:'https://text-translator2.p.rapidapi.com/'
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
