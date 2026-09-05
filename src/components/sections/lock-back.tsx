import Image from "next/image";
import type { ArchiveItem } from "@/content/site";
import { IN_PRODUCTION_LABEL, SECTION_LABELS } from "@/content/site";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { extractVideoId } from "@/lib/youtube";

type Props = {
  items: ArchiveItem[];
};

// 見出しは SECTION_LABELS.archive の1箇所で管理している。
// ここを直すとフッターのリンク名まで揃う。
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
            // 画像未設定でも動画があればそのサムネイルを使う。
            // hqdefault は 4:3 で上下に黒帯が入るが、16:9 の枠に object-cover で
            // 収めると帯がちょうど切り落とされる。
            const videoId = item.videoUrl ? extractVideoId(item.videoUrl) : null;
            const thumb =
              item.imageUrl ??
              (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null);

            // 制作中の枠はサムネイルの代わりに枠線だけを置き、中央に一語だけ出す。
            // 完成作と同じ見え方にすると「まだ観られない」ことが伝わらない。
            // 完成作の画像の alt は空にする。すぐ下に同じ作品名が可視テキストで出るので、
            // alt を入れるとスクリーンリーダーが作品名を2回読む。
            const media = item.inProduction ? (
              <div className="flex aspect-video items-center justify-center border border-white/60">
                <span className="font-mincho text-[17px] tracking-[0.3em] md:text-[18px]">
                  {IN_PRODUCTION_LABEL}
                </span>
              </div>
            ) : (
              <div className="relative aspect-video overflow-hidden">
                {thumb ? (
                  <Image
                    src={thumb}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 30vw, 45vw"
                    className="object-cover"
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
              // スマホは 2カラムでカード幅が 167px しかなく、19px / 0.15em だと
              // 「初代 ハタチたち 2023」が入りきらずに年だけ2行目に落ちていた
              // (2026-09-05 指摘)。字送りを詰めて 15px にすると1行に収まる。
              <p className="font-mincho mt-3 text-center text-[15px] font-bold tracking-[0.04em] md:text-[20px] md:tracking-[0.15em]">
                {item.title}
                {item.year && <span className="ml-2">{item.year}</span>}
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
                  <div>
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
