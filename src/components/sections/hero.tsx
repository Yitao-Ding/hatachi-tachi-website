import Image from "next/image";
import { HERO } from "@/content/site";

/*
 * 背景コラージュの4枚。枠の縦横に合わせて縦写真・横写真を割り当ててある
 * (左右のカラムは縦長、中央の上下は横長)。差し替えるときは
 * scripts/build-assets.mjs の bg 定義を直して再生成する。
 */
const BG = [
  "/assets/hero-bg-1.webp",
  "/assets/hero-bg-2.webp",
  "/assets/hero-bg-3.webp",
  "/assets/hero-bg-4.webp",
] as const;

function BgImage({ src, sizes }: { src: string; sizes: string }) {
  return <Image src={src} alt="" fill sizes={sizes} className="object-cover" />;
}

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
/*
 * モバイルは草案の構図をそのまま縦長に潰すのではなく、3:4 のまま画面中央に置く。
 * aspect-[3/4] 固定だと iPhone (390×844) で高さ 520px しか使わず、スクロールなしで
 * NEWS の紺帯が顔を出して第一印象が窮屈になっていた (2026-09-05 YD 指摘)。
 * 構図の比率は触らずに、上下の紙色の余白で画面を埋める。
 */
export function Hero() {
  return (
    <section className="bg-paper-warm grid min-h-[100svh] w-full place-items-center overflow-hidden md:block md:min-h-0">
      <div className="relative aspect-[3/4] w-full overflow-hidden md:aspect-[16/9]">
      {/*
       * L0 背景コラージュ。白飛ばしして地としてだけ効かせる。継ぎ目は残す。
       *
       * 左右の端はマスクで抜いてある。ここには珊瑚の縦書きが乗るので、写真の暗い部分が
       * そのまま出るとコントラストが 1.46:1 まで落ちて読めなくなる (実測値。
       * scripts/check-hero-contrast.mjs で再現できる)。
       * 珊瑚を 3:1 に乗せるには背景がほぼ紙色である必要があり、不透明度を下げるだけでは
       * 足りない (真っ黒な写真を 4.5% まで薄めないと届かない = コラージュが消える)。
       * そのため「全体を薄くする」のではなく「文字が乗る帯だけ抜く」で解いている。
       */}
      <div
        className="hero-collage-mask absolute inset-0 grid grid-cols-[31.9%_34.8%_33.3%] opacity-[0.3] grayscale brightness-[1.35]"
        aria-hidden
      >
        <div className="relative">
          <BgImage src={BG[0]} sizes="32vw" />
        </div>
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-[28.9%]">
            <BgImage src={BG[1]} sizes="35vw" />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[25.6%]">
            <BgImage src={BG[2]} sizes="35vw" />
          </div>
        </div>
        <div className="relative">
          <BgImage src={BG[3]} sizes="34vw" />
        </div>
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
      {/* スマホは写真を少し内側に寄せて、左右の縦書きとの間隔を空ける。
          縦書きを 16.4〜18.7px に上げた結果、左の縦書きの右端と写真の左端が
          11px しか離れておらず、写真に貼り付いて見えていた (2026-09-05 指摘)。 */}
      <figure className="absolute top-[34%] left-[16%] w-[69%] overflow-hidden bg-[#dedad4] md:top-[28.9%] md:left-[15.45%] md:w-[69.3%]">
        <div className="relative aspect-[16/9] md:aspect-[270/100]">
          <Image
            src="/assets/hero-circle.webp"
            alt="体育館で円陣を組むハタチたちのメンバー"
            fill
            sizes="(min-width: 768px) 70vw, 69vw"
            priority
            className="object-cover"
          />
        </div>
      </figure>

      {/* L3 縦書き。太字にせず細い明朝で、字送りは実測の 0.15em */}
      <p
        className="vertical-text font-mincho text-coral-on-warm absolute top-1/2 left-[4%] -translate-y-1/2 text-[4.8vw] tracking-[0.15em] max-md:leading-[1.15] md:left-[6.1%] md:text-[2.86vw]"
        aria-hidden
      >
        {HERO.catchVertical}
      </p>
      {/* 草案では白だったが、2026-09-03 YD 判断で左の縦書きと同じ珊瑚に揃えた。
          「ここからは私たちがつくる最強セカイ」で一文なので、色が割れているほうが不自然。 */}
      <p
        className="vertical-text font-mincho text-coral-on-warm absolute top-1/2 right-[4%] -translate-y-1/2 text-[4.2vw] tracking-[0.15em] max-md:leading-[1.15] md:right-[6.25%] md:text-[2.34vw]"
        aria-hidden
      >
          {HERO.leadVertical}
        </p>
      </div>
    </section>
  );
}
