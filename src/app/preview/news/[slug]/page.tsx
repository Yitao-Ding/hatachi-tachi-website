import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsDetail } from "@/lib/microcms";
import { NewsArticle } from "@/components/news-article";

/*
 * microCMS の画面プレビュー用。管理画面の「画面プレビュー」設定に
 *   https://<本番URL>/preview/news/{CONTENT_ID}?draftKey={DRAFT_KEY}
 * を登録すると、公開前の下書きをこのページで確認できる。
 *
 * 公開ページ (/news/[slug]) は静的生成のままにしたいので、
 * draftKey を読む動的なページはこちらに分けている。
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ draftKey?: string }>;
};

export default async function NewsPreviewPage({ params, searchParams }: Props) {
  const [{ slug }, { draftKey }] = await Promise.all([params, searchParams]);
  const item = await getNewsDetail(slug, draftKey);
  if (!item) notFound();

  return (
    <>
      <p className="bg-ink px-6 py-3 text-center text-sm tracking-wider text-white">
        下書きプレビュー。このページは公開サイトには出ません。
      </p>
      <NewsArticle item={item} />
    </>
  );
}
