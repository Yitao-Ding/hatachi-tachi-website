import Image from "next/image";
import type { ArchiveItem } from "@/content/site";
import { IN_PRODUCTION_LABEL, SECTION_LABELS } from "@/content/site";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { extractVideoId } from "@/lib/youtube";

type Props = {
  items: ArchiveItem[];
};

// Instagram の印。制作中の枠が Instagram に飛ぶことを図形で示す (珊瑚の上に小さな白文字はコントラスト不足で置けない)
function InstagramMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
    </svg>
  );
}

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

            // 遷移先。動画が無い枠 (制作中 / 平成たち祭) は Instagram の投稿に飛ばす。
            const href = item.linkUrl ?? item.videoUrl;
            const isInstagram = href ? /instagram\.com/.test(href) : false;

            // 制作中の枠はサムネイルの代わりに枠線だけを置き、中央に一語だけ出す。
            // 完成作と同じ見え方にすると「まだ観られない」ことが伝わらない。
            // 完成作の画像の alt は空にする。すぐ下に同じ作品名が可視テキストで出るので、
            // alt を入れるとスクリーンリーダーが作品名を2回読む。
            const media = item.inProduction ? (
              <div className="flex aspect-video flex-col items-center justify-center gap-3 border border-white/60 transition-colors group-hover:bg-white/10">
                <span className="font-mincho text-[17px] tracking-[0.3em] md:text-[18px]">
                  {IN_PRODUCTION_LABEL}
                </span>
                {/* 押せる枠だと分かるように Instagram の印だけ添える。
                    珊瑚の上に小さな白文字は 3.11:1 で読めないので、文字ではなく図形にする */}
                {href && isInstagram && <InstagramMark />}
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
              // 「初代 ハタチたち 2023」だけ他より長く、lg 未満 (375px でカード 160px、
              // 768px で 209px) では年だけが2行目に落ちて、隣の1行の枠と高さが揃わなかった
              // (2026-09-05 実測)。字送りを詰めて1行に押し込む方式は 390px では入っても
              // 375px で割れる。年は lg 未満では常に2行目に置き、lg 以上で1行に戻す。
              <p className="font-mincho mt-3 text-center text-[16px] font-bold tracking-[0.08em] group-hover:underline group-hover:underline-offset-4 md:text-[20px] md:tracking-[0.15em]">
                <span className="block lg:inline">{item.title}</span>
                {item.year && <span className="block lg:ml-2 lg:inline">{item.year}</span>}
              </p>
            );

            return (
              <li key={item.id}>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-visible:outline-paper group block focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    {media}
                    {label}
                    <span className="sr-only">{isInstagram ? "Instagramで見る" : "YouTubeで見る"}</span>
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
