import { createClient } from "microcms-js-sdk";
import {
  FALLBACK_ARCHIVE,
  FALLBACK_NEWS,
  FALLBACK_SITE,
  type ArchiveItem,
  type NewsItem,
  type SiteSettings,
} from "@/content/site";

// env 未設定 (ローカル初期構築・microCMS 障害時) でもビルド・表示が落ちないよう、
// クライアントは任意生成 + 全取得関数がフォールバックに落ちる。この設計を崩さない。
const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

const client =
  serviceDomain && apiKey ? createClient({ serviceDomain, apiKey }) : null;

type MicroCMSImage = { url: string; width?: number; height?: number };

type NewsRecord = {
  id: string;
  title: string;
  publishedDate: string;
  thumbnail?: MicroCMSImage;
  body?: string;
  externalUrl?: string;
};

type ArchiveRecord = {
  id: string;
  title: string;
  year?: string;
  image?: MicroCMSImage;
  videoUrl?: string;
  sortOrder?: number;
};

type SiteRecord = {
  nowPlayingUrl?: string;
  nowPlayingCaption?: string;
  instagramPostUrls?: string; // テキストエリア: 1行1URL
  instagramProfileUrl?: string;
  entryFormUrl?: string;
  aboutBody?: string;
  contactEmail?: string;
};

export async function getNewsList(): Promise<NewsItem[]> {
  if (!client) return FALLBACK_NEWS;
  try {
    const res = await client.getList<NewsRecord>({
      endpoint: "news",
      queries: { limit: 20, orders: "-publishedDate" },
    });
    if (res.contents.length === 0) return FALLBACK_NEWS;
    return res.contents.map((c) => ({
      id: c.id,
      title: c.title,
      publishedDate: c.publishedDate,
      thumbnailUrl: c.thumbnail?.url ?? null,
      body: c.body ?? "",
      externalUrl: c.externalUrl || null,
    }));
  } catch {
    return FALLBACK_NEWS;
  }
}

export async function getNewsDetail(id: string): Promise<NewsItem | null> {
  if (!client) return FALLBACK_NEWS.find((n) => n.id === id) ?? null;
  try {
    const c = await client.getListDetail<NewsRecord>({
      endpoint: "news",
      contentId: id,
    });
    return {
      id: c.id,
      title: c.title,
      publishedDate: c.publishedDate,
      thumbnailUrl: c.thumbnail?.url ?? null,
      body: c.body ?? "",
      externalUrl: c.externalUrl || null,
    };
  } catch {
    return FALLBACK_NEWS.find((n) => n.id === id) ?? null;
  }
}

export async function getArchiveList(): Promise<ArchiveItem[]> {
  if (!client) return FALLBACK_ARCHIVE;
  try {
    const res = await client.getList<ArchiveRecord>({
      endpoint: "archive",
      queries: { limit: 50, orders: "sortOrder" },
    });
    if (res.contents.length === 0) return FALLBACK_ARCHIVE;
    return res.contents.map((c, i) => ({
      id: c.id,
      title: c.title,
      year: c.year ?? "",
      imageUrl: c.image?.url ?? null,
      videoUrl: c.videoUrl || null,
      sortOrder: c.sortOrder ?? i,
    }));
  } catch {
    return FALLBACK_ARCHIVE;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!client) return FALLBACK_SITE;
  try {
    const c = await client.getObject<SiteRecord>({ endpoint: "site" });
    return {
      nowPlayingUrl: c.nowPlayingUrl || null,
      nowPlayingCaption: c.nowPlayingCaption ?? "",
      instagramPostUrls: (c.instagramPostUrls ?? "")
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter((s) => s.startsWith("http")),
      instagramProfileUrl: c.instagramProfileUrl || null,
      entryFormUrl: c.entryFormUrl || null,
      aboutBody: c.aboutBody || FALLBACK_SITE.aboutBody,
      contactEmail: c.contactEmail || null,
    };
  } catch {
    return FALLBACK_SITE;
  }
}
