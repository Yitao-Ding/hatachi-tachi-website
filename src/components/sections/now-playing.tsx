import { SECTION_LABELS } from "@/content/site";
import { YouTubeFacade } from "@/components/ui/youtube-facade";
import { extractVideoId } from "@/lib/youtube";

/*
 * 草案 (hc-1700.png) では、動画を左右から NOW PLAYING の縦組みが挟む。
 * 左は 180度回して下から上に読ませている。
 * 左右の縦文字は同じ語の繰り返しなので装飾。見出しは1つだけ置く。
 */
type Props = {
  url: string | null;
  caption: string;
};

export function NowPlaying({ url, caption }: Props) {
  // URL が YouTube として解釈できない場合も COMING SOON に落とす。
  // ここで黙って空欄になると、運営は URL を入れたつもりで気づけない。
  const videoId = url ? extractVideoId(url) : null;

  return (
    <section id="now-playing" className="bg-paper">
      <div className="mx-auto w-[var(--container)] py-[var(--section-pad-y)]">
        <h2 className="sr-only">{SECTION_LABELS.nowPlaying}</h2>

        <div className="flex items-stretch gap-3 md:gap-6">
          <p
            className="text-ink hidden shrink-0 text-[clamp(22px,2.6vw,32px)] leading-none font-black tracking-[0.02em] [writing-mode:vertical-rl] md:block"
            style={{ transform: "rotate(180deg)" }}
            aria-hidden
          >
            {SECTION_LABELS.nowPlaying}
          </p>

          <div className="w-full">
            <p className="text-ink mb-5 text-xl font-black tracking-[0.2em] md:hidden" aria-hidden>
              {SECTION_LABELS.nowPlaying}
            </p>

            {videoId ? (
              <YouTubeFacade videoId={videoId} title="ハタチたち 最新作品" />
            ) : (
              <div className="bg-ink flex aspect-video w-full items-center justify-center text-sm tracking-[0.4em] text-white">
                COMING SOON
              </div>
            )}

            {caption && (
              <p className="text-ink-muted mt-4 text-center text-sm tracking-[0.15em]">
                {caption}
              </p>
            )}
          </div>

          <p
            className="text-ink hidden shrink-0 text-[clamp(22px,2.6vw,32px)] leading-none font-black tracking-[0.02em] [writing-mode:vertical-rl] md:block"
            aria-hidden
          >
            {SECTION_LABELS.nowPlaying}
          </p>
        </div>
      </div>
    </section>
  );
}
