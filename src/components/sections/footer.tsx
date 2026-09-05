import { SECTION_LABELS } from "@/content/site";

type Props = {
  contactEmail: string | null;
  instagramProfileUrl: string | null;
  entryFormUrl: string | null;
  organizerName: string;
  /** 中身が無いセクションはリンクを出さない (押しても何も起きない死にリンクを作らない) */
  present: {
    news: boolean;
    archive: boolean;
    outline: boolean;
  };
  year: number;
};

/*
 * 草案のフッターは中身の無い赤帯。公式サイトとして連絡手段と主催表記がどこにも無いのは
 * 「信頼性の担保」という目的に反するので最小限だけ入れる。
 *
 * 珊瑚 #ff5757 に白文字は 3.11:1 で、WCAG の大文字基準 (24px、または18.67px以上の太字)
 * を満たすサイズでしか使えない。著作権表記を24pxにするのは不自然なので、
 * 帯にはワードマークとナビだけを置き、細かい文字は下の白地に落とす。
 */
export function Footer({
  contactEmail,
  instagramProfileUrl,
  entryFormUrl,
  organizerName,
  present,
  year,
}: Props) {
  // "/#news" にしているのは、このフッターがお知らせ一覧・詳細にも出るため。
  // "#news" だとサブページ上では同じページ内を探して何も起きない。
  // トップ上では "/#news" もフラグメント移動として扱われるのでリロードは起きない。
  const nav = [
    ...(present.news ? [{ href: "/#news", label: SECTION_LABELS.news }] : []),
    { href: "/#about", label: SECTION_LABELS.about },
    { href: "/#now-playing", label: SECTION_LABELS.nowPlaying },
    ...(present.archive ? [{ href: "/#archive", label: SECTION_LABELS.archive }] : []),
    { href: "/#instagram", label: SECTION_LABELS.instagram },
    ...(present.outline ? [{ href: "/#outline", label: "OUTLINE" }] : []),
  ];

  return (
    <footer>
      <div className="bg-coral text-white">
        <div className="mx-auto w-[var(--container)] py-14">
          <p className="font-mincho text-[28px] font-bold tracking-[0.3em] md:text-[32px]">
            ハタチたち
          </p>

          <nav aria-label="サイト内" className="mt-8">
            {/* リンクの縦のタップ領域は文字の行高だけだと 27〜29px しかない (2026-09-05 実測)。
                py-1.5 で 48px にする。行間は gap-y を減らして見た目の間隔を保つ */}
            <ul className="flex flex-wrap gap-x-8 gap-y-0 text-[19px] font-bold tracking-[0.15em] md:text-[20px]">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="focus-visible:outline-paper inline-block py-1.5 transition-colors hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {(instagramProfileUrl || entryFormUrl) && (
            <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-0 text-[19px] font-bold tracking-[0.15em] md:text-[20px]">
              {instagramProfileUrl && (
                <li>
                  <a
                    href={instagramProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-visible:outline-paper inline-block py-1.5 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    公式Instagram
                  </a>
                </li>
              )}
              {entryFormUrl && (
                <li>
                  <a
                    href={entryFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-visible:outline-paper inline-block py-1.5 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    ダンサー応募
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* 小さい文字は白地に置く。珊瑚の上では 14px の白は 3.11:1 で基準を満たせない */}
      <div className="bg-paper text-ink">
        <div className="mx-auto flex w-[var(--container)] flex-col gap-2 py-6 text-sm tracking-wider md:flex-row md:items-center md:justify-between">
          {/* OUTLINE が出ているときはそちらに連絡先があるので繰り返さない */}
          {contactEmail && !present.outline ? (
            <p>
              お問い合わせ{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="text-navy underline underline-offset-4"
              >
                {contactEmail}
              </a>
            </p>
          ) : (
            <span />
          )}
          <p className="text-ink-muted">
            © {year} {organizerName || "ハタチたち"}
          </p>
        </div>
      </div>
    </footer>
  );
}
