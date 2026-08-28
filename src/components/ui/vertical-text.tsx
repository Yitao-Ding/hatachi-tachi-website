type Props = {
  children: string;
  className?: string;
};

// 装飾用の縦書きテキスト。折返しが必要な長文には使わない (Safari の行高差でズレるため)。
// display は呼び出し側で指定する (inline-block を固定すると hidden と競合するため)。
export function VerticalText({ children, className = "" }: Props) {
  return <span className={`vertical-text ${className}`}>{children}</span>;
}
