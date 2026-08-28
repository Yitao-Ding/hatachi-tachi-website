# microCMS セットアップ手順 (YD作業、約15分)

コードは接続済み。この手順どおりに管理画面で作れば、キーを渡した時点で繋がる。

## 1. アカウントとサービス作成 (5分)

1. https://microcms.io で無料アカウント登録 (団体共通メール推奨。個人メールだと代替わりで詰む)
2. サービスを作成。サービスID は `hatachitachi` (これが `MICROCMS_SERVICE_DOMAIN` になる)
3. プランは Hobby (無料) のまま

## 2. API を3本作る (10分)

管理画面「+ API作成」から。**APIのエンドポイント名とフィールドIDは下記の通り正確に** (コードがこの名前で取りに行く)。

### API 1: ニュース

エンドポイント: `news` / 型: リスト形式

| フィールドID | 表示名 | 種類 | 必須 |
|---|---|---|---|
| title | タイトル | テキストフィールド | 必須 |
| publishedDate | 表示日付 | 日時 | 必須 |
| thumbnail | サムネイル | 画像 | |
| body | 本文 | リッチエディタ | |
| externalUrl | 外部リンクURL | テキストフィールド | |

externalUrl に URL を入れると「詳しくはこちら」がそのリンク先 (応募フォーム等) に飛ぶ。空なら詳細ページに飛ぶ。

### API 2: アーカイブ

エンドポイント: `archive` / 型: リスト形式

| フィールドID | 表示名 | 種類 | 必須 |
|---|---|---|---|
| title | タイトル | テキストフィールド | 必須 |
| year | 開催年 | テキストフィールド | |
| image | 画像 | 画像 | 必須 |
| videoUrl | 動画URL | テキストフィールド | |
| sortOrder | 表示順 | 数値 | 必須 |

sortOrder は 1, 2, 3... の小さい順に左上から並ぶ。videoUrl があるとクリックで動画に飛ぶ。

### API 3: サイト設定

エンドポイント: `site` / 型: **オブジェクト形式** (リストではない)

| フィールドID | 表示名 | 種類 |
|---|---|---|
| nowPlayingUrl | NOW PLAYINGのYouTube URL | テキストフィールド |
| nowPlayingCaption | 動画キャプション | テキストフィールド |
| instagramPostUrls | Instagram投稿URL (1行に1つ) | テキストエリア |
| instagramProfileUrl | InstagramプロフィールURL | テキストフィールド |
| entryFormUrl | 応募フォームURL | テキストフィールド |
| aboutBody | ABOUT本文 | テキストエリア |
| contactEmail | 問い合わせメール | テキストフィールド |

instagramPostUrls は投稿URLを改行区切りで貼る (例: `https://www.instagram.com/p/xxxx/` を3行)。

## 3. APIキーを渡す

管理画面 →「APIキー」→ デフォルトキー (GET のみ許可) をコピーして Claude に共有。
`.env.local` の `MICROCMS_SERVICE_DOMAIN` / `MICROCMS_API_KEY` に入る。

## 4. Webhook 設定 (Vercel デプロイ後にやる)

Vercel の Deploy Hook URL を Claude が発行するので、**3つのAPI全部**の「API設定 → Webhook → カスタム通知」にその URL を登録する。site だけ忘れると「YouTube URL 変えたのに反映されない」事故になる。

## 5. 代替わり運用 (毎年)

無料枠はメンバー3人まで。引き継ぎ時は「旧代のメンバーを削除 → 新代を招待」。
管理者アカウント (団体共通メール) は消さない。
