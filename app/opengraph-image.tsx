import { ImageResponse } from "next/og";

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
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#020617",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          border: "8px solid #0f172a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "#0891b2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 900,
              fontSize: "24px",
            }}
          >
            F
          </div>
          <span style={{ fontSize: "36px", fontWeight: 800, color: "#ffffff", letterSpacing: "-1px" }}>
            ForgeFlow
          </span>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#22d3ee",
              backgroundColor: "rgba(6, 182, 212, 0.15)",
              padding: "6px 14px",
              borderRadius: "999px",
              border: "1px solid rgba(6, 182, 212, 0.4)",
              marginLeft: "12px",
            }}
          >
            ENTERPRISE AEO &amp; SEO
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ width: "80px", height: "4px", backgroundColor: "#06b6d4", borderRadius: "2px" }} />
          <h1
            style={{
              fontSize: "62px",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.1,
              letterSpacing: "-2px",
              margin: 0,
            }}
          >
            Industrial Answer Engine Optimization
          </h1>
          <p
            style={{
              fontSize: "24px",
              color: "#94a3b8",
              margin: 0,
              maxWidth: "900px",
              lineHeight: 1.4,
            }}
          >
            Deterministic technical SEO &amp; AEO graph engine for manufacturing, HVAC, precision tooling, and industrial OEMs.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #1e293b",
            paddingTop: "24px",
          }}
        >
          <span style={{ fontSize: "16px", color: "#64748b", fontFamily: "monospace" }}>
            7 INDUSTRIAL VERTICALS • CAD STEP SCHEMA • DIN/JIS CROSSWALK
          </span>
          <span style={{ fontSize: "18px", color: "#22d3ee", fontWeight: 700 }}>
            forgeflow.ai
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
