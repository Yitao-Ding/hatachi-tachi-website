import { INSTAGRAM_PROFILE_URL, STUDIO_METALI, type NewsItem } from "@/content/site";
import { toDateAttr } from "@/lib/format";
import { SITE_URL } from "@/lib/site-url";

// 検索エンジン向けの構造化データ (JSON-LD)。値はページに書いてある事実だけ。
// スタジオメタリ (studiometali.com) 側と同じ @id を使い、企画元と PD (Metalina) を同じ実体として結ぶ。

const ORG_ID = `${SITE_URL}/#org`;
const STUDIO_ORG_ID = `${STUDIO_METALI.url}#org`;
const STUDIO_PERSON_ID = `${STUDIO_METALI.url}#person`;

function Script({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** 全ページ共通: サイト名 (検索結果の上に出る) と、プロジェクトとしてのハタチたち */
export function SiteJsonLd({ description }: { description: string }) {
  const url = `${SITE_URL}/`;
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url,
            name: "ハタチたち",
            inLanguage: "ja",
            publisher: { "@id": ORG_ID },
          },
          {
            "@type": "Organization",
            "@id": ORG_ID,
            name: "ハタチたち",
            url,
            logo: `${SITE_URL}/icon.svg`,
            image: `${SITE_URL}/assets/ogp.jpg`,
            description,
            sameAs: [INSTAGRAM_PROFILE_URL],
            parentOrganization: {
              "@type": "Organization",
              "@id": STUDIO_ORG_ID,
              name: STUDIO_METALI.name,
              url: STUDIO_METALI.url,
            },
            founder: {
              "@type": "Person",
              "@id": STUDIO_PERSON_ID,
              name: "Metalina",
              url: STUDIO_METALI.url,
            },
          },
        ],
      }}
    />
  );
}

/** お知らせの記事。日付が無い記事は datePublished を出さない (憶測の日付を入れない) */
export function ArticleJsonLd({ item }: { item: NewsItem }) {
  const url = `${SITE_URL}/news/${item.id}`;
  const published = item.publishedDate ? toDateAttr(item.publishedDate) : "";
  const image = item.thumbnailUrl
    ? item.thumbnailUrl.startsWith("http")
      ? item.thumbnailUrl
      : `${SITE_URL}${item.thumbnailUrl}`
    : `${SITE_URL}/assets/ogp.jpg`;
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: item.title,
        url,
        mainEntityOfPage: url,
        image: [image],
        ...(published ? { datePublished: published } : {}),
        ...(item.lead ? { description: item.lead } : {}),
        inLanguage: "ja",
        author: { "@id": ORG_ID, "@type": "Organization", name: "ハタチたち", url: `${SITE_URL}/` },
        publisher: { "@id": ORG_ID, "@type": "Organization", name: "ハタチたち", url: `${SITE_URL}/` },
      }}
    />
  );
}
