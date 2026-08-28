import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/content/site";
import { SECTION_LABELS } from "@/content/site";
import { formatDate, toDateAttr } from "@/lib/format";

// 公開ページと下書きプレビューで同じ組版を使う。
export function NewsArticle({ item }: { item: NewsItem }) {
  return (
    <main className="bg-paper">
      <div className="bg-navy py-5 pl-[6vw]">
        <p className="font-roman text-2xl font-semibold tracking-[0.35em] text-white">
          {SECTION_LABELS.news}
        </p>
      </div>

      <article className="mx-auto w-[min(760px,92vw)] py-[var(--section-pad-y)]">
        {item.publishedDate && (
          <time
            dateTime={toDateAttr(item.publishedDate)}
            className="text-ink-muted text-sm tracking-[0.2em]"
          >
            {formatDate(item.publishedDate)}
          </time>
        )}

        <h1 className="font-mincho mt-3 text-[clamp(24px,4vw,36px)] leading-[1.6] font-bold tracking-wider">
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

        {/* microcms.ts の sanitizeBody で許可タグ・許可属性まで絞ってある */}
        <div
          className="news-body mt-10 leading-[2.1] tracking-wider"
          dangerouslySetInnerHTML={{ __html: item.body }}
        />

        <div className="mt-16 flex flex-wrap gap-4">
          <Link
            href="/news"
            className="border-navy text-navy hover:bg-navy focus-visible:outline-navy inline-block rounded-full border-2 px-8 py-3 font-mincho text-sm font-bold tracking-[0.2em] transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            お知らせ一覧
          </Link>
          <Link
            href="/"
            className="text-ink-muted hover:text-ink inline-block px-4 py-3 font-mincho text-sm tracking-[0.2em] transition"
          >
            トップへ戻る
          </Link>
        </div>
      </article>
    </main>
  );
}
