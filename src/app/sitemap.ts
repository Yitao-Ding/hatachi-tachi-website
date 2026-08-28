import type { MetadataRoute } from "next";
import { getNewsList } from "@/lib/microcms";
import { SITE_URL } from "@/lib/site-url";

// トップや記事と同じ間隔で作り直す。付けないとビルド時の1回きりになり、
// Webhook が落ちた時に sitemap だけ古いままになる。
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await getNewsList();
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/news`, changeFrequency: "weekly", priority: 0.8 },
    ...news.map((n) => ({
      url: `${SITE_URL}/news/${n.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
