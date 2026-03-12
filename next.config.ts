import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['three', 'postprocessing', '@react-three/postprocessing'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: 'scontent.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: 'instagram.com',
      },
    ],
  },
};

export default nextConfig;
