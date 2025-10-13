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
      },
    ];
  },
  images: {
    domains: ["cdn.edujin.co.kr"],
    remotePatterns: [
      // 로컬 개발환경
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/images/**",
      },
      // AWS S3 - 배포환경
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
      },
      // 테스트용
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
