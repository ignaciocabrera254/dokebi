import { ImageResponse } from "next/og";

export const alt = "DOKEBI · Korean Street Food · Santiago";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#FFD400", color: "#0A0A0A", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, fontSize: 120, fontWeight: 900, lineHeight: 1 }}>
        <div style={{ display: "flex" }}>DOKEBI</div>
        <div style={{ display: "flex", fontSize: 56, marginTop: 24 }}>Korean Street Food · Santiago</div>
      </div>
    ),
    size,
  );
}
