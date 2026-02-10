import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    appIsrStatus: false, // これで左上の「N」アイコンが消えます
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // 1MB制限を10MBに引き上げ
    },
  },
  //minIoの画像表示の設定
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/restaurant-photos/**",
      },
    ],
  },
};

export default nextConfig;
