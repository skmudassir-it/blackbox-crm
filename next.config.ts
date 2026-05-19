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
        destination: "http://api-blackbox-crm.207.180.245.89.nip.io/api/:path*",
      },
    ];
  },
};

export default nextConfig;
