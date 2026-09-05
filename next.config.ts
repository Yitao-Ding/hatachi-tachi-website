import type { NextConfig } from "next";
import path from "node:path";

const isDev = process.env.NODE_ENV === "development";

/*
 * Content-Security-Policy (2026-09-05 整備)。
 *
 * 2本に分けている。ブラウザは enforce と Report-Only を独立に評価する。
 *
 * 1. enforce: 今日から壊れようがない3つだけ。サイトに <object> も <base> も無く、
 *    他サイトの iframe に埋め込まれる用途も無い (X-Frame-Options: DENY と同じ効果)。
 *    ※ もし Notion 等に公式サイトを iframe で貼る用途が出たら frame-ancestors を外す。
 * 2. Report-Only: 通信先を絞る本体。本番で実測した通信先 (2026-09-05、Performance API と
 *    ヘッダ注入テストで違反0を確認) に基づくが、Instagram / YouTube が仕様を変えた時に
 *    埋め込みが無言で消えないよう、ブロックはせず DevTools Console に出すだけにしている。
 *    enforce に切り替えるのは「サイト更新のたびに Console を見る」と決めた時だけ。手順は docs/security.md。
 *
 * script-src の 'unsafe-inline' は外せない。Next.js の静的ページは RSC payload を inline <script>
 * (self.__next_f.push) で埋め込み、nonce 方式は全ページを動的レンダリングにしないと使えない。
 * 外すと hydration が止まり、Instagram 埋め込みと YouTube の再生ボタンが動かなくなる (実測済み)。
 * つまりこの CSP は inline XSS は止めない。news 本文の XSS 対策は引き続き sanitizeBody が本線。
 */
const cspEnforce = ["frame-ancestors 'none'", "object-src 'none'", "base-uri 'self'"].join("; ");

// 許可先を増やす時はここだけ触る。違反が出た時の対応表は docs/security.md。
const cspReportOnly = [
  "default-src 'self'",
  // 開発時だけ React が eval を使う。本番には入らない
  `script-src 'self' 'unsafe-inline' https://www.instagram.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' https://i.ytimg.com https://images.microcms-assets.io",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src https://www.instagram.com https://www.youtube-nocookie.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspEnforce },
  { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // autoplay / fullscreen / picture-in-picture は YouTube の iframe が使うので絞らない
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [
      {
        // 本番の vercel.app エイリアスだけを独自ドメインへ。ホスト名は完全一致にする。
        // 正規表現で *.vercel.app を掴むと、プレビューや一意デプロイ URL まで飛んで確認できなくなる。
        // 将来 hatachitachi.com をこのプロジェクトから外すときはこのブロックを削除する。
        source: "/:path*",
        has: [{ type: "host", value: "hatachi-tachi-website.vercel.app" }],
        destination: "https://hatachitachi.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
