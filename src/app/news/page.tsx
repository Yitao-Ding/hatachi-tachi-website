import type { Metadata } from "next";
import Link from "next/link";
import { SECTION_LABELS } from "@/content/site";
import { formatDate, toDateAttr } from "@/lib/format";
import { getNewsList } from "@/lib/microcms";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "お知らせ",
  alternates: { canonical: "/news" },
};

// トップの NEWS には最新1件とそれ以降5件しか出ないため、
// 7件目以降の告知に到達する導線としてこの一覧を置く (sitemap にも載る)。
export default async function NewsIndexPage() {
  const news = await getNewsList();

  return (
    <main className="bg-paper">
      <div className="bg-navy py-5 pl-[6vw]">
        <h1 className="font-roman text-2xl font-semibold tracking-[0.35em] text-white">
          {SECTION_LABELS.news}
        </h1>
      </div>

      <div className="mx-auto w-[min(880px,92vw)] py-[var(--section-pad-y)]">
        {news.length === 0 ? (
          <p className="text-ink-muted tracking-wider">お知らせはまだありません。</p>
        ) : (
          <ul className="divide-ink/10 border-ink/10 divide-y border-y">
            {news.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.externalUrl ?? `/news/${item.id}`}
                  className="hover:bg-paper-warm flex flex-col gap-1 py-6 transition md:flex-row md:items-baseline md:gap-8"
                  {...(item.externalUrl
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {item.publishedDate && (
                    <time
                      dateTime={toDateAttr(item.publishedDate)}
                      className="text-ink-muted shrink-0 text-sm tracking-[0.2em]"
                    >
                      {formatDate(item.publishedDate)}
                    </time>
                  )}
                  <span className="font-mincho font-semibold tracking-wider">
                    {item.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-14">
          <Link
            href="/"
            className="border-navy text-navy hover:bg-navy focus-visible:outline-navy inline-block rounded-full border-2 px-8 py-3 font-mincho text-sm font-bold tracking-[0.2em] transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            トップへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
