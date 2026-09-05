import type { ReactNode } from "react";

type Props = {
  /** 見出しを出す帯。省略すると図形だけの帯になる (NEWS 下部の帯がこれ) */
  label?: string;
  id?: string;
  /** 帯の上に乗せる要素 (白いピルボタン等) */
  children?: ReactNode;
  /** left: 左端から伸びて右端が斜め / right: 右端まで伸びて左端が斜め */
  side?: "left" | "right";
  /** 見出しのレベル。トップではセクション見出し (h2)、お知らせ一覧ではページ見出し (h1) */
  as?: "h1" | "h2";
  className?: string;
};

// 草案実測: 帯の高さ 87px に対して水平方向のずれは 27〜28px (傾き比 0.31)。
// 目分量で大きくすると角度が3倍近く急になるので、比率で持つ。
const BAND_SLANT_RATIO = 0.31;
const BAND_HEIGHT = 88;
const SLANT = Math.round(BAND_HEIGHT * BAND_SLANT_RATIO);

export function SlantBand({
  label,
  id,
  children,
  side = "left",
  as: Heading = "h2",
  className = "",
}: Props) {
  const clipPath =
    side === "left"
      ? `polygon(0 0, 100% 0, calc(100% - ${SLANT}px) 100%, 0 100%)`
      : `polygon(${SLANT}px 0, 100% 0, 100% 100%, 0 100%)`;

  return (
    <div
      id={id}
      className={
        side === "left"
          ? `bg-navy w-full md:w-[62%] ${className}`
          : `bg-navy ml-auto w-full md:w-[62%] ${className}`
      }
      style={{ clipPath }}
    >
      {label && (
        <Heading className="font-roman py-5 pl-[6vw] pr-16 text-3xl font-semibold tracking-[0.35em] text-white md:text-4xl">
          {label}
        </Heading>
      )}
      {children}
    </div>
  );
}
