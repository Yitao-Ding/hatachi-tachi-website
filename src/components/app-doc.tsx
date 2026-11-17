import Link from "next/link";
import { APP_NAME, type LegalSection } from "@/content/app-legal";

/*
 * アプリ「ハタチたちスクール」の利用規約・プライバシーポリシー・サポート (/app/*) の枠。
 * App Store Connect に出す URL のためのページで、読む文書なのでサイトの他のページ (明朝の縦書き・コラージュ) と違い
 * 横書きの普通の本文にしている。サイトのトップやナビからはリンクしない。置くリンクは3ページ同士だけ。
 */

const PAGES = [
  { href: "/app/terms", label: "利用規約" },
  { href: "/app/privacy", label: "プライバシーポリシー" },
  { href: "/app/support", label: "サポート" },
] as const;

export type AppDocPath = (typeof PAGES)[number]["href"];

export const linkClass =
  "text-navy underline underline-offset-[0.2em] focus-visible:outline-navy focus-visible:outline-2 focus-visible:outline-offset-2";

export function AppDocPage({
  current,
  title,
  updatedAt,
  children,
}: {
  current: AppDocPath;
  title: string;
  updatedAt?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="bg-paper">
      <div className="mx-auto w-[min(720px,92vw)] py-12 md:py-16">
        <header>
          <p className="font-bold">{APP_NAME}</p>
          <p className="text-ink-muted text-sm">ハタチたちの参加者と運営のためのアプリです。</p>
          <nav aria-label="アプリの文書" className="mt-4">
            <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
              {PAGES.map((p) => (
                <li key={p.href}>
                  {p.href === current ? (
                    <span aria-current="page" className="font-bold">
                      {p.label}
                    </span>
                  ) : (
                    <Link href={p.href} className={linkClass}>
                      {p.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <h1 className="font-mincho mt-12 text-2xl font-bold tracking-wider">{title}</h1>
        {updatedAt && <p className="text-ink-muted mt-2 text-sm">更新日 {updatedAt}</p>}

        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}

export function DocSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="font-mincho text-lg font-bold tracking-wider">{heading}</h2>
      <div className="mt-2 space-y-3">{children}</div>
    </section>
  );
}

/** legal.ts の本文をそのまま出す。箇条の行は "\n" で区切られているので改行を残す */
export function LegalSections({ sections }: { sections: LegalSection[] }) {
  return sections.map((s) => (
    <DocSection key={s.heading} heading={s.heading}>
      <p className="whitespace-pre-line">{s.body}</p>
    </DocSection>
  ));
}
