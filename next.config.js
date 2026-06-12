/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/images/**',
      },
      {
        pathname: '/images/ivangbbb-fatrap-30.png',
      },
    ],
  },
  // Serve the new index2.html moodboard UI at the site root ("/").
  // The old Next.js home now lives at /index3.
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/index2.html' },
      ],
    }
  },
}

module.exports = nextConfig
