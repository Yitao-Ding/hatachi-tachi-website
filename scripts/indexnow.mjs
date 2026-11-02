// 公開中の sitemap.xml の URL を全部 IndexNow に送り、Bing などに更新を知らせる。
// Google は IndexNow を読まないので、Google 側は Search Console のサイトマップに任せる。
// 公開したあとに `node scripts/indexnow.mjs` を手で実行する。
// 送信先は public/<KEY>.txt を読みに来て、このサイトの持ち主からの送信か確かめる。
const HOST = "hatachitachi.com";
const KEY = "3f6b85ec95e2b16bdddf817dedf55303";

const sitemap = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
// 200 / 202 なら受け付け済み。403 はキーファイルがまだ公開されていない
console.log(`${urlList.length} URLs -> ${res.status} ${await res.text()}`);
