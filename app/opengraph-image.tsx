import { ImageResponse } from "next/og";
import { PROFILE } from "@/lib/profile";

export const alt = `${PROFILE.fullName} portfolio preview`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #050810 0%, #0C1F3C 50%, #1E40AF 100%)",
          color: "#E6EDF3",
          padding: "56px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            border: "1px solid rgba(230, 237, 243, 0.18)",
            borderRadius: "28px",
            padding: "44px",
            background: "rgba(13, 17, 23, 0.35)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#00FF88",
                fontSize: "28px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              <span>{">"}</span>
              <span>issa.kane</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: "72px",
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                {PROFILE.fullName}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: "34px",
                  color: "#93C5FD",
                  fontWeight: 600,
                }}
              >
                {PROFILE.role.fr}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                maxWidth: "70%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: "28px",
                  color: "#E2E8F0",
                }}
              >
                Je build des pipelines data et des systèmes ML.
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                  fontSize: "24px",
                  color: "#CBD5E1",
                }}
              >
                <span>EFREI Paris</span>
                <span style={{ color: "#3B82F6" }}>•</span>
                <span>Portfolio 2026</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                border: "1px solid rgba(0, 255, 136, 0.3)",
                borderRadius: "999px",
                padding: "10px 18px",
                color: "#00FF88",
                fontSize: "22px",
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  display: "flex",
                  width: "10px",
                  height: "10px",
                  borderRadius: "999px",
                  background: "#00FF88",
                }}
              />
              <span>CV Mode + Dev Mode</span>
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
