// microCMS 未接続 (env なし) / 取得失敗時のフォールバック。
// Canva 草案の実コピーをそのまま正として持つ。microCMS 側に実データが入れば上書きされる。

export type NewsItem = {
  id: string;
  title: string;
  publishedDate: string;
  thumbnailUrl: string | null;
  body: string;
  externalUrl: string | null;
};

export type ArchiveItem = {
  id: string;
  title: string;
  year: string;
  imageUrl: string | null;
  videoUrl: string | null;
  sortOrder: number;
};

export type SiteSettings = {
  nowPlayingUrl: string | null;
  nowPlayingCaption: string;
  instagramPostUrls: string[];
  instagramProfileUrl: string | null;
  entryFormUrl: string | null;
  aboutBody: string;
  contactEmail: string | null;
};

export const HERO = {
  title: "ハタチたち",
  catchVertical: "最強セカイ",
  leadVertical: "ここからは私たちがつくる",
} as const;

export const ABOUT_HEADING = "ハタチたちとは。";

export const ABOUT_SUB =
  "運営、パートリーダー、制作、デザイナーまで全て毎年二十歳の代のみで行っている。";

export const FALLBACK_ABOUT_BODY = [
  "その年の二十歳100人で作る",
  "ダンス映像プロジェクト",
  "コロナによって様々な機会を奪われ、",
  "「できない」ことが多かった若者たち。",
  "そんな若者は自信を持てず、",
  "将来に対する不安を募らせる者が多い。",
  "その不安を自信に変えたい。",
  "なんだってできると実感して欲しいとハタチのみで",
  "作りあげるイベント",
].join("\n");

export const FALLBACK_NEWS: NewsItem[] = [
  {
    id: "hatachitachi-5",
    title: "ハタチたち5 開催決定！",
    publishedDate: "2026-08-01",
    thumbnailUrl: null,
    body: "<p>ハタチたち5の開催が決定しました。詳細は追ってお知らせします。</p>",
    externalUrl: null,
  },
];

export const FALLBACK_ARCHIVE: ArchiveItem[] = [
  { id: "gen-1", title: "初代 ハタチたち", year: "", imageUrl: null, videoUrl: null, sortOrder: 1 },
  { id: "gen-2", title: "ハタチたち2", year: "", imageUrl: null, videoUrl: null, sortOrder: 2 },
  { id: "gen-3", title: "ハタチたち3", year: "", imageUrl: null, videoUrl: null, sortOrder: 3 },
  { id: "gen-4", title: "ハタチたち4", year: "", imageUrl: null, videoUrl: null, sortOrder: 4 },
  { id: "gen-5", title: "ハタチたち5", year: "", imageUrl: null, videoUrl: null, sortOrder: 5 },
  { id: "heisei", title: "平成たち祭", year: "", imageUrl: null, videoUrl: null, sortOrder: 6 },
];

export const FALLBACK_SITE: SiteSettings = {
  nowPlayingUrl: null,
  nowPlayingCaption: "",
  instagramPostUrls: [],
  instagramProfileUrl: null,
  entryFormUrl: null,
  aboutBody: FALLBACK_ABOUT_BODY,
  contactEmail: null,
};
