import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML/JS/CSS in out/, served from S3 + CloudFront (no Node server)
  output: "export",
  // The default image optimizer needs a server; images are served as-is
  images: { unoptimized: true },
  experimental: {
    agentUpgrade: "security",
  },
  // No cacheComponents / partialPrefetching: both turn on Partial Prerendering,
  // which needs a server ("PPR cannot be enabled in export mode")
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;