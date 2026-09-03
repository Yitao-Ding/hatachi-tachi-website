// ヒーローの縦書き (珊瑚 #f55454) が背景コラージュの上でコントラスト基準を満たすかを実測する。
// 目視では判断できないので、実際の合成結果から計算する。
//
// 合成: paper-warm #f7f3ec の上に、grayscale + brightness(1.35) をかけた写真を opacity 0.3 で重ねる。
import sharp from "sharp";
import path from "node:path";

const ASSETS = path.resolve(import.meta.dirname, "../public/assets");
const TEXT = [0xf5, 0x54, 0x54]; // --coral-on-warm
const BASE = [247, 243, 236]; // --paper-warm
const OPACITY = 0.3;
const BRIGHTNESS = 1.35;

const srgb = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const contrast = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/*
 * コラージュには左右を抜くマスクがかかっている。
 * linear-gradient(to right, transparent 0%, transparent 11%, black 19%, black 81%, transparent 89%, transparent 100%)
 * 縦書きが実際に乗るのは左が 5〜9%、右が 91〜95% なので、そこでのマスク値を返す。
 */
function maskAlphaAt(pct) {
  if (pct <= 11 || pct >= 89) return 0;
  if (pct < 19) return (pct - 11) / 8;
  if (pct > 81) return (89 - pct) / 8;
  return 1;
}

const TEXT_BANDS = [
  ["左の縦書き「最強セカイ」", 5, 9],
  ["右の縦書き「ここからは私たちがつくる」", 91, 95],
];

/** 縦書きが乗るのは左右カラムだけ。上下の中央 40% の帯を見る */
async function worstCase(file) {
  const { data, info } = await sharp(path.join(ASSETS, file))
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const y0 = Math.floor(info.height * 0.3);
  const y1 = Math.ceil(info.height * 0.7);

  const grays = [];
  for (let y = y0; y < y1; y++) {
    for (let x = 0; x < info.width; x++) grays.push(data[y * info.width + x]);
  }
  grays.sort((a, b) => a - b);

  // 最暗の1画素で判定すると過剰なので、下位1%タイルを最悪ケースとする
  return grays[Math.floor(grays.length * 0.01)];
}

/** マスク込みの実効不透明度で合成し、コントラストを返す */
function ratioAt(gray, xPct) {
  const o = OPACITY * maskAlphaAt(xPct);
  const lifted = Math.min(255, gray * BRIGHTNESS);
  const composite = BASE.map((c) => Math.round((1 - o) * c + o * lifted));
  return { composite, ratio: contrast(TEXT, composite) };
}

const darkest = {
  "hero-bg-1.webp": await worstCase("hero-bg-1.webp"),
  "hero-bg-4.webp": await worstCase("hero-bg-4.webp"),
};

console.log("背景写真の下位1%輝度:", JSON.stringify(darkest));
console.log("");

for (const [name, from, to] of TEXT_BANDS) {
  const file = from < 50 ? "hero-bg-1.webp" : "hero-bg-4.webp";
  let worst = null;
  for (let x = from; x <= to; x += 0.5) {
    const r = ratioAt(darkest[file], x);
    if (!worst || r.ratio < worst.ratio) worst = { ...r, x };
  }
  const verdict = worst.ratio >= 3 ? "OK (大文字基準 3:1)" : "NG";
  console.log(
    `${name}\tx=${worst.x}%\t合成後=rgb(${worst.composite.join(",")})\t` +
      `コントラスト=${worst.ratio.toFixed(2)}:1\t${verdict}`,
  );
}

// マスクが無かった場合 (= 修正前) の値。悪化を戻したときに気づけるよう残す
const before = ratioAt(darkest["hero-bg-4.webp"], 50);
console.log(
  `\n参考: マスク無しだと\t合成後=rgb(${before.composite.join(",")})\tコントラスト=${before.ratio.toFixed(2)}:1`,
);
