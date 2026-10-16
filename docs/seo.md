# 検索対策 (SEO)

2026-10-16 に整備。狙いは「ハタチたち」で検索した人に公式サイトが出ることと、成人式・二十歳・ダンス映像で探している人、応募を考えている二十歳とその保護者に見つけてもらうこと。

## コード側で入れたこと

- description: 上映先 (川崎市・相模原市・福島市のはたちのつどい (成人式) と YouTube) を入れた。事実の出どころは `src/content/site.ts` の FEATURED_NEWS_LEAD
- お知らせの記事ごとの description と OGP の説明 (記事のリード文)
- 構造化データ (`src/components/json-ld.tsx`): WebSite (検索結果のサイト名を「ハタチたち」に)、Organization (公式 Instagram を sameAs、企画元スタジオメタリを parentOrganization、PD の Metalina を founder)、記事ページに NewsArticle。スタジオメタリ側 (studiometali.com) と同じ @id を使い、同じ団体・人物として結んでいる
- robots メタ: `max-image-preview:large`
- フッターから studiometali.com へのリンク (別 PR)

構造化データにはページに書いてある事実だけを入れる。記事の日付が無い時は datePublished を出さない。

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
