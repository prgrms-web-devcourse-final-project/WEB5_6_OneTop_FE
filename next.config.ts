import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://localhost:8080/api/v1/:path*",
      },
      {
        source: "/oauth2/authorization/:path*",
        destination: "http://localhost:8080/oauth2/authorization/:path*",
      }
    ];
  },
  images: {
    domains: [
      'cdn.edujin.co.kr'
    ],
  },
};

export default nextConfig;
