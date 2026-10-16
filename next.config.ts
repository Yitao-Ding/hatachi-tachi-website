import type { NextConfig } from "next";
import path from "node:path";

// 2026-10-16 から Cloudflare Workers (静的アセット) で配信している。`next build` で out/ に静的ファイルを書き出し、
// wrangler.jsonc がそのフォルダをそのまま公開する。サーバーは動かない。
// 静的書き出しでは next.config の headers() / redirects() が使えないので、
// セキュリティヘッダは public/_headers に置いている (理由と見方は docs/security.md)。
const nextConfig: NextConfig = {
  output: "export",
  turbopack: {
    // 親ディレクトリの package-lock.json 等に引きずられないよう workspace root を固定する
    root: path.resolve("."),
  },
  images: {
    // microCMS (imgix) の URL パラメータで最適化するカスタムローダー。静的画像は事前 WebP 化してそのまま返す。
    // カスタムローダー使用時は remotePatterns / deviceSizes は評価されないため書かない。
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
};

export default nextConfig;
