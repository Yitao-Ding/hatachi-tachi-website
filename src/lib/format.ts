// 日付整形は必ず Asia/Tokyo に固定する。
// getFullYear/getMonth/getDate は実行環境のタイムゾーン依存で、
// UTC で動く Vercel 上では日本時間の日付が1日前にずれる。

const FORMATTER = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** 表示用の "2026.08.01"。パースできない値は空文字を返す。 */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const parts = FORMATTER.formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}.${get("month")}.${get("day")}`;
}

/** <time dateTime> 用の "2026-08-01"。パースできない値は空文字を返す。 */
export function toDateAttr(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const parts = FORMATTER.formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}
