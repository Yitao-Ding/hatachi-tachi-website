import { About } from "@/components/sections/about";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { InstagramGrid } from "@/components/sections/instagram-grid";
import { LockBack } from "@/components/sections/lock-back";
import { NewsSection } from "@/components/sections/news-section";
import { NowPlaying } from "@/components/sections/now-playing";
import { getArchiveList, getNewsList, getSiteSettings } from "@/lib/microcms";

// SSG + Webhook 再ビルドが基本。revalidate は Webhook 失敗時の保険。
export const revalidate = 3600;

export default async function Home() {
  const [news, archive, site] = await Promise.all([
    getNewsList(),
    getArchiveList(),
    getSiteSettings(),
  ]);

  return (
    <main>
      <Hero />
      <NewsSection items={news} />
      <About body={site.aboutBody} />
      <NowPlaying url={site.nowPlayingUrl} caption={site.nowPlayingCaption} />
      <LockBack items={archive} />
      <InstagramGrid
        postUrls={site.instagramPostUrls}
        profileUrl={site.instagramProfileUrl}
      />
      <Footer
        contactEmail={site.contactEmail}
        instagramProfileUrl={site.instagramProfileUrl}
        entryFormUrl={site.entryFormUrl}
      />
    </main>
  );
}
