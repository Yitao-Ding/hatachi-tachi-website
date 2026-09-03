# 素材・情報リスト (YD / Lina さんへの依頼)

プレースホルダーで全セクション実装済み。以下が届き次第差し替える。
受け渡しは Google Drive / AirDrop / ギガファイルなんでも可。

## 写真 (Canva 経由ではなく撮影オリジナルの JPG/PNG で)

Canva からの書き出しは再圧縮で画質が落ちるので、元ファイルが望ましい。

| ファイル | 内容 | 置き場所 (Claude が処理) |
|---|---|---|
| hero-circle | ヒーロー中央の体育館円陣写真 (横長にトリミングして使う) | public/assets/hero-circle.webp |
| hero-bg 4〜6枚 | ヒーロー背景の白飛ばしコラージュ用 (練習風景・体育館の天井など) | public/assets/hero-bg-*.webp |
| about-1 | ABOUT 右の集合写真 | public/assets/about-1.webp |
| about-2 | ABOUT 左下の集合写真 | public/assets/about-2.webp |
| NEWS サムネ | ハタチたち5 募集の告知画像 (草案にある縦長のもの) | microCMS news |
| アーカイブ 5枚 | 初代〜4 + 平成たち祭 のサムネ | microCMS archive |
| OGP用 1枚 | SNS共有時の横長画像 1200×630 | public/assets/ogp.jpg (暫定版あり、差し替え歓迎) |

## タイトルレタリング

ヒーローの赤い「ハタチたち」。今は Shippori Mincho で組んでいて、草案の手書きレタリングとは別物。

- Canva でレタリング部分だけを選択 → 背景透過 PNG で書き出し (透過は Canva Pro 機能)
- Pro が無い場合は白背景 PNG でOK (こちらで白抜きする)
- 現状のフォント組みのままでもサイトは成立するので、優先度は中

## 情報 (microCMS に直接入力してもOK)

サイトの一番の目的が「保護者・会場・協賛から見た信頼性の担保」なので、ここが一番効く。

| 項目 | microCMS のフィールド | 備考 |
|---|---|---|
| 主催者名 | site.organizerName | 例「ハタチたち実行委員会」。フッターの著作権表記にも使う |
| 運営について | site.organizerNote | 誰が運営しているかの説明 |
| 開催概要 | site.eventOutline | 上映日・会場。川崎市 / 相模原市 / 福島市の3会場ぶんを改行で並べる形でよいか要確認 |
| 協力 | site.supportedBy | 自治体・協賛・協力団体 |
| 問い合わせメール | site.contactEmail | 個人アドレスは避けて団体共通のものを |
| 応募フォームURL | site.entryFormUrl | 入れると ABOUT に応募ボタンが出る |
| NOW PLAYING の動画 | site.nowPlayingUrl | 今は暫定でハタチたち4を表示している |
| Instagram 投稿URL | site.instagramPostUrls | 載せたい投稿を数件 |

## 色

Canva スクリーンショットからピクセル抽出済みなので、確認だけお願いします。

- 赤 (タイトル / ABOUT背景 / LOOK BACK / フッター): `#ff5757`
- 紺 (NEWS帯 / ボタン文字): `#1f469d`

## 確定済み (2026-09-03 YD判断)

1. アーカイブ見出しは **LOOK BACK** に修正。草案の LOCK BACK は誤記
2. ABOUT の「二十歳の台」は **「代」** に修正
3. アーカイブは **6枠**。ハタチたち5 の枠を「制作中」として出す。完成したら microCMS で動画URLを入れて `inProduction` を OFF にする
4. 応募導線は **NEWS 内のまま**。トップの役割は信頼性の担保を優先する
5. 赤は **`#ff5757`** のまま。この背景の上では本文サイズの白文字を使わない運用で AA を満たす

## まだ聞きたいこと

- **ハタチたち5 の上映年** — アーカイブの枠に出す年です。推測を置かない方針なので今は空欄にしてあります
- **上映日と応募締切** — サイト公開の実質的な締切がここで決まります
- **問い合わせ先** — 個人 Gmail を載せない前提で、`info@studiometali.com` のような独自ドメインのアドレスにするか、Instagram の DM に寄せるか
