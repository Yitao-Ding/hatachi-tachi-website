type Props = {
  /** 省略すると無地になる (背景コラージュ等、ラベルを出したくない用途) */
  label?: string;
  className?: string;
};

// 実素材受領までの仮画像。差し替え時はこの使用箇所を next/image に置き換える。
export function PlaceholderImage({ label, className = "" }: Props) {
  return (
    <div
      className={`bg-ink/10 text-ink/40 flex items-center justify-center text-center text-xs tracking-[0.25em] ${className}`}
      aria-hidden
    >
      {label}
    </div>
  );
}
