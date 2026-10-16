# hatachitachi.com を Cloudflare で公開する手順

2026-10-16 に Vercel から Cloudflare に移す。形は studiometali.com と同じ:
ドメインの登録はお名前.com のまま、DNS とホスティングは Cloudflare (YD のアカウント、studiometali.com と同じ)。
サイトは Cloudflare Workers の静的アセットで配る (`wrangler.jsonc`)。GitHub の main に push すると Workers Builds が `pnpm build` → `npx wrangler deploy` を走らせる。

studiometali.com と違うのは、hatachitachi.com は今 Vercel で公開中なこと。止まる時間を短くするため、下の順番を守る。
Vercel 向けのレコードを消してから Cloudflare の Custom Domain が付くまでの 1〜2 分だけ、サイトが見えなくなる。

それ以前の Vercel 時代の手順と経緯は `docs/domain-setup-vercel-2026-09.md`。

## 1. 事前確認

```bash
dig +short NS hatachitachi.com           # 01-04.dnsv.jp (お名前.com の DNS)
dig +short hatachitachi.com A            # 216.198.79.1 (Vercel)
dig +short www.hatachitachi.com CNAME    # 05944606fa304010.vercel-dns-017.com. (Vercel)
dig +short hatachitachi.com MX           # 空のはず (メールは使っていない)
dig +short hatachitachi.com TXT
```

MX や TXT が出たら、それは消さずに Cloudflare 側に残す。

## 2. Cloudflare にゾーンを追加する (この時点ではまだ Vercel のまま)

1. https://dash.cloudflare.com →「ドメインを追加」→ `hatachitachi.com` → 既存レコードの自動スキャン ON → Free プラン
2. 取り込まれたレコードを 1 の結果と見比べる。A `216.198.79.1` と CNAME `www` → Vercel は**まだ消さない**。どちらも雲のアイコンを灰色 (DNS only) にする (Vercel の前に Cloudflare のプロキシを挟まない)
3. 画面に出る Cloudflare のネームサーバー2本を控える

## 3. お名前.com でネームサーバーを変える

1. お名前.com Navi →「ネームサーバー/DNS」→「ネームサーバー変更」→ `hatachitachi.com` だけを選ぶ
2. 「その他のネームサーバーを使う」に 2-3 の2本 → 確認 → 設定。購入の誘いは全部断る
3. Cloudflare の Overview で「Check nameservers now」。Active になるまで数分〜1時間 (最大 24 時間)

レコードの中身は同じなので、この切り替えの間もサイトは Vercel で見え続ける。

## 4. PR をマージして Workers Builds をつなぐ

1. Cloudflare 移行の PR を main にマージする (Vercel にも従来どおりビルドが走るが、静的書き出しのまま問題なく表示される)
2. Workers & Pages → Create → Import a repository → GitHub。Cloudflare の GitHub App に `hatachi-tachi-website` へのアクセスを追加する
3. 設定:

   | 項目 | 値 |
   |---|---|
   | Project name (Worker 名) | `hatachitachi` (`wrangler.jsonc` の name と一致させる) |
   | Production branch | `main` |
   | Build command | `pnpm build` |
   | Deploy command | `npx wrangler deploy` |
   | Builds for non-production branches | ON |
   | Non-production branch deploy command | `npx wrangler versions upload` |

4. Deploy。最初のデプロイは「hatachitachi.com に既に DNS レコードがある」で Custom Domain の段階で失敗する。これは想定どおり

## 5. Vercel のレコードを消して付け替える (ここから 1〜2 分止まる)

1. Cloudflare の hatachitachi.com → DNS で、A `hatachitachi.com` (216.198.79.1) と CNAME `www` (Vercel) を削除
2. Workers & Pages → hatachitachi → Deployments (または Builds) から、失敗したビルドを Retry
3. 成功すると `hatachitachi.com` と `www.hatachitachi.com` が Custom Domain として付き、DNS レコードと証明書を Cloudflare が作る
4. SSL/TLS → Edge Certificates →「Always Use HTTPS」を ON
5. Rules → Redirect Rules → テンプレート「Redirect from WWW to Root」(301、クエリ文字列は保持)

## 6. 確認

```bash
dig +short NS hatachitachi.com                 # *.ns.cloudflare.com が2本
curl -sSI https://hatachitachi.com | head -12   # 200、content-security-policy などのヘッダ
curl -sSI https://www.hatachitachi.com | head -3   # 301 → https://hatachitachi.com/
curl -s -o /dev/null -w "%{http_code}\n" https://hatachitachi.com/news/hatachitachi-5   # 200
curl -s -o /dev/null -w "%{http_code}\n" https://hatachitachi.com/nope                  # 404
```

ブラウザで PC とスマホ幅を表示し、NOW PLAYING の動画、INSTAGRAM の埋め込み、NEWS の記事ページを確認する。

## 7. Vercel の後片付け

Vercel → hatachi-tachi-website → Settings → Git → Disconnect。Domains の hatachitachi.com / www は Remove。プロジェクトの削除は YD 判断。
