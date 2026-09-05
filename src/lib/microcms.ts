import { createClient } from "microcms-js-sdk";
import sanitizeHtml from "sanitize-html";
import {
  DEFAULT_PROJECT,
  FALLBACK_ARCHIVE,
  FALLBACK_NEWS,
  FALLBACK_SITE,
  type ArchiveItem,
  type NewsItem,
  type SiteSettings,
} from "@/content/site";

/*
 * 取得の方針 (ここを崩すと事故る):
 *
 * 1. env が無い = まだ microCMS に繋いでいない状態。フォールバックを返してビルドを通す。
 *    素材・アカウント待ちで実装を止めないための設計。
 * 2. env がある = 本番。取得に失敗したら握りつぶさず throw する。
 *    ビルドを緑のまま通してプレースホルダーを公開すると、誰も壊れていることに気づけない。
 *    ビルドが落ちれば Vercel は直前の正常なデプロイを配信し続ける。
 * 3. env があって 0 件が返ってきたら、それは「運営が消した」という意思。
 *    フォールバックで復活させると CMS から二度と消せなくなる。
 * 4. API 未作成 (404) だけは例外的にフォールバックへ逃がす。
 *    Phase 2 で API を1本ずつ作る途中でもビルドが通るようにするため。
 *    認証エラー (401/403) や 5xx は本物の異常なので必ず落とす。
 */

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

export const isCmsConfigured = Boolean(serviceDomain && apiKey);

const client =
  serviceDomain && apiKey
    ? createClient({ serviceDomain, apiKey, retry: true })
    : null;

// SDK は status を構造化して持たせず、メッセージに埋める
// ("fetch API response status: 404 ...")。数値はそこから取り出すしかない。
function statusOf(error: unknown): number | null {
  const message = error instanceof Error ? error.message : String(error);
  const m = message.match(/fetch API response status:\s*(\d{3})/);
  return m ? Number(m[1]) : null;
}

function requestInit() {
  // 応答が返らないまま build が固まるのを防ぐ
  return { signal: AbortSignal.timeout(15_000) };
}

/** 404 ならフォールバックに逃がし、それ以外は落とす。 */
function handle(endpoint: string, error: unknown): "fallback" {
  const status = statusOf(error);
  if (status === 404) {
    console.warn(
      `[microcms] endpoint "${endpoint}" が見つかりません (404)。` +
        `API 未作成とみなしてフォールバック内容で表示します。docs/microcms-setup.md を確認してください。`,
    );
    return "fallback";
  }
  console.error(`[microcms] endpoint "${endpoint}" の取得に失敗しました。`, error);
  throw error;
}

type MicroCMSImage = { url: string; width?: number; height?: number };

type NewsRecord = {
  id: string;
  title: string;
  publishedDate?: string;
  lead?: string;
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
  linkUrl?: string;
  sortOrder?: number;
  /** セレクトフィールド。microCMS は単一選択でも配列で返す。 */
  project?: string[] | string;
  inProduction?: boolean;
};

type SiteRecord = {
  nowPlayingUrl?: string;
  nowPlayingCaption?: string;
  instagramPostUrls?: string;
  instagramProfileUrl?: string;
  entryFormUrl?: string;
  aboutBody?: string;
  contactEmail?: string;
  organizerName?: string;
  organizerNote?: string;
  eventOutline?: string;
  supportedBy?: string;
};

// 本文を書くのは管理画面の運営メンバーだが、毎年入れ替わる素人アカウントなので
// 侵害・貼り付けミスがそのまま公式ドメイン上のスクリプト実行にならないよう通す。
export function sanitizeBody(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "strong", "em", "u", "s", "blockquote", "ul", "ol", "li",
      "h2", "h3", "h4", "a", "img", "figure", "figcaption", "hr",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading"],
    },
    allowedSchemes: ["https", "mailto"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, target: "_blank", rel: "noopener noreferrer" },
      }),
      img: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, loading: "lazy" },
      }),
    },
  });
}

function toNewsItem(c: NewsRecord): NewsItem {
  return {
    id: c.id,
    title: c.title,
    publishedDate: c.publishedDate ?? "",
    lead: c.lead?.trim() ?? "",
    thumbnailUrl: c.thumbnail?.url ?? null,
    body: sanitizeBody(c.body ?? ""),
    externalUrl: c.externalUrl?.trim() || null,
  };
}

