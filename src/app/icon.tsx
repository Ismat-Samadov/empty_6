// ============================================================
// App icon — neon piano key favicon (Next.js ImageResponse)
// ============================================================

import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#0a0a0f",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 1,
          padding: 3,
          borderRadius: 6,
          border: "1.5px solid #00f5ff44",
        }}
      >
        {/* 3 white keys */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 7,
              height: 20,
              background: i === 1 ? "#0a0a0f" : "#ffffff",
              border: i === 1 ? "1px solid #00f5ff" : "none",
              borderRadius: "0 0 2px 2px",
              boxShadow: i === 1 ? "0 0 6px #00f5ff" : "none",
            }}
          />
        ))}
      </div>
    ),
    { ...size }
  );
}
