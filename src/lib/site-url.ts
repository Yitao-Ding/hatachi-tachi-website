// 本番 URL。canonical / sitemap / robots / OGP の絶対 URL に使う。
// Cloudflare のプレビュー URL (*.workers.dev) でビルドしても canonical は本番を指す (検索結果は本番に寄る)。
// 別のドメインで試したい時だけ NEXT_PUBLIC_SITE_URL で上書きする。
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.NODE_ENV === "development") return "http://localhost:3000";
  return "https://hatachitachi.com";
}

export const SITE_URL = getSiteUrl();
