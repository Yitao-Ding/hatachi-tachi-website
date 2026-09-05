import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsDetail, getNewsList } from "@/lib/microcms";
import { NewsArticle } from "@/components/news-article";
import { SiteFooter } from "@/components/sections/site-footer";

export const revalidate = 3600;
export const dynamicParams = true;

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
    // canonical を各記事に付ける。付けないとレイアウト側の設定が効いて全記事がトップを指す。
    alternates: { canonical: url },
    openGraph: {
      // type / siteName / locale はレイアウト側とマージされる。ここでは差分だけ書く。
      title: item.title,
      url,
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
      <NewsArticle item={item} />
      <SiteFooter />
    </>
  );
}
