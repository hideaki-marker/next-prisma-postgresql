import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    appIsrStatus: false, // これで左上の「N」アイコンが消えます
  },
};

export default nextConfig;
