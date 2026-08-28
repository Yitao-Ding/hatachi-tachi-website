import { ABOUT_HEADING, ABOUT_SUB } from "@/content/site";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

type Props = {
  body: string;
};

export function About({ body }: Props) {
  return (
    <section id="about" className="bg-coral text-white">
      <div className="mx-auto w-[var(--container)] py-[var(--section-pad-y)]">
        <p className="text-sm font-bold tracking-[0.5em]">ABOUT</p>

        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1fr] md:gap-14">
          <div>
            <h2 className="font-mincho border-b border-white/70 pb-6 text-4xl font-bold tracking-[0.2em] md:text-5xl">
              {ABOUT_HEADING}
            </h2>
            <p className="font-mincho mt-8 whitespace-pre-line text-base leading-[2.4] tracking-[0.2em] md:text-lg">
              {body}
            </p>
          </div>
          <div className="relative aspect-[4/3] self-center overflow-hidden">
            <PlaceholderImage label="集合写真 1 (about-1)" className="h-full w-full bg-white/20 text-white/60" />
          </div>
        </div>

        <div className="mt-14 grid items-center gap-10 md:grid-cols-[2fr_3fr]">
          <div className="relative aspect-[4/3] overflow-hidden">
            <PlaceholderImage label="集合写真 2 (about-2)" className="h-full w-full bg-white/20 text-white/60" />
          </div>
          <p className="font-mincho text-base leading-[2.4] tracking-[0.2em] md:text-lg">
            {ABOUT_SUB}
          </p>
        </div>
      </div>
    </section>
  );
}
