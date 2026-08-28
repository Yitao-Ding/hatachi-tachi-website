import type { SiteSettings } from "@/content/site";

/*
 * 草案には無いセクション。サイトの第一目的が「保護者・会場・協賛から見た信頼性の担保」
 * なのに、草案には運営主体・開催概要・連絡先が一切無いため追加した。
 * 値は microCMS の site から入れる。空のうちは何も出さない (空の器を見せない)。
 */

type Row = { label: string; value: string };

function rowsOf(site: SiteSettings): Row[] {
  const rows: Row[] = [];
  if (site.eventOutline) rows.push({ label: "開催概要", value: site.eventOutline });
  if (site.organizerName) rows.push({ label: "主催", value: site.organizerName });
  if (site.organizerNote) rows.push({ label: "運営", value: site.organizerNote });
  if (site.supportedBy) rows.push({ label: "協力", value: site.supportedBy });
  if (site.contactEmail) rows.push({ label: "お問い合わせ", value: site.contactEmail });
  return rows;
}

/** フッターのリンク出し分けと判定を必ず一致させるため、判定はここに集約する。 */
export function hasOutlineContent(site: SiteSettings): boolean {
  return rowsOf(site).length > 0;
}

type Props = {
  site: SiteSettings;
};

export function Outline({ site }: Props) {
  const rows = rowsOf(site);
  if (rows.length === 0) return null;

  return (
    <section id="outline" className="bg-paper-warm">
      <div className="mx-auto w-[var(--container)] py-[var(--section-pad-y)]">
        <h2 className="font-roman text-navy text-[clamp(26px,4vw,42px)] leading-none font-semibold tracking-[0.3em]">
          OUTLINE
        </h2>

        <dl className="border-ink/15 mt-10 border-t">
          {rows.map((row) => (
            <div
              key={row.label}
              className="border-ink/15 grid gap-1 border-b py-5 md:grid-cols-[10rem_1fr] md:gap-8"
            >
              <dt className="font-mincho text-[15px] font-bold tracking-[0.2em]">
                {row.label}
              </dt>
              <dd className="text-[15px] leading-[1.9] tracking-[0.05em] whitespace-pre-line">
                {row.label === "お問い合わせ" ? (
                  <a
                    href={`mailto:${row.value}`}
                    className="text-navy underline underline-offset-4"
                  >
                    {row.value}
                  </a>
                ) : (
                  row.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
