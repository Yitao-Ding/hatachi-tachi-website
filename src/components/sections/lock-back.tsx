import Image from "next/image";
import type { ArchiveItem } from "@/content/site";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

type Props = {
  items: ArchiveItem[];
};

// 歴代アーカイブ。見出しの表記「LOCK BACK」は Canva 草案のまま (要 YD 確認)。
export function LockBack({ items }: Props) {
  return (
    <section id="archive" className="bg-coral text-white">
      <div className="mx-auto w-[var(--container)] py-[var(--section-pad-y)]">
        <h2 className="text-center text-[clamp(48px,8vw,96px)] font-black leading-[0.95] tracking-wide">
          LOCK
          <br />
          BACK
        </h2>

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 md:gap-x-10">
          {items.map((item) => {
            const media = (
              <div className="relative aspect-[4/3] overflow-hidden">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(min-width: 768px) 30vw, 45vw"
                    className="object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <PlaceholderImage
                    label={item.title}
                    className="h-full w-full bg-white/20 text-white/60"
                  />
                )}
              </div>
            );
            const label = (
              <p className="font-mincho mt-3 text-center text-sm font-semibold tracking-[0.25em] md:text-base">
                {item.title}
                {item.year && <span className="ml-2 text-xs text-white/70">{item.year}</span>}
              </p>
            );
            return item.videoUrl ? (
              <a
                key={item.id}
                href={item.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                {media}
                {label}
              </a>
            ) : (
              <div key={item.id} className="group">
                {media}
                {label}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
