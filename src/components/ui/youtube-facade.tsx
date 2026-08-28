"use client";

import { useState } from "react";

function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    if (u.hostname.endsWith("youtube.com")) {
      if (u.searchParams.get("v")) return u.searchParams.get("v");
      const m = u.pathname.match(/^\/(embed|shorts|live)\/([\w-]{6,})/);
      if (m) return m[2];
    }
    return null;
  } catch {
    return null;
  }
}

type Props = {
  url: string;
  title: string;
};

// クリックされるまで iframe を読み込まないファサード。初期ロードから YouTube 一式を外す。
export function YouTubeFacade({ url, title }: Props) {
  const [playing, setPlaying] = useState(false);
  const videoId = extractVideoId(url);

  if (!videoId) return null;

  if (playing) {
    return (
      <iframe
        className="aspect-video w-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block aspect-video w-full cursor-pointer overflow-hidden bg-black"
      aria-label={`${title} を再生`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- ytimg は最適化不要の外部サムネ */}
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100"
        loading="lazy"
      />
      <span className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-coral text-white transition group-hover:scale-110">
        <svg width="20" height="24" viewBox="0 0 20 24" fill="currentColor" aria-hidden>
          <path d="M0 0 L20 12 L0 24 Z" />
        </svg>
      </span>
    </button>
  );
}
