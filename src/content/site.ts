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
  /**
   * どの企画の作品か。今はハタチたちしか無いので全て "hatachitachi"。
   * 将来スタジオメタリのサイトを足すときに、archive API を作り直さずに
   * 企画で絞り込めるようにするためのフィールド (microCMS のスキーマは
   * 後から変えると入力済みコンテンツの入れ直しが要るので先に入れてある)。
   */
  project: string;
  /**
   * 制作中の枠。動画がまだ無いが「今つくっている」ことを見せたいものに立てる。
   * videoUrl が無いだけでは判別できない (平成たち祭は制作中ではなく動画が無いだけ)。
   */
  inProduction: boolean;
};

/** archive.project の既定値。microCMS 側で未入力ならこれとして扱う。 */
export const DEFAULT_PROJECT = "hatachitachi";

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
  /**
   * 草案の表記は "LOCK BACK" だったが、英語としては LOOK BACK の誤記。
   * 2026-09-03 YD 判断で修正。ここを直すとフッターのリンク名まで揃う。
   */
  archive: "LOOK BACK",
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

/** 募集告知の元になっている公式Instagramの投稿 (2026-08-01)。 */
export const ENTRY_POST_URL = "https://www.instagram.com/p/Dbf2tjXEwDj/";
export const INSTAGRAM_PROFILE_URL = "https://www.instagram.com/hatachi_tachi/";

const ext = (href: string, text: string) =>
  `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;

/*
 * 本文は公式Instagramの募集投稿 (2026-08-01) の文面から起こしている。
 * 投稿に書かれていないことは書かない。スケジュールと応募フォームURLは
 * 投稿内の画像 (6枚目・8枚目のQRコード) にしかないので、ここでは投稿へ誘導している。
 * microCMS に news を作ったらこの内容は表示されなくなる (フォールバックのため)。
 */
const HATACHITACHI5_BODY = [
  "<p>その年に二十歳を迎える100人でつくるダンス映像プロジェクト「ハタチたち」。",
  "5作目となる『ハタチたち5』のダンサーを募集しています。</p>",
  "<p>ダンス歴は問いません。ブランクがあっても大丈夫です。",
  "「何かに本気になりたい」「同世代と最高の思い出をつくりたい」",
  "「二十歳だからこそ挑戦してみたい」、そんな方をお待ちしています。</p>",

  "<h2>募集要項</h2>",
  "<ul>",
  "<li><strong>募集期間</strong>2026年8月1日（土）〜9月30日（水）</li>",
  "<li><strong>参加対象</strong>2027年に成人式を迎える代（2006年4月2日〜2007年4月1日生まれ）</li>",
  "<li><strong>参加費</strong>4,000円＋衣装代（Tシャツ2,500円程度）＋パートリハーサルのスタジオ代（1,000円未満予定）</li>",
  "<li><strong>撮影場所</strong>東柏ヶ谷小学校</li>",
  "<li><strong>使用楽曲</strong>後日公開</li>",
  "</ul>",
  "<p>スケジュールは公式Instagramの募集投稿に掲載しています。</p>",

  "<h2>応募方法</h2>",
  `<p>公式Instagramの${ext(ENTRY_POST_URL, "募集投稿")}に、`,
  "応募フォームへのQRコードを掲載しています。そちらからご応募ください。</p>",

  "<h2>お問い合わせ</h2>",
  `<p>ご質問は${ext(INSTAGRAM_PROFILE_URL, "公式Instagram")}のDMまでお気軽にどうぞ。`,
  "保護者の方からのお問い合わせも同じ窓口で承ります。</p>",
].join("\n");

export const FALLBACK_NEWS: NewsItem[] = [
  {
    id: "hatachitachi-5",
    title: "ハタチたち5 開催決定！ & ダンサー募集中！",
    publishedDate: "2026-08-01",
    lead: FEATURED_NEWS_LEAD,
    thumbnailUrl: "/assets/news-hatachitachi5.webp",
    body: HATACHITACHI5_BODY,
    externalUrl: null,
  },
];

// 草案どおり6枠。ハタチたち5 は未制作なので inProduction を立てて「制作中」で出す
// (2026-09-03 YD 判断)。完成したら microCMS で動画URLを入れて inProduction を外す。
export const FALLBACK_ARCHIVE: ArchiveItem[] = [
  {
    id: "gen-1",
    title: "初代 ハタチたち",
    year: "2023",
    imageUrl: null,
    videoUrl: "https://youtu.be/pkBvdMpLzx8",
    sortOrder: 1,
    project: DEFAULT_PROJECT,
    inProduction: false,
  },
  {
    id: "gen-2",
    title: "ハタチたち2",
    year: "2024",
    imageUrl: null,
    videoUrl: "https://youtu.be/SLzwOObZcm8",
    sortOrder: 2,
    project: DEFAULT_PROJECT,
    inProduction: false,
  },
  {
    id: "gen-3",
    title: "ハタチたち3",
    year: "2025",
    imageUrl: null,
    videoUrl: "https://youtu.be/DQTgxCvuGRY",
    sortOrder: 3,
    project: DEFAULT_PROJECT,
    inProduction: false,
  },
  {
    id: "gen-4",
    title: "ハタチたち4",
    year: "2026",
    imageUrl: null,
    videoUrl: "https://youtu.be/RigEjrlltEM",
    sortOrder: 4,
    project: DEFAULT_PROJECT,
    inProduction: false,
  },
  {
    id: "gen-5",
    title: "ハタチたち5",
    // 募集投稿の「2027年に成人式を迎える代」から確定
    year: "2027",
    imageUrl: null,
    videoUrl: null,
    sortOrder: 5,
    project: DEFAULT_PROJECT,
    inProduction: true,
  },
  {
    id: "heiseitachi",
    title: "平成たち祭",
    year: "",
    // 動画が無いのでサムネイルを YouTube から拾えない。集合写真を直接置く (2026-09-05)
    imageUrl: "/assets/archive-heiseitachi.webp",
    videoUrl: null,
    sortOrder: 6,
    project: DEFAULT_PROJECT,
    inProduction: false,
  },
];

/** 制作中の枠に出すラベル。 */
export const IN_PRODUCTION_LABEL = "制作中";

export const FALLBACK_SITE: SiteSettings = {
  // 最新作 (ハタチたち4) を初期表示にする
  nowPlayingUrl: "https://youtu.be/RigEjrlltEM",
  nowPlayingCaption: "ハタチたち4 -「ピーターパン」優里",
  // 先頭が大きい枠。募集投稿を主役に置き、残りは直近の投稿を新しい順に並べている
  instagramPostUrls: [
    ENTRY_POST_URL,
    "https://www.instagram.com/reel/DcgN5EXTG3j/",
    "https://www.instagram.com/p/DcbEOT-kzeD/",
    "https://www.instagram.com/p/DcYffPyk91t/",
    "https://www.instagram.com/p/DcV6qWzkypO/",
  ],
  instagramProfileUrl: INSTAGRAM_PROFILE_URL,
  // 応募フォームの実URLは募集投稿のQRコードの中にしか無く、まだ入手できていない。
  // 分かったらここに入れると ABOUT に応募ボタンが出る (YD 確認事項)
  entryFormUrl: null,
  aboutBody: FALLBACK_ABOUT_BODY,
  contactEmail: null,
  organizerName: "",
  organizerNote: "",
  eventOutline: "",
  supportedBy: "",
};
