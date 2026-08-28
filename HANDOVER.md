# HANDOVER — ハタチたち公式サイト

最終更新: 2026-08-28 (初回構築セッション)

## 現状

Phase 1 完了。Canva 草案 (DAHTaN6Dxr8「ハタチたち - Webサイト」1ページ7セクション) を
Next.js 16 + Tailwind v4 + microCMS 構成でプレースホルダー実装済み。
`pnpm build` 緑 / ローカル 375px・1200px で表示確認済み (Playwright)。

- トップ `/` : ヒーロー / NEWS / ABOUT / NOW PLAYING / LOCK BACK / INSTAGRAM / フッター
- `/news/[slug]` : NEWS 詳細 (microCMS リッチエディタ描画)
- microCMS 未接続でも `src/content/site.ts` のフォールバックで全ページが成立する設計。
  この性質は今後も崩さない (env が無い環境でもビルドが通ることが受け入れ条件)

## 全体設計

microCMS (news / archive / site の3 API、無料枠) → 公開時 Webhook → Vercel Deploy Hook 再ビルド。
SSG + `revalidate = 3600` (Webhook 失敗時の保険)。
microCMS 画像は imgix パラメータ (src/lib/image-loader.ts) で Vercel 画像最適化を使わない。
計画正本: `~/.claude/plans/https-canva-link-34707g8vpyurk5o-3-spicy-eclipse.md`

## 次のアクション

YD 待ち (Phase 0/2/3 の入力):
1. microCMS アカウント + API 3本作成 → `docs/microcms-setup.md` の手順どおり → APIキー共有
2. 素材提供 → `docs/assets-list.md` (写真・タイトルレタリング・正確なHEX・各種URL)
3. ドメイン取得 (hatachitachi.com 等)。取得だけ先行でOK
4. 「LOCK BACK」表記が誤記でないか確認 (assets-list.md 末尾)

Claude 側 (入力が届き次第):
- Phase 2: `.env.local` 設定 → 実データ疎通 → ダミー投入テスト
- Phase 3: 実素材差し替え (WebP化) + Canva 突き合わせ仕上げ + OGP
- Phase 4: GitHub push (要YD許可) → Vercel → ドメイン → Deploy Hook 発行 → YD が Webhook 3箇所登録
- Phase 5: Lighthouse / 実機確認 + 非エンジニア向け更新マニュアル作成 + YD受け入れテスト

## 罠・注意

- pnpm 11: `pnpm-workspace.yaml` の `allowBuilds` (sharp / unrs-resolver) が無いと build 失敗
- Next 16: cacheComponents を有効化すると `export const revalidate` が使えなくなる。有効化しない
- VerticalText に display を固定で持たせない (`hidden` と競合してモバイルに漏れた実績 → 修正済み)
- microCMS `site` はオブジェクト形式。instagramPostUrls はテキストエリア1行1URL (繰り返しフィールドではない)
- Webhook は 3 API 全部に登録 (site を忘れがち)
- dev サーバー: `pnpm dev --port 3210`
