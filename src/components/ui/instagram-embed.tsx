"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

let scriptLoading: Promise<void> | null = null;

function loadEmbedScript(): Promise<void> {
  if (window.instgrm) return Promise.resolve();
  if (!scriptLoading) {
    scriptLoading = new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = "https://www.instagram.com/embed.js";
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => resolve(); // 失敗しても permalink リンクは残るので握って進む
      document.body.appendChild(s);
    });
  }
  return scriptLoading;
}

function Post({ url }: { url: string }) {
  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{ margin: 0, width: "100%", minWidth: 0 }}
    >
      <a href={url} target="_blank" rel="noopener noreferrer">
        Instagramで見る
      </a>
    </blockquote>
  );
}

type Props = {
  postUrls: string[];
};

/*
 * Instagram 公式の blockquote 埋め込み。embed.js は重くレイアウトシフトも起こすので、
 * セクションが視界に近づくまで読み込まない。
 *
 * 配置は「大1枚 + 小1枚」。草案は小4枚だが、embed.js が iframe に
 * min-width: 326px を強制で付けるため、4枚を2列に押し込むとセル251pxに対して
 * 326pxが乗り、隣と重なったうえページ全体に横スクロールが出る (2026-09-05 実測で
 * scrollWidth 2206px / viewport 1280px)。小1枚なら右列433pxで最小幅を余裕で満たす。
 *
 * 列幅を 345px 固定にしているのはリールのため。リール埋め込みは幅が広いと中身を
 * 描画しない (2026-09-05 実測: 477pxで全面白、570pxで下3分の1が白紙、400pxでも
 * いいね行が切れて下に90pxの空白。iframe の高さ自体は確保されるので気づきにくい)。
 * 345px なら動画・いいね・コメント行まで最後まで出る。
 * 列幅をトラック任せにすると Instagram 側の min-width 326px に引っ張られて
 * ビューポートごとに幅がばらつくので、lg 以上はトラックを 345px で明示する。
 *
 * 2枚目を lg (1024px) から出しているのは、345px×2 + gap32 = 722px が
 * container = min(1120px, 92vw) に余裕で収まる最初のブレークポイントのため。
 */
export function InstagramEmbeds({ postUrls }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    loadEmbedScript().then(() => window.instgrm?.Embeds.process());
  }, [visible]);

  const [main, ...others] = postUrls;
  const side = others[0];

  return (
    <div
      ref={ref}
      className="mx-auto grid max-w-[345px] gap-6 lg:max-w-none lg:grid-cols-[345px_345px] lg:justify-center lg:gap-8"
    >
      <div className="min-h-[420px] overflow-hidden">
        {visible && main && <Post url={main} />}
      </div>
      {/*
       * 小さいほうは lg 未満では出さない。列が最小幅326pxを割るのが理由 (上の説明)。
       * スマホ・タブレットでは大1枚と下の「公式Instagramを見る」で足りる。
       * overflow-hidden は保険。embed.js の読み込みに失敗した iframe が幅を
       * 取り違えることがあり (2026-09-05 に1枚が1265px×2pxになった)、
       * そのときページ全体が横に伸びるのを列の中で止める。
       */}
      {side && (
        <div className="hidden min-h-[420px] overflow-hidden lg:block">
          {visible && <Post url={side} />}
        </div>
      )}
    </div>
  );
}
