import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70svh] flex-col items-center justify-center gap-8 bg-paper">
      <p className="font-mincho text-coral text-6xl font-bold tracking-[0.2em]">404</p>
      <p className="tracking-[0.2em]">ページが見つかりませんでした。</p>
      <Link
        href="/"
        className="border-2 border-navy px-8 py-3 font-mincho text-sm font-bold tracking-[0.25em] text-navy transition-colors hover:bg-navy hover:text-white"
      >
        トップへ戻る
      </Link>
    </main>
  );
}
