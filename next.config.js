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
}

module.exports = nextConfig
