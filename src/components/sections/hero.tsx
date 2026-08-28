import { HERO } from "@/content/site";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { VerticalText } from "@/components/ui/vertical-text";

// ヒーロー: コラージュ背景 + 円陣写真 + 赤の「ハタチたち」レタリング。
// レタリングは Canva からの画像書き出し (透過PNG) 受領後に画像へ差し替える。
// 背景写真・円陣写真も同様 (/public/assets/hero-*.webp)。
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper-soft">
      {/* 白飛ばしした写真コラージュ背景 */}
      <div className="absolute inset-0 grid grid-cols-3 gap-2 opacity-25" aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => (
          <PlaceholderImage key={i} label="" className="h-full min-h-40" />
        ))}
      </div>
      <div className="absolute inset-0 bg-white/55" aria-hidden />

      <div className="relative mx-auto flex min-h-[92svh] w-[var(--container)] flex-col justify-center py-16">
        {/* タイトル上段 */}
        <p className="font-mincho text-coral select-none text-[clamp(64px,12vw,150px)] font-bold leading-none tracking-[0.18em]">
          ハタチ
        </p>

        <div className="relative mt-4 flex items-stretch gap-4 md:gap-8">
          {/* 左: 縦書きキャッチ */}
          <VerticalText className="font-mincho text-coral inline-block shrink-0 self-center text-xl font-bold md:text-3xl">
            {`「${HERO.catchVertical}」`}
          </VerticalText>

          {/* 中央: 円陣写真 */}
          <figure className="relative aspect-[16/10] w-full overflow-hidden border-4 border-white shadow-xl">
            <PlaceholderImage label="円陣写真 (hero-circle)" className="h-full w-full" />
          </figure>

          {/* 右: 縦書きリード */}
          <VerticalText className="font-mincho text-coral hidden shrink-0 self-start text-lg font-semibold md:inline-block md:text-2xl">
            {HERO.leadVertical}
          </VerticalText>
        </div>

        {/* タイトル下段 */}
        <p className="font-mincho text-coral select-none self-end text-[clamp(56px,10vw,130px)] font-bold leading-none tracking-[0.4em]">
          たち
        </p>

        {/* モバイルではリードを横書きで下に */}
        <p className="font-mincho text-coral mt-6 text-base font-semibold tracking-[0.2em] md:hidden">
          {HERO.leadVertical}
        </p>
      </div>
    </section>
  );
}
