import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { InstagramGrid } from "@/components/sections/instagram-grid";
import { LockBack } from "@/components/sections/lock-back";
import { NewsSection } from "@/components/sections/news-section";
import { NowPlaying } from "@/components/sections/now-playing";
import { Outline } from "@/components/sections/outline";
import { getArchiveList, getNewsList, getSiteSettings } from "@/lib/microcms";
import { hasOutlineContent } from "@/components/sections/outline";

// SSG + microCMS Webhook 再ビルドが基本。revalidate は Webhook が落ちた時の保険。
export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [news, archive, site] = await Promise.all([
    getNewsList(),
    getArchiveList(),
    getSiteSettings(),
  ]);

  const present = {
    news: news.length > 0,
    archive: archive.length > 0,
    outline: hasOutlineContent(site),
  };

  return (
    <>
      <main>
        <Hero />
        <NewsSection items={news} />
        <About
          body={site.aboutBody}
          ctaHref={site.entryFormUrl}
          ctaLabel="ダンサー募集に応募する"
        />
        <NowPlaying url={site.nowPlayingUrl} caption={site.nowPlayingCaption} />
        <LockBack items={archive} />
        <InstagramGrid
          postUrls={site.instagramPostUrls}
          profileUrl={site.instagramProfileUrl}
        />
        <Outline site={site} />
      </main>
      <Footer
        contactEmail={site.contactEmail}
        instagramProfileUrl={site.instagramProfileUrl}
        entryFormUrl={site.entryFormUrl}
        organizerName={site.organizerName}
        present={present}
        year={new Date().getFullYear()}
      />
    </>
  );
}
