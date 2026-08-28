type Props = {
  label: string;
  id?: string;
};

// 紺の斜めカット帯見出し (NEWS セクション等)。右端を clip-path で斜めに落とす。
export function SlantBand({ label, id }: Props) {
  return (
    <div id={id} className="relative">
      <div
        className="bg-navy py-5 pl-[6vw] pr-24 md:w-[62%]"
        style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 72px) 100%, 0 100%)" }}
      >
        <h2 className="font-mincho text-3xl font-bold tracking-[0.35em] text-white md:text-4xl">
          {label}
        </h2>
      </div>
    </div>
  );
}
