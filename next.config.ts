import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
  env: {
    HOSTAWAY_API_KEY: process.env.HOSTAWAY_API_KEY,
    HOSTAWAY_ACCOUNT_ID: process.env.HOSTAWAY_ACCOUNT_ID,
  },
};

export default nextConfig;
