import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/content/site";
import { SECTION_LABELS } from "@/content/site";
import { formatDate, toDateAttr } from "@/lib/format";
import { SlantBand } from "@/components/ui/slant-band";

/*
 * 公開ページと下書きプレビューで同じ組版を使う。
 *
 * トップと同じ言語で組む: 見出しは紺の斜めカット帯、タイトルは草案の「&」3行組み、
 * 本文は白地に明朝。新しい装飾は足さず、階層は余白と文字サイズで作る。
 *
 * サムネイルは告知フライヤーが縦長で来るので、比率を固定して切らない。
 * 16:10 に切ると文字が読めなくなって告知として意味を失う。
 */
export function NewsArticle({ item }: { item: NewsItem }) {
  const titleLines = item.title.split(/\s*&\s*/).filter(Boolean);

  return (
    <main className="bg-paper">
      <SlantBand label={SECTION_LABELS.news} />

      <article className="mx-auto w-[min(760px,92vw)] pt-[clamp(40px,6vw,72px)] pb-[var(--section-pad-y)]">
        {item.publishedDate && (
          <time
            dateTime={toDateAttr(item.publishedDate)}
            className="text-ink-muted text-sm tracking-[0.2em]"
          >
            {formatDate(item.publishedDate)}
          </time>
        )}

        <h1 className="font-mincho mt-4 text-[clamp(26px,4.4vw,40px)] leading-[1.55] font-bold tracking-[0.12em]">
          {titleLines.length === 2 ? (
            <>
              <span className="block">{titleLines[0]}</span>
              <span className="text-coral-deep block text-[0.7em]">&amp;</span>
              <span className="block">{titleLines[1]}</span>
            </>
          ) : (
            item.title
          )}
        </h1>

        {item.thumbnailUrl && (
          <figure className="mx-auto mt-12 w-[min(420px,100%)]">
            <Image
              src={item.thumbnailUrl}
              alt=""
              width={900}
              height={1189}
              sizes="(min-width: 760px) 420px, 92vw"
              className="h-auto w-full"
            />
          </figure>
        )}

        {/* microcms.ts の sanitizeBody で許可タグ・許可属性まで絞ってある */}
        <div
          className="news-body font-mincho mt-14 text-[16px] leading-[2.15] tracking-[0.06em] md:text-[17px]"
          dangerouslySetInnerHTML={{ __html: item.body }}
        />

        <div className="mt-16 flex flex-wrap gap-4">
          <Link
            href="/news"
            className="border-navy text-navy hover:bg-navy focus-visible:outline-navy font-mincho inline-block rounded-full border-2 px-8 py-3 text-sm font-bold tracking-[0.2em] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            お知らせ一覧
          </Link>
          <Link
            href="/"
            className="text-ink-muted hover:text-ink font-mincho inline-block px-4 py-3 text-sm tracking-[0.2em] transition-colors"
          >
            トップへ戻る
          </Link>
        </div>
      </article>
    </main>
  );
}
