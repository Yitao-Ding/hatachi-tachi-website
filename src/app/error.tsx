"use client";

import { useEffect } from "react";

// microCMS の障害などで再生成に失敗したときに Next の既定の 500 画面を見せない。
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="bg-paper flex min-h-[70svh] flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-mincho text-coral text-3xl font-bold tracking-[0.2em]">
        ページを表示できませんでした
      </p>
      <p className="text-ink-muted text-sm tracking-wider">
        時間をおいて、もう一度お試しください。
      </p>
      <button
        type="button"
        onClick={reset}
        className="border-navy text-navy hover:bg-navy focus-visible:outline-navy rounded-full border-2 px-8 py-3 font-mincho text-sm font-bold tracking-[0.2em] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        再読み込み
      </button>
    </main>
  );
}
