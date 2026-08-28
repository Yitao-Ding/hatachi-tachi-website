import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Shippori_Mincho } from "next/font/google";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// 日本語ファミリは 2 つ・各 2 ウェイトまで (転送量対策、salamat PA-01 の教訓)。
const notoJp = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const shippori = Shippori_Mincho({
  variable: "--font-shippori",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

const DESCRIPTION =
  "ハタチたちは、その年の二十歳100人で作るダンス映像プロジェクト。運営、パートリーダー、制作、デザイナーまで全て二十歳の代のみで行っています。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ハタチたち | 二十歳100人で作るダンス映像プロジェクト",
    template: "%s | ハタチたち",
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: "ハタチたち | 二十歳100人で作るダンス映像プロジェクト",
    description: DESCRIPTION,
    type: "website",
    siteName: "ハタチたち",
    locale: "ja_JP",
    url: "/",
    images: [{ url: "/assets/ogp.jpg", width: 1200, height: 630, alt: "ハタチたち" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ハタチたち",
    description: DESCRIPTION,
    images: ["/assets/ogp.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f1554f",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className={`${notoJp.variable} ${shippori.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
