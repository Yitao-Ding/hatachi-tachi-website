type Props = {
  label?: string;
  className?: string;
};

// 実素材受領までの仮画像。差し替え時はこのコンポーネントの使用箇所を Image に置き換える。
export function PlaceholderImage({ label = "PHOTO", className = "" }: Props) {
  return (
    <div
      className={`flex items-center justify-center bg-ink/10 text-xs tracking-[0.3em] text-ink/40 ${className}`}
      aria-hidden
    >
      {label}
    </div>
  );
}