export async function getNewsList(): Promise<NewsItem[]> {
  if (!client) return FALLBACK_NEWS;
  try {
    const res = await client.getList<NewsRecord>({
      endpoint: "news",
      queries: { limit: 20, orders: "-publishedDate" },
      customRequestInit: requestInit(),
    });
    // 0 件は「運営が意図的に空にした」。フォールバックで復活させない。
    return res.contents.map(toNewsItem);
  } catch (error) {
    handle("news", error);
    return FALLBACK_NEWS;
  }
}

/**
 * 記事が存在しなければ null。呼び出し側で notFound() すること。
 * draftKey を渡すと下書きも取得できる (microCMS の画面プレビュー用)。
 */
export async function getNewsDetail(
  id: string,
  draftKey?: string,
): Promise<NewsItem | null> {
  if (!client) return FALLBACK_NEWS.find((n) => n.id === id) ?? null;
  try {
    const c = await client.getListDetail<NewsRecord>({
      endpoint: "news",
      contentId: id,
      ...(draftKey ? { queries: { draftKey } } : {}),
      customRequestInit: requestInit(),
    });
    return toNewsItem(c);
  } catch (error) {
    // 記事が無い場合も endpoint が無い場合も 404 で返る。
    // どちらにせよこの記事は出せないので null (= 404 ページ)。
    // 一時的な 5xx で公開中の記事を 404 にしないよう、それ以外は落とす。
    if (statusOf(error) === 404) return null;
    console.error(`[microcms] news/${id} の取得に失敗しました。`, error);
    throw error;
  }
}

export async function getArchiveList(): Promise<ArchiveItem[]> {
  if (!client) return FALLBACK_ARCHIVE;
  try {
    const res = await client.getList<ArchiveRecord>({
      endpoint: "archive",
      queries: { limit: 50, orders: "sortOrder" },
      customRequestInit: requestInit(),
    });
    return res.contents.map((c, i) => ({
      id: c.id,
      title: c.title,
      year: c.year ?? "",
      imageUrl: c.image?.url ?? null,
      videoUrl: c.videoUrl?.trim() || null,
      linkUrl: c.linkUrl?.trim() || null,
      sortOrder: c.sortOrder ?? i,
      // 未入力なら既定の企画とみなす。フィールドを作り忘れても表示は壊れない
      project: (Array.isArray(c.project) ? c.project[0] : c.project) || DEFAULT_PROJECT,
      inProduction: c.inProduction === true,
    }));
  } catch (error) {
    handle("archive", error);
    return FALLBACK_ARCHIVE;
  }
}

// テキストエリアに素人が貼る想定なので、行頭の記号・全角スペース・カンマ区切り・
// 末尾の ?igshid=... まで吸収する。取り出せた permalink だけを返す。
export function parseInstagramUrls(raw: string): string[] {
  const found = raw.match(/https?:\/\/[^\s、,"'<>）)]+/g) ?? [];
  const permalinks = found
    .map((u) => u.replace(/[.,、。]+$/, ""))
    .filter((u) => /instagram\.com\/(p|reel|tv)\//.test(u))
    .map((u) => {
      try {
        const url = new URL(u);
        url.search = "";
        url.hash = "";
        if (!url.pathname.endsWith("/")) url.pathname += "/";
        return `https://www.instagram.com${url.pathname}`;
      } catch {
        return null;
      }
    })
    .filter((u): u is string => u !== null);
  return [...new Set(permalinks)];
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!client) return FALLBACK_SITE;
  try {
    const c = await client.getObject<SiteRecord>({
      endpoint: "site",
      customRequestInit: requestInit(),
    });
    return {
      nowPlayingUrl: c.nowPlayingUrl?.trim() || null,
      nowPlayingCaption: c.nowPlayingCaption ?? "",
      instagramPostUrls: parseInstagramUrls(c.instagramPostUrls ?? ""),
      instagramProfileUrl: c.instagramProfileUrl?.trim() || null,
      entryFormUrl: c.entryFormUrl?.trim() || null,
      // ABOUT 本文だけは空のまま公開すると穴が空くのでフォールバックを使う
      aboutBody: c.aboutBody?.trim() || FALLBACK_SITE.aboutBody,
      contactEmail: c.contactEmail?.trim() || null,
      organizerName: c.organizerName?.trim() ?? "",
      organizerNote: c.organizerNote?.trim() ?? "",
      eventOutline: c.eventOutline?.trim() ?? "",
      supportedBy: c.supportedBy?.trim() ?? "",
    };
  } catch (error) {
    handle("site", error);
    return FALLBACK_SITE;
  }
}
