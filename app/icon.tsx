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
          background: "#0D1117",
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1.5px solid #00FF88",
        }}
      >
        <span
          style={{
            color: "#00FF88",
            fontSize: 16,
            fontWeight: 800,
            fontFamily: "monospace",
            letterSpacing: "-1px",
            lineHeight: 1,
          }}
        >
          IK
        </span>
      </div>
    ),
    { ...size }
  );
}
