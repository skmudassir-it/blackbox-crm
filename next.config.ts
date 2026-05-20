import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // Use internal Docker Swarm DNS — faster and more reliable than going through Traefik
        destination: "http://blackbox-backend-1jindh:4000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
