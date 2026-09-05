import Image from "next/image";
import { ABOUT_HEADING, ABOUT_SUB, SECTION_LABELS } from "@/content/site";

/*
 * 草案 (hatachi-canva-gap.png / hc-1700.png) の構成:
 *   珊瑚レッド全面。ABOUT ラベルは大きめのローマン体。
 *   見出し「ハタチたちとは。」の下に白い罫線。本文は左、写真は右で画面右端まで裁ち落とし。
 *   その下に写真をもう1枚、今度は画面左端まで裁ち落とす非対称構成。
 *   右下に黒いピル型ボタン (草案では Canva テンプレート由来の英語のまま)。
 *
 * 珊瑚 #ff5757 に白文字は 3.11:1 で AA 本文基準に届かない。
 * 半透明の白は 2.4:1 まで落ちるので、この背景の上では必ず不透明の白を使う。
 */
type Props = {
  body: string;
  ctaHref: string | null;
  ctaLabel: string;
};

export function About({ body, ctaHref, ctaLabel }: Props) {
  return (
    <section id="about" className="bg-coral text-white">
      <div className="mx-auto w-[var(--container)] py-[var(--section-pad-y)]">
        <p className="font-roman text-[clamp(28px,4vw,44px)] leading-none font-semibold tracking-[0.3em]">
          {SECTION_LABELS.about}
        </p>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[3fr_2fr] md:items-start md:gap-14">
          <div>
            <h2 className="font-mincho border-b border-white pb-6 text-[clamp(30px,5.2vw,54px)] font-bold tracking-[0.16em]">
              {ABOUT_HEADING}
            </h2>
            {/* スマホは 16px。24px ベタ指定だと NEWS 本文 (15px) の1.6倍あって、
                サイト自身の文字サイズの基準から ABOUT だけ外れていた (2026-09-05 YD 指摘)。
                768〜1023px は本文の列が 390px しかなく、24px だと1行12字で11行に伸びるので 20px。
                lg 以上は Canva 草案に合わせた 24px。 */}
            <p className="font-mincho mt-8 text-[16px] leading-[2] tracking-[0.06em] md:mt-10 md:text-[20px] md:leading-[1.8] md:tracking-[0.1em] lg:text-[24px] lg:leading-[1.75] lg:tracking-[0.12em]">
              {body}
            </p>
          </div>

          <figure className="bleed-right relative aspect-[4/3] overflow-hidden">
            <Image
              src="/assets/about-1.webp"
              alt="撮影を終えて集合したハタチたちのメンバー"
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </figure>
        </div>

        <div className="mt-12 grid items-center gap-10 md:mt-16 md:grid-cols-[0.9fr_1fr] md:gap-14">
          <figure className="bleed-left relative aspect-[4/3] overflow-hidden">
            <Image
              src="/assets/about-2.webp"
              alt="体育館いっぱいに広がって記念撮影をするメンバー"
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </figure>

          <div>
            <p className="font-mincho text-[16px] leading-[2] tracking-[0.06em] md:text-[20px] md:leading-[1.8] md:tracking-[0.1em] lg:text-[24px] lg:leading-[1.75] lg:tracking-[0.12em]">
              {ABOUT_SUB}
            </p>

            {/* 草案の黒ピルは Canva テンプレートの英語プレースホルダー (VIEW UPCOMING GIGS)。
                リンク先が無いうちはボタンを出さない (押せない飾りを置かない)。 */}
            {ctaHref && (
              <div className="mt-10 md:text-right">
                <a
                  href={ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-ink focus-visible:outline-paper inline-block rounded-full px-10 py-4 text-base font-bold tracking-[0.2em] text-white transition-colors hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  {ctaLabel}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
