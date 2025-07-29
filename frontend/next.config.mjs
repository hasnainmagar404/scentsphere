/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd2k6fvhyk5xgx.cloudfront.net',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;