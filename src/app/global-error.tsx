"use client";

// ルートレイアウト自体が落ちた場合の最後の受け皿。html/body を自前で持つ必要がある。
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          fontFamily: "system-ui, sans-serif",
          color: "#1f2430",
          background: "#ffffff",
          textAlign: "center",
          padding: 24,
        }}
      >
        <p style={{ color: "#ff5757", fontSize: 24, fontWeight: 700, margin: 0 }}>
          ページを表示できませんでした
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            border: "2px solid #1f469d",
            color: "#1f469d",
            background: "transparent",
            borderRadius: 999,
            padding: "12px 32px",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          再読み込み
        </button>
        {error.digest && (
          <small style={{ color: "#4a5160" }}>エラーID: {error.digest}</small>
        )}
      </body>
    </html>
  );
}
