# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# ハタチたち 公式サイト

- デザイン正本: Canva「ハタチたち - Webサイト」(DAHTaN6Dxr8)。トーン = 白 + 珊瑚レッド + 紺、明朝縦書き、コラージュ風
- CMS: microCMS (news / archive / site の3 API)。env: `MICROCMS_SERVICE_DOMAIN` / `MICROCMS_API_KEY` (サーバー側のみ)
- env 未設定でもビルドが通るよう、全 fetch は `src/content/site.ts` のフォールバックに落ちる設計を崩さない
- 画像: microCMS 画像は imgix パラメータ (custom loader)、静的画像は事前 WebP 圧縮して `/public/assets/`。Vercel 画像最適化は使わない
- 配信は Cloudflare Workers の静的アセット (2026-10-16 に Vercel から移行)。`next build` が `out/` に静的書き出し (`output: "export"`) し、`wrangler.jsonc` がそれを配る。main への push で本番、他のブランチはプレビュー URL。セキュリティヘッダは `public/_headers`。ISR・下書きプレビューなどサーバーが要る機能は使えない
- microCMS は 2026-09-05 に不使用と決めた。env が無いので全て `src/content/site.ts` のフォールバックで表示している。更新は site.ts を直して push
- 検索対策は `docs/seo.md`。本番と同じ配信の確認は `pnpm preview` (`next build` の後に `wrangler dev`)
