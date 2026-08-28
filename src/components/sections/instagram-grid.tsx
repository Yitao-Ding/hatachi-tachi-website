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
        <h2 className="font-mincho text-coral text-4xl font-bold tracking-[0.35em] md:text-5xl">
          INSTAGRAM
        </h2>

        <div className="mt-12">
          {postUrls.length > 0 ? (
            <InstagramEmbeds postUrls={postUrls} />
          ) : (
            <div className="grid gap-6 md:grid-cols-[3fr_2fr]">
              <PlaceholderImage label="INSTAGRAM 投稿" className="aspect-square w-full" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <PlaceholderImage key={i} label="" className="aspect-[3/4] w-full" />
                ))}
              </div>
            </div>
          )}
        </div>

        {profileUrl && (
          <div className="mt-10 text-center">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border-coral text-coral hover:bg-coral inline-block border-2 px-10 py-3 font-mincho text-base font-bold tracking-[0.25em] transition hover:text-white"
            >
              Instagramを見る
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
