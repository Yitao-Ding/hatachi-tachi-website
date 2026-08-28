// microCMS 未接続 (env なし) / 取得失敗時のフォールバック。
// 文言は Canva 草案 (DAHTaN6Dxr8) の原文、URL・作品名は公式 YouTube
// (スタジオメタリ @Studio_Metali) と公式 Instagram (@hatachi_tachi) の実データ。
// 推測で埋めた値はこのファイルに置かない。

export type NewsItem = {
  id: string;
  title: string;
  /** 空文字なら日付を表示しない。憶測の日付を入れないため。 */
  publishedDate: string;
  /** トップの NEWS に出す短いリード文。空なら出さない。 */
  lead: string;
  thumbnailUrl: string | null;
  /** サニタイズ済み HTML */
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
  /** 以下は「信頼性の担保」用。空なら該当セクションごと出さない。 */
  organizerName: string;
  organizerNote: string;
  eventOutline: string;
  supportedBy: string;
};

export const HERO = {
  /** 読み上げ・SEO 用の正式名。見た目は「ハタチ」「たち」に分割して組む。 */
  title: "ハタチたち",
  titleUpper: "ハタチ",
  titleLower: "たち",
  /** 草案では左右の縦書きで1つの文になっている: ここからは私たちがつくる →「最強セカイ」 */
  catchVertical: "「最強セカイ」",
  leadVertical: "ここからは私たちがつくる",
} as const;

export const SECTION_LABELS = {
  news: "NEWS",
  about: "ABOUT",
  nowPlaying: "NOW PLAYING",
  /** 草案の表記どおり。英語としては LOOK BACK の誤記の可能性があり YD 確認中。 */
  archive: "LOCK BACK",
  instagram: "INSTAGRAM",
} as const;

export const ABOUT_HEADING = "ハタチたちとは。";

// 草案の原文は「二十歳の台」。「代」の誤記と判断して直している (YD 確認事項)。
export const ABOUT_SUB =
  "運営、パートリーダー、制作、デザイナーまで全て毎年二十歳の代のみで行っている。";

// 草案の原文をそのまま (改行位置は草案のデスクトップ幅に合わせたものなので、
// 表示側では文単位で折り返す。ここでは改行を意味の区切りとしてのみ使う)
export const FALLBACK_ABOUT_BODY = [
  "その年の二十歳100人で作るダンス映像プロジェクト",
  "コロナによって様々な機会を奪われ、「できない」ことが多かった若者たち。",
  "そんな若者は自信を持てず、将来に対する不安を募らせる者が多い。",
  "その不安を自信に変えたい。",
  "なんだってできると実感して欲しいとハタチのみで作りあげるイベント",
].join("\n");

/** NEWS トップに出すリード文 (草案の本文3行)。 */
export const FEATURED_NEWS_LEAD =
  "川崎市・相模原市・福島市のはたちのつどい、そしてYOUTUBEにて上映される、二十歳100人でつくるダンス映像『ハタチたち5』。一生に一度の記念に、ぜひご応募ください！";

export const FALLBACK_NEWS: NewsItem[] = [
  {
    id: "hatachitachi-5",
    title: "ハタチたち5 開催決定！ & ダンサー募集中！",
    publishedDate: "",
    lead: FEATURED_NEWS_LEAD,
    thumbnailUrl: null,
    body:
      "<p>川崎市・相模原市・福島市のはたちのつどい、そしてYouTubeにて上映される、" +
      "二十歳100人でつくるダンス映像『ハタチたち5』。一生に一度の記念に、ぜひご応募ください。</p>",
    externalUrl: null,
  },
];

// 実在する公開作品のみ。ハタチたち5 は未制作なのでアーカイブに入れない
// (草案には6枠目があるが、同じページの NEWS「開催決定！」と矛盾するため。YD 確認事項)。
export const FALLBACK_ARCHIVE: ArchiveItem[] = [
  {
    id: "gen-1",
    title: "初代 ハタチたち",
    year: "2023",
    imageUrl: null,
    videoUrl: "https://youtu.be/pkBvdMpLzx8",
    sortOrder: 1,
  },
  {
    id: "gen-2",
    title: "ハタチたち2",
    year: "2024",
    imageUrl: null,
    videoUrl: "https://youtu.be/SLzwOObZcm8",
    sortOrder: 2,
  },
  {
    id: "gen-3",
    title: "ハタチたち3",
    year: "2025",
    imageUrl: null,
    videoUrl: "https://youtu.be/DQTgxCvuGRY",
    sortOrder: 3,
  },
  {
    id: "gen-4",
    title: "ハタチたち4",
    year: "2026",
    imageUrl: null,
    videoUrl: "https://youtu.be/RigEjrlltEM",
    sortOrder: 4,
  },
  {
    id: "heiseitachi",
    title: "平成たち祭",
    year: "",
    imageUrl: null,
    videoUrl: null,
    sortOrder: 5,
  },
];

export const FALLBACK_SITE: SiteSettings = {
  // 最新作 (ハタチたち4) を初期表示にする
  nowPlayingUrl: "https://youtu.be/RigEjrlltEM",
  nowPlayingCaption: "ハタチたち4 -「ピーターパン」優里",
  instagramPostUrls: [],
  instagramProfileUrl: "https://www.instagram.com/hatachi_tachi/",
  entryFormUrl: null,
  aboutBody: FALLBACK_ABOUT_BODY,
  contactEmail: null,
  organizerName: "",
  organizerNote: "",
  eventOutline: "",
  supportedBy: "",
};
