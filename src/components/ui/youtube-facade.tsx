"use client";

import { useState } from "react";

type Props = {
  /** extractVideoId で取り出し済みの動画ID。呼び出し側で null を弾いてから渡す。 */
  videoId: string;
  title: string;
};

// クリックされるまで iframe を読み込まないファサード。初期ロードから YouTube 一式を外す。
export function YouTubeFacade({ videoId, title }: Props) {
  const [playing, setPlaying] = useState(false);
  // デスクトップでは枠が 1000px 超になるので、480px の hqdefault だとぼやける。
  // maxresdefault (1280px) を先に取り、無い動画 (404) だけ hqdefault に落とす。
  const [thumb, setThumb] = useState(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`);

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
      className="focus-visible:outline-navy group relative block aspect-video w-full cursor-pointer overflow-hidden bg-black focus-visible:outline-2 focus-visible:outline-offset-4"
      aria-label={`${title} を再生`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- ytimg は最適化不要の外部サムネ */}
      <img
        src={thumb}
        alt=""
        className="h-full w-full object-cover opacity-85 transition-opacity group-hover:opacity-100"
        loading="lazy"
        onError={() => setThumb(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)}
      />
      <span className="bg-coral group-hover:bg-coral-on-warm absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full text-white transition-colors">
        <svg width="20" height="24" viewBox="0 0 20 24" fill="currentColor" aria-hidden>
          <path d="M0 0 L20 12 L0 24 Z" />
        </svg>
      </span>
    </button>
  );
}
