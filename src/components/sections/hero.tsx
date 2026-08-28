import { HERO } from "@/content/site";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

/*
 * 草案 (hc-000.png) の実測。カンバス 1152×648 = 16:9 ちょうど。
 * 数値は幅 W / 高さ H に対する比率。
 *
 *   背景コラージュ  3カラム 31.9% / 34.8% / 33.3%、隙間ゼロ。
 *                   中央カラムだけ上下2枚 (上 0→28.9%H、下 74.4%→100%H)。
 *                   間は主写真が覆うので画像が要らない。
 *   「ハタチ」      左 15.45%、上 12.8%H
 *   主写真          左 15.45%、上 28.9%H、幅 69.3%、2.70:1
 *   「たち」        右端が写真右端 (84.7%) に揃う、下 11.1%H
 *   縦書き2本       左 6.1% / 右 6.25%、どちらも写真の垂直中心 (51.6%H) 揃え
 *
 * この構図の要は「主写真がレタリングを食う」こと。
 * 「ハタチ」のタ・チの下端と「たち」の起筆が、写真の上辺・下辺で水平に切れている。
 * 縦に並べるだけだと草案の重なりが消えて、ただのバナーになる。
 * クリップは clip-path ではなく DOM 順 (レタリング → 写真) で作る。
 *
 * レタリングは装飾なので aria-hidden。読み上げと検索には sr-only の h1 を使う。
 */
export function Hero() {
  return (
    <section className="bg-paper-warm relative aspect-[3/4] w-full overflow-hidden md:aspect-[16/9]">
      {/* L0 背景コラージュ。白飛ばしして地としてだけ効かせる。継ぎ目は残す */}
      <div
        className="absolute inset-0 grid grid-cols-[31.9%_34.8%_33.3%] opacity-[0.35] grayscale"
        aria-hidden
      >
        <PlaceholderImage className="h-full w-full" />
        <div className="relative">
          <PlaceholderImage className="absolute inset-x-0 top-0 h-[28.9%] w-full" />
          <PlaceholderImage className="absolute inset-x-0 bottom-0 h-[25.6%] w-full" />
        </div>
        <PlaceholderImage className="h-full w-full" />
      </div>

      <h1 className="sr-only">
        ハタチたち｜二十歳100人でつくるダンス映像プロジェクト
      </h1>

      {/* L1 レタリング。写真より先に置いて、後ろに回す */}
      <p
        className="font-mincho text-coral absolute top-[9%] left-[13%] text-[15vw] leading-[1] font-bold tracking-[0.08em] md:top-[12.8%] md:left-[15.45%] md:text-[11vw]"
        aria-hidden
      >
        {HERO.titleUpper}
      </p>
      <p
        className="font-mincho text-coral absolute bottom-[9%] left-[40%] text-[15vw] leading-[1] font-bold tracking-[0.16em] md:bottom-[11.1%] md:left-[58%] md:text-[10.5vw]"
        aria-hidden
      >
        {HERO.titleLower}
      </p>

      {/* L2 主写真。不透明なので、重なったレタリングをここで切り落とす */}
      <figure className="absolute top-[34%] left-[12%] w-[76%] overflow-hidden bg-[#dedad4] md:top-[28.9%] md:left-[15.45%] md:w-[69.3%]">
        <div className="aspect-[16/9] md:aspect-[270/100]">
          <PlaceholderImage label="円陣写真 (hero-circle)" className="h-full w-full" />
        </div>
      </figure>

      {/* L3 縦書き。太字にせず細い明朝で、字送りは実測の 0.15em */}
      <p
        className="vertical-text font-mincho text-coral-on-warm absolute top-1/2 left-[5%] -translate-y-1/2 text-[3.6vw] tracking-[0.15em] md:left-[6.1%] md:text-[2.86vw]"
        aria-hidden
      >
        {HERO.catchVertical}
      </p>
      <p
        className="vertical-text font-mincho absolute top-1/2 right-[5%] -translate-y-1/2 text-[3vw] tracking-[0.15em] text-white md:right-[6.25%] md:text-[2.34vw]"
        aria-hidden
      >
        {HERO.leadVertical}
      </p>
    </section>
  );
}
