import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

// 独自ドメインが未設定の間 (= *.vercel.app のまま) はクロールさせない。
// 本番ドメインと vercel.app の両方が索引されると、公式サイトが検索結果で重複する。
// NEXT_PUBLIC_SITE_URL に独自ドメインを入れた時点で自動的に許可へ切り替わる。
const isTemporaryHost =
  SITE_URL.includes("vercel.app") || SITE_URL.includes("localhost");

export default function robots(): MetadataRoute.Robots {
  if (isTemporaryHost) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/preview/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
