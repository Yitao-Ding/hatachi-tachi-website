import { Footer } from "@/components/sections/footer";
import { hasOutlineContent } from "@/components/sections/outline";
import { getArchiveList, getNewsList, getSiteSettings } from "@/lib/microcms";

/*
 * フッターに必要なデータの取得をここに閉じ込める。
 * トップだけでなくお知らせ一覧・詳細にも同じフッターを出すため
 * (Instagram から詳細ページに直接来た保護者が、連絡手段も主催表記も無いページで
 * 行き止まりになっていた。2026-09-05)。
 * トップでは同じ取得がセクション描画側でも走るが、同一リクエスト内の fetch は
 * Next が重複排除するので二重取得にはならない。
 */
export async function SiteFooter() {
  const [news, archive, site] = await Promise.all([
    getNewsList(),
    getArchiveList(),
    getSiteSettings(),
  ]);

  return (
    <Footer
      contactEmail={site.contactEmail}
      instagramProfileUrl={site.instagramProfileUrl}
      entryFormUrl={site.entryFormUrl}
      organizerName={site.organizerName}
      present={{
        news: news.length > 0,
        archive: archive.length > 0,
        outline: hasOutlineContent(site),
      }}
      year={new Date().getFullYear()}
    />
  );
}
