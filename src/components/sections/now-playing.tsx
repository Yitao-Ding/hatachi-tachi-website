import { YouTubeFacade } from "@/components/ui/youtube-facade";

type Props = {
  url: string | null;
  caption: string;
};

export function NowPlaying({ url, caption }: Props) {
  return (
    <section id="now-playing" className="bg-paper">
      <div className="mx-auto flex w-[var(--container)] items-center gap-6 py-[var(--section-pad-y)]">
        <p
          className="hidden shrink-0 text-2xl font-black tracking-[0.2em] text-ink [writing-mode:vertical-rl] md:block"
          style={{ transform: "rotate(180deg)" }}
          aria-hidden
        >
          NOW PLAYING
        </p>

        <div className="w-full">
          <p className="mb-6 text-xl font-black tracking-[0.25em] md:hidden">NOW PLAYING</p>
          {url ? (
            <YouTubeFacade url={url} title="ハタチたち 最新作品" />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center bg-ink text-sm tracking-[0.4em] text-white/70">
              COMING SOON
            </div>
          )}
          {caption && (
            <p className="mt-4 text-center text-sm tracking-[0.2em] text-ink/70">{caption}</p>
          )}
        </div>

        <p
          className="hidden shrink-0 text-2xl font-black tracking-[0.2em] text-ink [writing-mode:vertical-rl] md:block"
          aria-hidden
        >
          NOW PLAYING
        </p>
      </div>
    </section>
  );
}
