import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    PORT: process.env.NEXT_PUBLIC_PORT || '3001'
  },
};

export default nextConfig;
