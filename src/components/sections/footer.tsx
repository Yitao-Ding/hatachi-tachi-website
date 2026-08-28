type Props = {
  contactEmail: string | null;
  instagramProfileUrl: string | null;
  entryFormUrl: string | null;
};

const NAV = [
  { href: "#news", label: "NEWS" },
  { href: "#about", label: "ABOUT" },
  { href: "#now-playing", label: "NOW PLAYING" },
  { href: "#archive", label: "ARCHIVE" },
  { href: "#instagram", label: "INSTAGRAM" },
];

export function Footer({ contactEmail, instagramProfileUrl, entryFormUrl }: Props) {
  return (
    <footer className="bg-coral text-white">
      <div className="mx-auto w-[var(--container)] py-14">
        <p className="font-mincho text-2xl font-bold tracking-[0.3em]">ハタチたち</p>

        <nav className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm tracking-[0.2em]">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:opacity-70">
              {item.label}
            </a>
          ))}
          {instagramProfileUrl && (
            <a
              href={instagramProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:opacity-70"
            >
              OFFICIAL INSTAGRAM
            </a>
          )}
          {entryFormUrl && (
            <a
              href={entryFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:opacity-70"
            >
              参加応募
            </a>
          )}
        </nav>

        {contactEmail && (
          <p className="mt-6 text-sm tracking-wider">
            お問い合わせ:{" "}
            <a href={`mailto:${contactEmail}`} className="underline underline-offset-4">
              {contactEmail}
            </a>
          </p>
        )}

        <p className="mt-10 text-xs tracking-[0.2em] text-white/80">
          © {new Date().getFullYear()} ハタチたち
        </p>
      </div>
    </footer>
  );
}
