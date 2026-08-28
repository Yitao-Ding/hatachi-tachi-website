"use client";

import type { ImageLoaderProps } from "next/image";

// microCMS (imgix) は URL パラメータでリサイズ・WebP 変換できるので、
// Vercel の画像最適化を通さずに配信する。静的 /public 画像は事前圧縮済みをそのまま返す。
export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
  if (src.startsWith("https://images.microcms-assets.io")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("fm", "webp");
    url.searchParams.set("q", String(quality ?? 75));
    return url.toString();
  }
  return src;
}
