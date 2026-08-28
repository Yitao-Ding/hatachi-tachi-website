import { SECTION_LABELS } from "@/content/site";
import { InstagramEmbeds } from "@/components/ui/instagram-embed";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

type Props = {
  postUrls: string[];
  profileUrl: string | null;
};

export function InstagramGrid({ postUrls, profileUrl }: Props) {
  return (
    <section id="instagram" className="bg-paper">
      <div className="mx-auto w-[var(--container)] py-[var(--section-pad-y)]">
        <h2 className="font-roman text-coral text-[clamp(30px,5vw,56px)] leading-none font-semibold tracking-[0.3em]">
          {SECTION_LABELS.instagram}
        </h2>

        <div className="mt-12">
          {postUrls.length > 0 ? (
            <InstagramEmbeds postUrls={postUrls} />
          ) : (
            // 投稿URL未設定時も草案と同じ「大1枚 + 小4枚」の骨格を見せる
            <div className="grid gap-6 md:grid-cols-[1.1fr_1fr] md:gap-8">
              <PlaceholderImage
                label="INSTAGRAM 投稿"
                className="aspect-[4/5] w-full"
              />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <PlaceholderImage key={i} className="aspect-[3/4] w-full" />
                ))}
              </div>
            </div>
          )}
        </div>

        {profileUrl && (
          <div className="mt-12 text-center">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border-navy text-navy hover:bg-navy focus-visible:outline-navy inline-block rounded-full border-2 px-10 py-3.5 font-mincho text-base font-bold tracking-[0.2em] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              公式Instagramを見る
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
