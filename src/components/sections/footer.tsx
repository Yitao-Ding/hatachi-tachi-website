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
 * 草案のフッターは中身の無い赤帯だが、公式サイトとして連絡手段と主催表記が
 * どこにも無いのは「信頼性の担保」という目的に反するので最小限だけ入れる。
 * 珊瑚 #ff5757 の上なので、文字は必ず不透明の白 (半透明にすると 2.4:1 まで落ちる)。
 */
export function Footer({
  contactEmail,
  instagramProfileUrl,
  entryFormUrl,
  organizerName,
  present,
  year,
}: Props) {
  const nav = [
    ...(present.news ? [{ href: "#news", label: SECTION_LABELS.news }] : []),
    { href: "#about", label: SECTION_LABELS.about },
    { href: "#now-playing", label: SECTION_LABELS.nowPlaying },
    ...(present.archive ? [{ href: "#archive", label: SECTION_LABELS.archive }] : []),
    { href: "#instagram", label: SECTION_LABELS.instagram },
    ...(present.outline ? [{ href: "#outline", label: "OUTLINE" }] : []),
  ];

  return (
    <footer className="bg-coral text-white">
      <div className="mx-auto w-[var(--container)] py-14">
        <p className="font-mincho text-2xl font-bold tracking-[0.3em]">ハタチたち</p>

        <nav aria-label="サイト内" className="mt-6">
          <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm tracking-[0.2em]">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="focus-visible:outline-paper transition hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {(instagramProfileUrl || entryFormUrl) && (
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm tracking-[0.2em]">
            {instagramProfileUrl && (
              <li>
                <a
                  href={instagramProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
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
                  className="underline underline-offset-4"
                >
                  ダンサー応募
                </a>
              </li>
            )}
          </ul>
        )}

        {/* OUTLINE が出ているときはそちらに連絡先があるので、ここでは繰り返さない */}
        {contactEmail && !present.outline && (
          <p className="mt-8 text-sm tracking-wider">
            お問い合わせ{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="underline underline-offset-4"
            >
              {contactEmail}
            </a>
          </p>
        )}

        <p className="mt-10 text-xs tracking-[0.2em]">
          © {year} {organizerName || "ハタチたち"}
        </p>
      </div>
    </footer>
  );
}
