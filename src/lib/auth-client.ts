import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination:
          "https://studiospace-server-ajny.onrender.com/api/auth/:path*",
      },
      {
        source: "/api/:path*",
        destination:
          "https://studiospace-server-ajny.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;