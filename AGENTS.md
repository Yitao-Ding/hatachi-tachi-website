# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# ハタチたち 公式サイト

- デザイン正本: Canva「ハタチたち - Webサイト」(DAHTaN6Dxr8)。トーン = 白 + 珊瑚レッド + 紺、明朝縦書き、コラージュ風
- CMS: microCMS (news / archive / site の3 API)。env: `MICROCMS_SERVICE_DOMAIN` / `MICROCMS_API_KEY` (サーバー側のみ)
- env 未設定でもビルドが通るよう、全 fetch は `src/content/site.ts` のフォールバックに落ちる設計を崩さない
- 画像: microCMS 画像は imgix パラメータ (custom loader)、静的画像は事前 WebP 圧縮して `/public/assets/`。Vercel 画像最適化は使わない
