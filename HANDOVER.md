# HANDOVER — ハタチたち公式サイト

最終更新: 2026-08-28 (初回構築 + 全面レビュー反映)

## 現状

Canva 草案 (DAHTaN6Dxr8「ハタチたち - Webサイト」1ページ7セクション) を
Next.js 16 + React 19 + Tailwind v4 + microCMS で実装。素材待ちの箇所はプレースホルダー。
`pnpm build` / `pnpm lint` 緑。375px・1280px で Playwright 実機確認済み。

11エージェントの多観点レビュー + 敵対的検証を通し、確定した46件と完全性クリティックの14件を反映済み。
特に潰した重いもの:

- **明朝が一文字も適用されていなかった** — next/font の変数クラスを `<body>` に付けると `:root` から見えず、`--ff-mincho` のチェーンが無効化されて全ページがシステムゴシックで出ていた。`<html>` に移して解決
- **font preload が 123本 (約3.8MB相当)** — 日本語フォントは `preload: false` にして 1本まで削減
- **microCMS の失敗を全部握りつぶしていた** — 本番で API 障害が起きてもビルドが緑のままプレースホルダーを公開する状態だった
- **ブランド色が草案とズレていた** — 草案スクショからピクセル抽出して `#ff5757` / `#1f469d` に確定

## 全体設計

microCMS (news / archive / site の3 API、無料枠ちょうど) → 公開時 Webhook → Vercel Deploy Hook 再ビルド。
SSG + `revalidate = 3600` (Webhook 失敗時の保険)。
microCMS 画像は imgix パラメータ (`src/lib/image-loader.ts`) で Vercel 画像最適化を使わない。

計画正本: `~/.claude/plans/https-canva-link-34707g8vpyurk5o-3-spicy-eclipse.md`
草案の実測スクリーンショット: `~/hc-000.png` `~/hatachi-canva-gap.png` `~/hc-1700.png` `~/hc-2700.png` `~/hc-4000.png` (Cookieバナー無し・全域カバー)

### 取得の方針 (`src/lib/microcms.ts` 冒頭にも書いてある)

1. env 無し = 未接続。フォールバックを返してビルドを通す (素材待ちで実装を止めないため)
2. env あり + 取得失敗 = throw してビルドを落とす。Vercel は直前の正常なデプロイを配信し続ける
3. env あり + 0件 = 運営が消した意思。フォールバックで復活させない (復活させると CMS から消せなくなる)
4. 404 (API未作成) だけはフォールバックに逃がす。API を1本ずつ作る途中でもビルドが通るように

## 調べて分かった実データ

- 公式 Instagram: [@hatachi_tachi](https://www.instagram.com/hatachi_tachi/)。プロフィールに「川崎市・相模原市・福島市協力」。2026-08-01 に ハタチたち5 の応募フォーム案内を投稿済み
- 公式 YouTube: [スタジオメタリ @Studio_Metali](https://www.youtube.com/@Studio_Metali)
- 旧公式サイト (Wix): https://hatachitachi100.wixsite.com/hatachi-tachi — 初代のみの内容。ナビは SUMMARY / CONCEPT / ACTIVITY / MOVIE / MEMBER。協力に自由ヶ丘学園高等学校・株式会社セルクル
- 過去作 (`src/content/site.ts` に反映済み):

| 作品 | 楽曲 | URL |
|---|---|---|
| 初代 (2023) | 二十歳 / LUCCI | https://youtu.be/pkBvdMpLzx8 |
| 2 (2024) | 生きるをする / マカロニえんぴつ | https://youtu.be/SLzwOObZcm8 |
| 3 (2025) | かくれんぼ / AliA | https://youtu.be/DQTgxCvuGRY |
| 4 (2026) | ピーターパン / 優里 | https://youtu.be/RigEjrlltEM |

- ドメイン `hatachitachi.com` / `studiometali.com` は 2026-09-03 に取得済み

## 決まったこと (2026-09-03)

- スタジオメタリは PD 個人の屋号で、ハタチたちはその中の企画のひとつ。PD は代替わりしないので、
  microCMS / GitHub / Vercel は PD 個人アカウントでよい。毎年の代にはメンバー招待だけ渡す
- スタジオメタリのサイトは今回作らない。ハタチたち単体で完成させる。
  将来入れ子にするときは middleware 1本で足りるので、今は構造を複雑にしない。
  ただし `archive` には `project` フィールドだけ先に入れてある (スキーマを後から変えると入力し直しになるため)
- ドメイン取得済み: `hatachitachi.com` / `studiometali.com` (お名前.com、2026-09-03)。
  本番は `hatachitachi.com`
- 確認5件はすべて確定 → `docs/assets-list.md` の「確定済み」を参照

## 次のアクション

### YD 作業 (これが揃わないと先に進めない)

1. **ドメイン情報認証メールをクリック (2026-09-17 期限)**。踏まないと2ドメインとも強制停止する。
   ついでにお名前.com Navi で自動更新 ON を確認する
2. microCMS アカウント + API 3本作成 → `docs/microcms-setup.md` の手順どおり → APIキー共有
3. 素材と情報の提供 → `docs/assets-list.md`
4. 問い合わせ先アドレスを決める (個人 Gmail を載せない。独自ドメインのアドレスか Instagram DM か)

### Claude 作業 (入力が届き次第)

- Phase 2: `.env.local` 設定 → 実データ疎通 → 欠落フィールド耐性の確認
- Phase 3: 実素材差し替え (WebP化) + 草案との突き合わせ仕上げ
- Phase 4: GitHub push (要YD許可) → Vercel → **Vercel の環境変数を3つ登録** (`MICROCMS_SERVICE_DOMAIN` / `MICROCMS_API_KEY` / `NEXT_PUBLIC_SITE_URL`) → ドメイン → Deploy Hook 発行 → YD が Webhook を3 API 全部に登録
- Phase 5: Lighthouse / 実機確認 + 非エンジニア向け更新マニュアル + YD 受け入れテスト

## 罠・注意

- pnpm 11: `pnpm-workspace.yaml` の `allowBuilds` (sharp / unrs-resolver) が無いと build 失敗
- Next 16: cacheComponents を有効化すると `export const revalidate` が使えなくなる。有効化しない
- next/font の変数クラスは必ず `<html>` に付ける (`<body>` に付けると `:root` から解決できず全フォントが無効化される)
- 日本語フォントは `preload: false`。付けると head に preload が100本以上並ぶ
- Tailwind: 表示切替するコンポーネントに display ユーティリティを固定で埋め込まない (`hidden` と競合する)
- microCMS `site` はオブジェクト形式。`instagramPostUrls` はテキストエリア1行1URL
- Webhook は 3 API 全部に登録 (`site` を忘れがち)
- `NEXT_PUBLIC_SITE_URL` を入れるまで `robots.txt` は全面 Disallow になる (vercel.app が索引されるのを防ぐため)。本番ドメイン適用時に必ず設定する
- 珊瑚 `#ff5757` に白文字は 3.11:1。半透明の白を重ねると 2.4:1 まで落ちるので、この背景の上では必ず不透明の白を使う
- dev サーバー: `pnpm dev --port 3210`

## YD 判断待ちの一覧

`docs/assets-list.md` の「まだ聞きたいこと」— ハタチたち5 の上映年、上映日と応募締切、問い合わせ先アドレス。
