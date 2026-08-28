import Image from "next/image";
import type { ArchiveItem } from "@/content/site";
import { SECTION_LABELS } from "@/content/site";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

type Props = {
  items: ArchiveItem[];
};

// 見出しの表記は草案どおり「LOCK BACK」。英語としては LOOK BACK の誤記の可能性があり、
// 変えるときは SECTION_LABELS.archive の1箇所を直せばフッターのリンク名まで揃う。
export function LockBack({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section id="archive" className="bg-coral text-white">
      <div className="mx-auto w-[var(--container)] py-[var(--section-pad-y)]">
        {/* 草案実測: 2行の字面の間隔はわずか2px。ほぼ密着した塊に見せる */}
        <h2 className="text-center text-[clamp(44px,7.5vw,86px)] leading-[0.78] font-black tracking-[0.01em]">
          {SECTION_LABELS.archive.split(" ").map((word) => (
            <span key={word} className="block">
              {word}
            </span>
          ))}
        </h2>

        <ul className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 md:mt-20 md:grid-cols-3 md:gap-x-10">
          {items.map((item) => {
            // 画像の alt は空にする。すぐ下に同じ作品名が可視テキストで出るので、
            // alt を入れるとスクリーンリーダーが作品名を2回読む。
            const media = (
              <div className="relative aspect-[4/3] overflow-hidden">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 30vw, 45vw"
                    className="object-cover transition duration-300 group-hover:scale-[1.04]"
                  />
                ) : (
                  <PlaceholderImage
                    label={item.title}
                    className="h-full w-full bg-white/25 text-white"
                  />
                )}
              </div>
            );

            const label = (
              <p className="font-mincho mt-3 text-center text-[19px] font-bold tracking-[0.15em] md:text-[20px]">
                {item.title}
                {item.year && (
                  <span className="ml-2">{item.year}</span>
                )}
              </p>
            );

            return (
              <li key={item.id}>
                {item.videoUrl ? (
                  <a
                    href={item.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-visible:outline-paper group block focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    {media}
                    {label}
                    <span className="sr-only">YouTubeで見る</span>
                  </a>
                ) : (
                  <div className="group">
                    {media}
                    {label}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
