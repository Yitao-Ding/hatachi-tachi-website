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
 * 配置は草案どおり「大1枚 + 小4枚」の非対称。プレースホルダーの時だけでなく
 * 実データでもこの構成を保つ。
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
  const side = others.slice(0, 4);

  return (
    <div ref={ref} className="grid gap-6 md:grid-cols-[1.1fr_1fr] md:gap-8">
      <div className="min-h-[420px]">{visible && main && <Post url={main} />}</div>
      {/*
       * 小4枚はスマホでは出さない。2カラムに押し込むと1枚あたり約185pxになり、
       * Instagram 埋め込みの最小幅を割って投稿タイトルが見切れ、「プロフィールを表示」の
       * ボタンが「Instagramで見る」に重なる (2026-09-05 YD 指摘)。
       * スマホでは大1枚と下のボタンで足りる。セクション高も 2301px → 約600px に落ちる。
       */}
      {side.length > 0 && (
        <div className="hidden grid-cols-2 gap-4 md:grid">
          {side.map((url) => (
            <div key={url} className="min-h-[200px]">
              {visible && <Post url={url} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
