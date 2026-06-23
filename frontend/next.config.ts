import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.credly.com',
      },
      {
        protocol: 'https',
        hostname: 'images.credly.com',
      },
      {
        protocol: 'https',
        hostname: 'credentials.databricks.com',
      },
      {
        protocol: 'https',
        hostname: 'images.credentials.databricks.com',
      },
    ],
  },
};

export default nextConfig;
