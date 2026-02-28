import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['three', 'postprocessing', '@react-three/postprocessing'],
};

export default nextConfig;
