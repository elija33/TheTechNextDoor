import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  // Standalone output produces a minimal Node bundle that Railway can run efficiently.
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.thetechnextdoors.com";
    // Strip trailing /api so rewrites map /api/* to backend root.
    const target = backend.replace(/\/api\/?$/, "");
    return [
      { source: "/api/:path*", destination: `${target}/api/:path*` },
    ];
  },
};

export default config;
