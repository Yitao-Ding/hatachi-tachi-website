# microCMS セットアップ手順 (YD作業、約20分)

コードは接続済み。この手順どおりに管理画面で作れば、キーを渡した時点で繋がる。

**フィールドIDは1文字でも違うとサイト側が黙って空になる**。表示名は自由だが、フィールドIDは下記のとおり半角で正確に入力すること。

## 1. アカウントとサービス作成 (5分)

1. https://microcms.io で無料アカウント登録。**団体共通のメールアドレスで作る**。個人メールだと代替わりのたびに詰む
2. サービスを作成。サービスID は `hatachitachi` (これが `MICROCMS_SERVICE_DOMAIN` になる)
3. プランは Hobby (無料) のまま

## 2. API を3本作る (12分)

管理画面「+ API作成」から。無料枠は API 3本までなので、この3本でちょうど使い切る。

### API 1: ニュース

エンドポイント: `news` / 型: **リスト形式**

| フィールドID | 表示名 | 種類 | 必須 |
|---|---|---|---|
| title | タイトル | テキストフィールド | 必須 |
| lead | リード文 | テキストエリア | |
| publishedDate | 表示日付 | 日時 | |
| thumbnail | サムネイル | 画像 | |
| body | 本文 | リッチエディタ | |
| externalUrl | 外部リンクURL | テキストフィールド | |

- `lead` はトップの NEWS に出る短い説明文。最新1件だけに出る
- `externalUrl` に URL を入れると「詳しくはこちら」がその先 (応募フォーム等) に飛ぶ。空なら記事ページに飛ぶ
- `title` に半角の `&` を入れると、その前後で3行に組まれる (草案の「ハタチたち5開催決定！/ & / ダンサー募集中！」の見え方になる)
- `publishedDate` は空でもよい。空なら日付を表示しない

### API 2: アーカイブ

エンドポイント: `archive` / 型: **リスト形式**

| フィールドID | 表示名 | 種類 | 必須 |
|---|---|---|---|
| title | タイトル | テキストフィールド | 必須 |
| year | 開催年 | テキストフィールド | |
| image | 画像 | 画像 | |
| videoUrl | 動画URL | テキストフィールド | |
| sortOrder | 表示順 | 数値 | 必須 |

`sortOrder` の小さい順に左上から並ぶ。`videoUrl` があるとクリックで動画に飛ぶ。

**注意**: この API に1件でも登録すると、仮表示していた過去作5件 (初代〜4 + 平成たち祭) は消えて、登録した内容だけが並ぶ。試しに1件だけ入れると過去作が全部消えたように見えるので、入れるときは5件まとめて入れること。仮表示の内容は `src/content/site.ts` にある。

### API 3: サイト設定

エンドポイント: `site` / 型: **オブジェクト形式** (リストではない)

| フィールドID | 表示名 | 種類 |
|---|---|---|
| nowPlayingUrl | NOW PLAYINGのYouTube URL | テキストフィールド |
| nowPlayingCaption | 動画キャプション | テキストフィールド |
| instagramPostUrls | Instagram投稿URL | テキストエリア |
| instagramProfileUrl | InstagramプロフィールURL | テキストフィールド |
| entryFormUrl | 応募フォームURL | テキストフィールド |
| aboutBody | ABOUT本文 | テキストエリア |
| contactEmail | 問い合わせメール | テキストフィールド |
| organizerName | 主催者名 | テキストフィールド |
| organizerNote | 運営について | テキストエリア |
| eventOutline | 開催概要 | テキストエリア |
| supportedBy | 協力 | テキストエリア |

- `instagramPostUrls` は投稿URLを改行で区切って貼る。前後に記号や説明が混ざっても URL だけ拾う
- `entryFormUrl` を入れると ABOUT に「ダンサー募集に応募する」ボタンが出る。空ならボタンは出ない
- 下4つ (`organizerName` / `organizerNote` / `eventOutline` / `supportedBy`) は **OUTLINE セクション**の中身。1つでも入れるとセクションが出て、全部空だとセクションごと出ない。保護者・会場・協賛が見たときの信頼性はここで決まるので、最低でも主催者名と開催概要は入れる

## 3. APIキーを渡す

管理画面 →「APIキー」→ デフォルトキー (GET のみ) をコピーして Claude に共有する。
`.env.local` の `MICROCMS_SERVICE_DOMAIN` / `MICROCMS_API_KEY` に入れる。

## 4. 記事を書いたら「公開」する

microCMS は保存しただけでは公開されない。画面右上が「公開」になっていることを確認する。
下書きのままだと API に出てこないので、サイトには何も出ない。

下書きの見た目を公開前に確認したい場合は、API設定 →「画面プレビュー」に次を登録する:

```
https://<本番URL>/preview/news/{CONTENT_ID}?draftKey={DRAFT_KEY}
```

## 5. Webhook 設定 (Vercel デプロイ後)

Vercel の Deploy Hook URL を Claude が発行するので、**3つの API 全部**の「API設定 → Webhook → カスタム通知」にその URL を登録する。`site` だけ忘れると「YouTube URL を変えたのに反映されない」が起きる。

## 6. 代替わり運用 (毎年)

無料枠はメンバー3人まで。引き継ぎ時は「旧代のメンバーを削除 → 新代を招待」。
管理者アカウント (団体共通メール) は消さない。
