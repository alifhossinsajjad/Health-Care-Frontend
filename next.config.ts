import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async rewrites() {
    const target =
      process.env.IS_DOCKER === "true" && process.env.INTERNAL_API_BASE_URL
        ? process.env.INTERNAL_API_BASE_URL
        : process.env.NEXT_PUBLIC_API_BASE_URL ||
          process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost/api/v1";

    return [
      {
        source: "/api/v1/:path*",
        destination: `${target}/:path*`,
      },
    ];
  },
};

export default nextConfig;
