import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/content/site";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { SlantBand } from "@/components/ui/slant-band";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

type Props = {
  items: NewsItem[];
};

export function NewsSection({ items }: Props) {
  const [featured, ...rest] = items;

  return (
    <section id="news" className="bg-paper">
      <SlantBand label="NEWS" />

      <div className="mx-auto w-[var(--container)] py-[var(--section-pad-y)]">
        {featured && (
          <article className="grid items-center gap-8 md:grid-cols-[2fr_3fr]">
            <div className="relative aspect-[4/3] overflow-hidden">
              {featured.thumbnailUrl ? (
                <Image
                  src={featured.thumbnailUrl}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 40vw, 92vw"
                  className="object-cover"
                />
              ) : (
                <PlaceholderImage label="NEWS サムネイル" className="h-full w-full" />
              )}
            </div>
            <div className="text-center md:px-4">
              <h3 className="font-mincho text-2xl font-bold leading-relaxed tracking-[0.15em] md:text-4xl">
                {featured.title}
              </h3>
              <p className="mt-3 text-sm tracking-[0.2em] text-ink/60">
                {formatDate(featured.publishedDate)}
              </p>
              <Link
                href={featured.externalUrl ?? `/news/${featured.id}`}
                className="mt-8 inline-block border-2 border-navy px-10 py-3 font-mincho text-base font-bold tracking-[0.25em] text-navy transition hover:bg-navy hover:text-white"
                {...(featured.externalUrl
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                詳しくはこちら
              </Link>
            </div>
          </article>
        )}

        {rest.length > 0 && (
          <ul className="mt-14 divide-y divide-ink/10 border-y border-ink/10">
            {rest.slice(0, 5).map((item) => (
              <li key={item.id}>
                <Link
                  href={item.externalUrl ?? `/news/${item.id}`}
                  className="flex flex-col gap-1 py-5 transition hover:bg-paper-soft md:flex-row md:items-center md:gap-8"
                  {...(item.externalUrl
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <time className="shrink-0 text-sm tracking-[0.2em] text-ink/60">
                    {formatDate(item.publishedDate)}
                  </time>
                  <span className="font-mincho font-semibold tracking-wider">
                    {item.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
