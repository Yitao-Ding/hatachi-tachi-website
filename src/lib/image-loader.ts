"use client";

import type { ImageLoaderProps } from "next/image";

/*
 * microCMS の画像は imgix なので、URL パラメータでリサイズと WebP 変換ができる。
 * Vercel の画像最適化 (無料枠が小さい) を通さずに配信するためのカスタムローダー。
 *
 * /public の静的画像はビルド前に WebP 圧縮して置く前提なので、そのまま返す。
 * ここで width ごとに別URLを返せないため srcset は同じファイルを指すが、
 * 事前圧縮済みの画像に対しては実害が無い。
 */
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
