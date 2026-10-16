import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsDetail, getNewsList } from "@/lib/microcms";
import { NewsArticle } from "@/components/news-article";
import { SiteFooter } from "@/components/sections/site-footer";
import { ArticleJsonLd } from "@/components/json-ld";

// 静的書き出しなので、ビルド時に generateStaticParams で列挙した記事だけを出す。それ以外は 404
export const dynamicParams = false;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const news = await getNewsList();
  return news.map((n) => ({ slug: n.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsDetail(slug);
  if (!item) return {};

  const url = `/news/${item.id}`;
  return {
    title: item.title,
    // 記事ごとの説明文。リードが無い記事はレイアウト側の共通の説明文になる
    ...(item.lead ? { description: item.lead } : {}),
    // canonical を各記事に付ける。付けないとレイアウト側の設定が効いて全記事がトップを指す。
    alternates: { canonical: url },
    openGraph: {
      // type / siteName / locale はレイアウト側とマージされる。ここでは差分だけ書く。
      title: item.title,
      url,
      ...(item.lead ? { description: item.lead } : {}),
      ...(item.thumbnailUrl ? { images: [{ url: item.thumbnailUrl }] } : {}),
    },
    ...(item.thumbnailUrl
      ? { twitter: { card: "summary_large_image" as const, images: [item.thumbnailUrl] } }
      : {}),
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsDetail(slug);
  if (!item) notFound();

  return (
    <>
      <ArticleJsonLd item={item} />
      <NewsArticle item={item} />
      <SiteFooter />
    </>
  );
}
