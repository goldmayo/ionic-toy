import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@ionic/react', '@ionic/core'],
  output: 'export'
};

export default nextConfig;
