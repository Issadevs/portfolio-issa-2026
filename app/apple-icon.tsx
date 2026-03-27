import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#0D1117",
          borderRadius: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          border: "3px solid #00FF88",
        }}
      >
        <span
          style={{
            color: "#00FF88",
            fontSize: 18,
            fontFamily: "monospace",
            fontWeight: 600,
            letterSpacing: 1,
            opacity: 0.8,
          }}
        >
          &gt;_
        </span>
        <span
          style={{
            color: "#FFFFFF",
            fontSize: 64,
            fontWeight: 800,
            fontFamily: "sans-serif",
            lineHeight: 1,
            letterSpacing: -2,
          }}
        >
          IK
        </span>
      </div>
    ),
    { ...size }
  );
}
