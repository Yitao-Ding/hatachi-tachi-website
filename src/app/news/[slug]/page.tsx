import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsDetail, getNewsList } from "@/lib/microcms";

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
  return {
    title: item.title,
    openGraph: {
      title: item.title,
      ...(item.thumbnailUrl ? { images: [{ url: item.thumbnailUrl }] } : {}),
    },
  };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsDetail(slug);
  if (!item) notFound();

  return (
    <main className="bg-paper">
      <div className="bg-navy py-5 pl-[6vw]">
        <p className="font-mincho text-2xl font-bold tracking-[0.35em] text-white">NEWS</p>
      </div>

      <article className="mx-auto w-[min(760px,92vw)] py-[var(--section-pad-y)]">
        <time className="text-sm tracking-[0.2em] text-ink/60">
          {formatDate(item.publishedDate)}
        </time>
        <h1 className="font-mincho mt-3 text-3xl font-bold leading-relaxed tracking-wider md:text-4xl">
          {item.title}
        </h1>

        {item.thumbnailUrl && (
          <div className="relative mt-10 aspect-[16/10] overflow-hidden">
            <Image
              src={item.thumbnailUrl}
              alt=""
              fill
              sizes="(min-width: 760px) 760px, 92vw"
              className="object-cover"
            />
          </div>
        )}

        {/* microCMS リッチエディタの出力 HTML (管理者のみが入力する信頼済みソース) */}
        <div
          className="news-body mt-10 leading-[2.2] tracking-wider [&_a]:underline [&_h2]:font-mincho [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_img]:h-auto [&_img]:w-full [&_p]:mt-5"
          dangerouslySetInnerHTML={{ __html: item.body }}
        />

        <div className="mt-16">
          <Link
            href="/#news"
            className="inline-block border-2 border-navy px-8 py-3 font-mincho text-sm font-bold tracking-[0.25em] text-navy transition hover:bg-navy hover:text-white"
          >
            NEWS一覧へ戻る
          </Link>
        </div>
      </article>
    </main>
  );
}
