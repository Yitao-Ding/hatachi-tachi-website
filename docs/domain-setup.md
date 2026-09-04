# ドメイン接続手順 (hatachitachi.com → Vercel)

2026-09-05 実施。DNS はお名前.com 側で持つ方針 (YD 判断)。

実施済み。https://hatachitachi.com が 200 で表示され、www は 308 で apex に飛ぶ。

- お名前.com で A / CNAME を登録し、ネームサーバーを 01-04.dnsv.jp に変更 (下の手順どおり)
- レジストリ側の委任は即日、ゾーンの実体が dnsv.jp に載るまで約2分、パブリックリゾルバへの反映も同程度
- Vercel プロジェクトに www.hatachitachi.com を追加し、hatachitachi.com へ 308 リダイレクトを設定
- **apex の SSL 証明書が自動発行されなかったので `vercel certs issue hatachitachi.com` で手動発行** (下記)

残: microCMS 接続 (別件)。

## apex の SSL 証明書が出ないとき

www の証明書だけ発行されて apex が出ない、という状態になった。`vercel certs ls` で確認できる。
`vercel certs issue hatachitachi.com` を叩いたら12秒で発行され、即 200 になった。

これは初回ではない。2026-05-25 の toyo-salamat.com でも同じことが起きていて、そのときも
`vercel certs issue` で11秒で解決している (Vault の `decisions/2026-05-25_Salamat_WBS_独自ドメイン化.md`)。
どちらも Vercel CLI 50.44.0。DNS が正しく引けていて HTTP も通るのに証明書だけ出ない場合は、
15分待たずに手動発行してよい。

## 入れるレコード

Vercel ダッシュボードの Domains カードから取った、このプロジェクト固有の値。

| Type | ホスト名 | VALUE | TTL |
|---|---|---|---|
| A | (空欄) | 216.198.79.1 | 3600 |
| CNAME | www | 05944606fa304010.vercel-dns-017.com | 3600 |

`vercel domains inspect` は両方に `76.76.21.21` を勧めてくるが、これは legacy 値。カードの注記に
「We're expanding our IP range. We recommend the records above. The legacy records cname.vercel-dns.com
and 76.76.21.21 will continue to work.」とある。legacy でも動くが、推奨値を使う。

