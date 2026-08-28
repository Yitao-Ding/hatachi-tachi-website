import { HERO } from "@/content/site";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

/*
 * 草案 (hc-000.png) の実測比率。キャンバス幅 1151px を 100% とする:
 *   円陣写真      左 15.3% 〜 右 84.7% (幅 69.3%、比率 2.70:1)
 *   「ハタチ」     左 18.2% から
 *   「たち」       右端が 84.7% (写真の右端に揃う)
 *   左右の縦書き   左右 6% の位置
 * 単純な横並びにすると写真が両端まで広がって、草案のコラージュ的な余白が消える。
 *
 * 左右の縦書きは繋げて1文になる: ここからは私たちがつくる →「最強セカイ」
 * レタリングは装飾なので aria-hidden。読み上げと検索には sr-only の h1 を使う。
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper-warm">
      {/* 背景コラージュ。継ぎ目を出さないため gap は入れない。
          右の白い縦書きはこの写真の濃淡に乗って読ませる想定なので、
          白飛ばしはするが完全には飛ばしきらない */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2" aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => (
          <PlaceholderImage key={i} className="h-full w-full grayscale" />
        ))}
      </div>
      <div className="bg-paper-warm/60 absolute inset-0" aria-hidden />

      <h1 className="sr-only">
        ハタチたち｜二十歳100人でつくるダンス映像プロジェクト
      </h1>

      <div className="relative mx-auto w-[var(--container)] py-[clamp(36px,6vw,76px)]">
        <p
          className="font-mincho text-coral text-[clamp(56px,10.5vw,124px)] leading-[0.95] font-bold tracking-[0.12em] md:ml-[18.2%]"
          aria-hidden
        >
          {HERO.titleUpper}
        </p>

        <div className="relative mt-[clamp(8px,1.5vw,20px)]">
          {/* 草案の円陣写真は 約2.70:1 の横長。白フチ・影は付けない。
              モバイルでその比率だと細い帯になって何も見えないので 3:2 に寄せる */}
          <figure className="relative aspect-[3/2] w-full overflow-hidden md:mx-auto md:aspect-[270/100] md:w-[69.3%]">
            <PlaceholderImage
              label="円陣写真 (hero-circle)"
              className="h-full w-full"
            />
          </figure>

          <p
            className="vertical-text font-mincho text-coral-on-warm absolute top-1/2 left-0 hidden -translate-y-1/2 font-bold tracking-[0.3em] md:block md:text-2xl"
            aria-hidden
          >
            {HERO.catchVertical}
          </p>

          <p
            className="vertical-text font-mincho absolute top-0 right-0 hidden font-semibold tracking-[0.3em] text-white md:block md:text-xl"
            aria-hidden
          >
            {HERO.leadVertical}
          </p>
        </div>

        <p
          className="font-mincho text-coral mt-[clamp(4px,1vw,12px)] text-right text-[clamp(48px,9vw,112px)] leading-[0.95] font-bold tracking-[0.3em] md:mr-[15.3%]"
          aria-hidden
        >
          {HERO.titleLower}
        </p>

        {/* モバイルは縦書きが写真を潰すので、左右の縦書きを1文に戻して横書きで置く */}
        <p
          className="font-mincho text-coral-on-warm mt-4 text-[19px] font-bold tracking-[0.16em] md:hidden"
          aria-hidden
        >
          {HERO.leadVertical}
          {HERO.catchVertical}
        </p>
      </div>
    </section>
  );
}
