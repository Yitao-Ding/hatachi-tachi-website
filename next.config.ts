import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root so a stray ~/package-lock.json doesn't fool Turbopack.
    root: path.resolve("."),
  },
  images: {
    // microCMS 画像は imgix パラメータを直接付けて配信し、Vercel の画像最適化枠を使わない。
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    remotePatterns: [
      { protocol: "https", hostname: "images.microcms-assets.io" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
