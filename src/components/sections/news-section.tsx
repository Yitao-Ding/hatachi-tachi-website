import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/content/site";
import { SECTION_LABELS } from "@/content/site";
import { formatDate, toDateAttr } from "@/lib/format";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { SlantBand } from "@/components/ui/slant-band";

// 草案の見出しは「ハタチたち5開催決定！」/「&」/「ダンサー募集中！」の3行組み。
// CMS のタイトルは1行なので、"&" が含まれていればその形に組み直す。
// 含まれていなければそのまま1行で出す。
function splitTitle(title: string): string[] {
  const parts = title.split(/\s*&\s*/).filter(Boolean);
  return parts.length === 2 ? [parts[0], "&", parts[1]] : [title];
}

type Props = {
  items: NewsItem[];
  ctaLabel?: string;
};

export function NewsSection({ items, ctaLabel = "詳しくはこちら" }: Props) {
  const [featured, ...rest] = items;
  if (!featured) return null;

  const href = featured.externalUrl ?? `/news/${featured.id}`;
  const external = Boolean(featured.externalUrl);
  const titleLines = splitTitle(featured.title);
  const lead = featured.lead;

  return (
    <section id="news" className="bg-paper">
      <SlantBand id="news-heading" label={SECTION_LABELS.news} />

      <div className="mx-auto w-[var(--container)] pt-[clamp(40px,6vw,72px)]">
        <article className="grid items-center gap-8 md:grid-cols-[1fr_2fr] md:gap-12">
          <div className="relative aspect-[3/4] w-full max-w-[320px] overflow-hidden justify-self-center md:justify-self-start">
            {featured.thumbnailUrl ? (
              <Image
                src={featured.thumbnailUrl}
                alt=""
                fill
                sizes="(min-width: 768px) 320px, 80vw"
                className="object-cover"
              />
            ) : (
              <PlaceholderImage label="NEWS サムネイル" className="h-full w-full" />
            )}
          </div>

          <div className="text-center">
            <h3 className="font-mincho text-[clamp(22px,3.2vw,38px)] font-bold leading-[1.5] tracking-[0.14em]">
              {titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h3>

            {featured.publishedDate && (
              <time
                dateTime={toDateAttr(featured.publishedDate)}
                className="text-ink-muted mt-4 block text-sm tracking-[0.2em]"
              >
                {formatDate(featured.publishedDate)}
              </time>
            )}

            {lead && (
              <p className="font-mincho mx-auto mt-6 max-w-[30em] text-left text-[15px] leading-[2.1] tracking-[0.08em] md:text-base">
                {lead}
              </p>
            )}
          </div>
        </article>
      </div>

      {/* 草案では本文の下に、左端が斜めに切れた紺の帯が右いっぱいまで伸び、
          その上に白いピル型のボタンが乗る */}
      <div className="mt-[clamp(28px,4vw,52px)]">
        <SlantBand side="right">
          <div className="flex justify-end py-6 pr-[6vw] pl-28 md:pl-32">
            <Link
              href={href}
              className="bg-paper text-navy hover:bg-paper-warm focus-visible:outline-paper inline-block rounded-full px-8 py-3.5 font-mincho text-[15px] font-bold tracking-[0.16em] whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 md:px-12 md:py-4 md:text-lg md:tracking-[0.2em]"
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {ctaLabel}
            </Link>
          </div>
        </SlantBand>
      </div>

      {rest.length > 0 && (
        <div className="mx-auto w-[var(--container)] pb-[clamp(40px,6vw,72px)]">
          <ul className="divide-ink/10 border-ink/10 mt-12 divide-y border-y">
            {rest.slice(0, 5).map((item) => (
              <li key={item.id}>
                <Link
                  href={item.externalUrl ?? `/news/${item.id}`}
                  className="hover:bg-paper-warm flex flex-col gap-1 py-5 transition-colors md:flex-row md:items-center md:gap-8"
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
        </div>
      )}
    </section>
  );
}