Vercel 公式も「domain card が single source of truth。他所で見た IP を貼ると Invalid Configuration の
ままになる」と書いている (https://vercel.com/kb/guide/a-record-and-caa-with-vercel)。値を変えるときは
CLI ではなくダッシュボードのカードを見ること。

AAAA レコードは入れない。Vercel はサードパーティ DNS 経由のカスタムドメインで IPv6 に対応しておらず、
AAAA があるとトラフィックが分裂して SSL の発行が止まる (https://vercel.com/docs/domains/working-with-dns)。

## 前提

お名前.com の「DNSレコード設定」は、今のネームサーバー (dns1/dns2.onamae.com) のままでは効かない。
dns1/dns2.onamae.com は登録時デフォルトのパーキング用。レコード設定を反映させるには
01.dnsv.jp〜04.dnsv.jp に変更する必要がある。公式ヘルプに「DNSレコード設定の内容を反映させるためには、
先のお名前.com指定のネームサーバー情報にご変更いただく必要がございます」と明記されている
(https://help.onamae.com/answer/7878)。実測でも 01.dnsv.jp は hatachitachi.com のクエリを REFUSED で返した。

DNSレコード設定の画面にネームサーバーを同時に切り替えるチェックボックスがあるので、レコード追加と
ネームサーバー変更は1回の操作で済む。

既存の A レコード 150.95.255.38 (お名前.com のパーキングページ) は手で消さなくてよい。あれは
dns1/dns2.onamae.com のゾーンにあるもので、ネームサーバーを切り替えた時点で参照されなくなる。

## 手順

1. お名前.com Navi にログイン
2. 「ネームサーバー/DNS」→「ドメインDNS設定」
3. hatachitachi.com を選んで「次へ」。studiometali.com は選ばない
4. 「DNSレコード設定を利用する」→「設定する」
5. レコードを2本追加する

   ```
   ホスト名: (空欄)   TYPE: A       VALUE: 216.198.79.1
   ホスト名: www      TYPE: CNAME   VALUE: 05944606fa304010.vercel-dns-017.com
   ```

   CNAME の VALUE は末尾のドット無しで入れる。TTL は既定の 3600 のままでよい
6. 「ネームサーバー変更」または「DNSレコード設定用ネームサーバー変更確認」のチェックを**入れる**。
   これで 01-04.dnsv.jp に同時に切り替わる。入れ忘れるとレコードを書いても反映されない
7. 「確認画面へ進む」
8. **ドメインプロテクション (1ドメインあたり 1,078円/年) の申込画面が挟まる。「申し込まない」「設定しない」を選ぶ**
9. 確認画面で「設定する」

反映は最大72時間。現在の A レコードの TTL は 300 秒なので、実際はもっと早い。

## www のリダイレクト (設定済み)

Vercel ダッシュボードの Project Settings → Domains → www.hatachitachi.com の Edit →
「Redirect to Another Domain」→ 308 Permanent Redirect → hatachitachi.com。Vercel 公式は 307 か 308 を
推奨していて、308 は SEO 上 301 と同等に扱われ、かつメソッドと本文を保持する
(https://vercel.com/docs/routing/redirects)。`vercel domains` CLI にリダイレクト用のサブコマンドも
フラグも無いので、ここだけはダッシュボードか REST API
(PATCH /v9/projects/{id}/domains/{domain} の redirect / redirectStatusCode) で行う。

## 途中で邪魔してくるもの

お名前.com Navi はこの導線に3回、別のものを買わせる画面を挟んでくる。全部断ってよい。

1. 画面右下に常駐する「未申請のドメインがあります」パネル。緑の「確認する」ボタンが本来の
   「確認画面へ進む」と紛らわしく、押すと別ドメインのカートに飛ぶ。先に × で閉じておく
2. 「確認画面へ進む」の直後に出るドメインプロテクション (1,078円/年) のモーダル →「設定しない」
3. 完了画面に出る「お名前.com利用者様限定特典」(別ドメインが1年無料) のモーダル →「登録しない」

検証:

```bash
dig +short hatachitachi.com NS
dig +short hatachitachi.com A          # 216.198.79.1
dig +short www.hatachitachi.com CNAME  # 05944606fa304010.vercel-dns-017.com.
curl -sSI https://hatachitachi.com | head -3
curl -sSI https://www.hatachitachi.com | head -5   # 308 と location:
```

## 検討して捨てた案

**ネームサーバーを Vercel (ns1/ns2.vercel-dns.com) に移す。** DNS が全部 Vercel 側になり、以降
`vercel dns` コマンドとダッシュボードの DNS エディタが使える。将来 Resend などのメールサービスを足すとき、
Vercel が権威 DNS なら Domain Connect で向こう側がワンクリックで MX/DKIM を入れてくれる。
2026-09-05 に YD 判断で不採用。DNS はお名前.com 側で持つ。

**Domain Connect でお名前.com を自動設定。** Vercel には対応レジストラの DNS を自動で書き込む仕組みが
あるが、対応しているのは Cloudflare 管理のドメインだけ (2025-02-14 の changelog から
「more providers coming soon」のまま)。お名前.com は対象外
(https://vercel.com/changelog/automated-dns-configuration-with-domain-connect)。

**Vercel にドメインを移管 (transfer-in)。** ICANN のルールで登録から60日間は移管できない。
hatachitachi.com は 2026-09-03 登録なので早くても11月上旬。更新料も Vercel 側の価格になる。

## 注意

ドメイン情報認証メール (件名「【重要】[お名前.com] ドメイン情報認証のお願い」、送信元
verification-noreply@onamae.com) は受信から2週間以内にクリックする。登録が 2026-09-03 なので期限は
2026-09-17 前後。未対応だとドメインが利用制限され、DNS を正しく設定してもサイトは表示されない。
2026-09-05 時点で Whois ステータスは ok、Navi のステータスも「契約中」なので制限はかかっていない。
メールを紛失した場合は Navi のドメイン詳細画面から認証メールを再送できる。

自動更新は 2026-09-05 時点で「設定済み」。更新期限は 2027/09/03。

DNS が通った時点でサイトは公開され、robots.txt も Allow に切り替わる (`VERCEL_PROJECT_PRODUCTION_URL`
が hatachitachi.com になっているため、環境変数 `NEXT_PUBLIC_SITE_URL` を足さなくても自動で切り替わる)。
microCMS が未接続の間は organizerName / eventOutline / supportedBy が空文字のフォールバックなので、
主催者名・開催概要・協力団体のセクションが出ないまま公開される。

studiometali.com は 2026-09-05 時点の YD 判断で触らない。お名前.com のパーキングのまま。
