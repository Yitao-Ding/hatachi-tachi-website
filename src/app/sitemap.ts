import type { MetadataRoute } from "next";
import { getNewsList } from "@/lib/microcms";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await getNewsList();
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    ...news.map((n) => ({
      url: `${SITE_URL}/news/${n.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
