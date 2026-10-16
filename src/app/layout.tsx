import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Sans_JP, Shippori_Mincho } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site-url";
import { SiteJsonLd } from "@/components/json-ld";

// 日本語フォントは preload しない。Google Fonts の日本語は unicode-range で
// 100以上のチャンクに分割されており、preload を有効にすると head に
// <link rel=preload> が 123 本 (約 3.8MB 相当) 並ぶ。
// preload を切っても @font-face は残り、必要なチャンクだけ遅延取得される。
const shippori = Shippori_Mincho({
  variable: "--font-shippori",
  weight: ["500", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const notoJp = Noto_Sans_JP({
  variable: "--font-noto-jp",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

// セクション見出しの欧文 (NEWS / ABOUT / INSTAGRAM)。欧文のみなので軽く、preload してよい。
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
});

const TITLE = "ハタチたち | 二十歳100人でつくるダンス映像プロジェクト";
// 検索結果に出る文。「成人式 ダンス 映像」などで探す人に届くよう、上映先 (site.ts の FEATURED_NEWS_LEAD にある事実) を入れる。
// Google は 80〜120 字で切るので、要点を前半に置く
const DESCRIPTION =
  "ハタチたちは、その年の二十歳100人でつくるダンス映像プロジェクト。ダンサー、撮影、運営、デザインまで全て二十歳だけで行い、完成した映像は川崎市・相模原市・福島市のはたちのつどい（成人式）とYouTubeで上映されます。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | ハタチたち" },
  description: DESCRIPTION,
  // 検索結果で写真を大きく出してよい、説明文の長さも制限しない (Google 向け)
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // canonical はページごとに指定する。ここで "/" を固定すると全ページがトップを指す。
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    siteName: "ハタチたち",
    locale: "ja_JP",
    url: "/",
    // 実写のOGPが届くまでのブランド準拠の暫定画像。差し替えはこのファイルを触らず
    // public/assets/ogp.jpg を置き換えるだけでよい。
    images: [{ url: "/assets/ogp.jpg", width: 1200, height: 630, alt: "ハタチたち" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/assets/ogp.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#ff5757",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // フォント変数は <html> に置く。<body> に置くと :root からは見えず、
    // globals.css の --ff-mincho / --ff-sans のチェーンが解決できずに無効化される。
    <html
      lang="ja"
      className={`${shippori.variable} ${notoJp.variable} ${cormorant.variable}`}
    >
      <body>
        <SiteJsonLd description={DESCRIPTION} />
        {children}
      </body>
    </html>
  );
}
