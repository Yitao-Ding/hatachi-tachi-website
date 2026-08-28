// 本番URLの決定。独自ドメイン確定前でも Vercel の実URLを使い、
// localhost が sitemap / robots / OGP に焼き込まれるのを防ぐ。
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  // Vercel の本番エイリアス → プレビューのデプロイURL の順で拾う
  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const SITE_URL = getSiteUrl();
