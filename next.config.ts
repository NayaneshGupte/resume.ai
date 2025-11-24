import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disable SSR for pages using client-only libraries
  experimental: {
    clientRouterFilter: true,
  },
  // Turbopack configuration for Next.js 16+
  turbopack: {
    resolveAlias: {
      canvas: './empty-module.ts',
    },
  },
  // Disable React strict mode to avoid double rendering issues
  reactStrictMode: false,
};

export default nextConfig;
