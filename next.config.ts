import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    // 親ディレクトリの package-lock.json 等に引きずられないよう workspace root を固定する
    root: path.resolve("."),
  },
  images: {
    // microCMS (imgix) の URL パラメータで最適化するので Vercel の画像最適化は通さない。
    // カスタムローダー使用時は remotePatterns / deviceSizes は評価されないため書かない。
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
};

export default nextConfig;
