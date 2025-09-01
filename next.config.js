/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NODE_ENV === 'production' 
      ? 'https://github-meeting-webhook.vercel.app'
      : 'http://localhost:3001'
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? 'https://github-meeting-webhook.vercel.app/api/:path*'
          : 'http://localhost:3001/api/:path*'
      }
    ]
  }
}

module.exports = nextConfig