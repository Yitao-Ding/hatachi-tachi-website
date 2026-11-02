import type { MetadataRoute } from "next";
import { getNewsList } from "@/lib/microcms";
import { SITE_URL } from "@/lib/site-url";

// 静的書き出し (output: "export") では force-static が無いとビルドが止まる
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await getNewsList();
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/news`, changeFrequency: "weekly", priority: 0.8 },
    // 外部リンクのお知らせ (Instagram へ飛ばすもの) は記事ページが無い
    ...news.filter((n) => !n.externalUrl).map((n) => ({
      url: `${SITE_URL}/news/${n.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
