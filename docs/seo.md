# 検索対策 (SEO)

2026-10-16 に整備。狙いは「ハタチたち」で検索した人に公式サイトが出ることと、成人式・二十歳・ダンス映像で探している人、応募を考えている二十歳とその保護者に見つけてもらうこと。

## コード側で入れたこと

- description: 上映先 (川崎市・相模原市・福島市のはたちのつどい (成人式) と YouTube) を入れた。事実の出どころは `src/content/site.ts` の FEATURED_NEWS_LEAD
- お知らせの記事ごとの description と OGP の説明 (記事のリード文)
- 構造化データ (`src/components/json-ld.tsx`): WebSite (検索結果のサイト名を「ハタチたち」に)、Organization (公式 Instagram を sameAs、企画元スタジオメタリを parentOrganization、PD の Metalina を founder)、記事ページに NewsArticle。スタジオメタリ側 (studiometali.com) と同じ @id を使い、同じ団体・人物として結んでいる
- robots メタ: `max-image-preview:large`
- フッターから studiometali.com へのリンク (別 PR)

構造化データにはページに書いてある事実だけを入れる。記事の日付が無い時は datePublished を出さない。

## 狙う検索語 (2026-10-16 追加)

YD の指定: ハタチたち / 20歳 ダンス / 成人式 ダンス / 成人式 / 20歳の集い / ダンス 映像作品。

- title と h1 (画面には出ない sr-only) を「ハタチたち | 成人式で上映する、20歳100人のダンス映像作品」に。6 語のうち「成人式」「20歳」「ダンス」「映像作品」を 1 行に入れた
- description に「20歳」「二十歳」「20歳の集い（成人式）」「映像作品」。本文 (Canva 草案) は「二十歳」表記なので、head 側は「20歳」で書いて両方の表記を拾う
- WebSite / Organization の alternateName に「はたちたち」

語ごとの見込み:

- 「ハタチたち」: Search Console 登録とサイトマップ送信の後、数日〜2 週間で 1 位に出る見込み
- 「成人式 ダンス」「20歳 ダンス」: 上位は報道記事とイベントのページで、取れる余地がある。title だけでは弱く、本文に成人式の一文を入れる (YD 確認中) のと、YouTube の動画タイトルが効く
- 「ダンス 映像作品」: 一般語で競合が多い。サイト単体では難しく、YouTube の動画側で拾う
- 「成人式」「20歳の集い」単体: 自治体・Wikipedia・振袖レンタルが上位を占め、サイトでは上がらない。各市の二十歳のつどいのページにハタチたちの上映が載り、リンクしてもらうのが現実的な経路

## コードの外で効くこと

- YouTube (スタジオメタリのチャンネル) の各作品のタイトルと説明文。例「ハタチたち4｜20歳100人でつくる成人式のダンス映像「ピーターパン」優里」、説明文の 1 行目に https://hatachitachi.com 。Google の検索結果に動画枠で出るのはこちら
- 上映する 3 市 (川崎市「二十歳を祝うつどい」、相模原市「はたちのつどい」、福島市) の式典のページや当日資料に、ハタチたちの上映と URL を載せてもらう
- 取材を受けた時は記事に URL を入れてもらう。カナロコ (2025-11、ハタチたち4) と相模女子大学のプレスリリース (2025-11-27) が既にある

## コードの外でやること (YD / Mac の Claude)

Cloudflare への移行 (`docs/domain-setup.md`) が終わった後に。手順は studiometali.com と同じ (studiometali-website の `docs/seo.md`)。

1. Google Search Console に「ドメイン」プロパティで hatachitachi.com を登録 (Cloudflare で自動確認)
2. サイトマップ `https://hatachitachi.com/sitemap.xml` を送信、トップと `/news/hatachitachi-5` のインデックス登録をリクエスト
3. Bing Webmaster Tools に Search Console から取り込み
4. Cloudflare の hatachitachi.com で Crawler Hints を ON
5. 公式 Instagram (@hatachi_tachi) のプロフィールのリンクを https://hatachitachi.com に

## これから

- 応募フォームの URL が分かったら `site.ts` の entryFormUrl に入れる (ABOUT に応募ボタンが出る)。「ハタチたち 応募」で来た人がその場で申し込める
- 各代の作品 (ハタチたち1〜5) に、上映した年と場所を書いた記事を足すと「〇〇市 成人式 ダンス」などで見つかりやすくなる。年と場所は本人確認が要る
