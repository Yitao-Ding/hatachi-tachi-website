// 実素材を public/assets 用に切り出して WebP 化する。
// 元ファイルは ~/Downloads/ハタチたちhp/ に置いてある撮影オリジナル。
// 冪等。素材を差し替えたら下の定義を直して `node scripts/build-assets.mjs` を再実行する。
import sharp from "sharp";
import path from "node:path";
import { mkdir } from "node:fs/promises";

const SRC = "/Users/ittou/Downloads/ハタチたちhp";
const OUT = path.resolve(import.meta.dirname, "../public/assets");
const src = (name) => path.join(SRC, name);

/**
 * ヒーローの円陣は動画フレームを画面サイズのキャンバスに貼ったスクショで、左右に黒帯が入る。
 * 列ごとの平均輝度を見て、黒帯だけを落とす。閾値は低めにして暗いシーンを切らないようにする。
 */
async function detectContentBox(file) {
  const { data, info } = await sharp(file)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const colMean = new Array(info.width).fill(0);
  for (let x = 0; x < info.width; x++) {
    let sum = 0;
    for (let y = 0; y < info.height; y++) sum += data[y * info.width + x];
    colMean[x] = sum / info.height;
  }

  const THRESHOLD = 18;
  let left = 0;
  let right = info.width - 1;
  while (left < right && colMean[left] < THRESHOLD) left++;
  while (right > left && colMean[right] < THRESHOLD) right--;

  return { left, top: 0, width: right - left + 1, height: info.height };
}

/** アスペクト比を指定して中央から切る。anchor は縦位置 (0=上 / 0.5=中央 / 1=下)。 */
function cropToAspect(box, aspect, anchor = 0.5) {
  let w = box.width;
  let h = Math.round(w / aspect);
  if (h > box.height) {
    h = box.height;
    w = Math.round(h * aspect);
  }
  const left = box.left + Math.round((box.width - w) / 2);
  const top = box.top + Math.round((box.height - h) * anchor);
  return { left, top, width: w, height: h };
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const made = [];

  // ヒーロー主写真。草案の枠は 270:100。円陣が画面の下寄りにあるので anchor を下げる
  const circleSrc = src("IMG_4442.PNG");
  const box = await detectContentBox(circleSrc);
  console.log(`円陣: 黒帯を除いた実写部分 left=${box.left} width=${box.width}`);
  await sharp(circleSrc)
    .extract(cropToAspect(box, 270 / 100, 0.72))
    .resize({ width: 2160 })
    .webp({ quality: 82 })
    .toFile(path.join(OUT, "hero-circle.webp"));
  made.push("hero-circle.webp");

  // ABOUT の2枚。どちらも 4:3 なのでリサイズだけ
  const abouts = [
    ["IMG_0970.JPG", "about-1.webp"],
    ["IMG_0961.JPG", "about-2.webp"],
  ];
  for (const [from, to] of abouts) {
    await sharp(src(from)).resize({ width: 1400 }).webp({ quality: 82 }).toFile(path.join(OUT, to));
    made.push(to);
  }

  // NEWS サムネ。縦長の告知画像。文字が入っているので圧縮を控えめにする
  await sharp(src("IMG_1804 2.jpg"))
    .resize({ width: 900 })
    .webp({ quality: 88 })
    .toFile(path.join(OUT, "news-hatachitachi5.webp"));
  made.push("news-hatachitachi5.webp");

  // ヒーロー背景のコラージュ。35% 透過 + グレースケールで地としてしか出ないので軽くする。
  // 枠の縦横に合わせて、縦長の枠には縦写真、横長の枠には横写真を割り当てている
  const bg = [
    ["IMG_4454.JPG", "hero-bg-1.webp"], // 左カラム (縦長)
    ["IMG_3385.JPG", "hero-bg-2.webp"], // 中央上 (横長)
    ["IMG_3472.JPG", "hero-bg-3.webp"], // 中央下 (横長)
    ["IMG_4459.JPG", "hero-bg-4.webp"], // 右カラム (縦長)
  ];
  for (const [from, to] of bg) {
    await sharp(src(from)).resize({ width: 1000 }).webp({ quality: 70 }).toFile(path.join(OUT, to));
    made.push(to);
  }

  // SNS 共有用。1200×630 ちょうどに切る
  await sharp(src("IMG_0961.JPG"))
    .resize({ width: 1200, height: 630, fit: "cover", position: "attention" })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(OUT, "ogp.jpg"));
  made.push("ogp.jpg");

  for (const f of made) {
    const m = await sharp(path.join(OUT, f)).metadata();
    console.log(`${f}\t${m.width}x${m.height}\t${(m.size / 1024).toFixed(0)}KB`);
  }
}

main();
