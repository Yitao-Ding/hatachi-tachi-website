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
      document.body.appendChild(s);
    });
  }
  return scriptLoading;
}

type Props = {
  postUrls: string[];
};

// Instagram 公式 blockquote 埋め込み。embed.js が重いので、
// セクションが視界に入るまで読み込まない + 高さプレースホルダーでレイアウトシフトを防ぐ。
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

  return (
    <div ref={ref} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {postUrls.map((url) => (
        <div key={url} className="min-h-[480px]">
          {visible && (
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={url}
              data-instgrm-version="14"
              style={{ margin: 0, width: "100%" }}
            >
              <a href={url}>Instagramで見る</a>
            </blockquote>
          )}
        </div>
      ))}
    </div>
  );
}
