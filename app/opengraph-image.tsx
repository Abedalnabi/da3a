import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { WEDDING, COPY } from "@/lib/wedding";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `دعوة زفاف ${WEDDING.groom} & ${WEDDING.bride}`;

export default async function OpengraphImage() {
  const fontsDir = path.join(process.cwd(), "app", "_og-fonts");
  const [bold, regular] = await Promise.all([
    readFile(path.join(fontsDir, "Tajawal-Bold.ttf")),
    readFile(path.join(fontsDir, "Tajawal-Regular.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f3ee",
          backgroundImage:
            "radial-gradient(circle at 18% 20%, rgba(169,127,192,0.22) 0%, rgba(169,127,192,0) 45%), radial-gradient(circle at 85% 80%, rgba(169,127,192,0.2) 0%, rgba(169,127,192,0) 45%)",
          position: "relative",
        }}
      >
        {/* outer decorative frame */}
        <div
          style={{
            position: "absolute",
            inset: 28,
            border: "2px solid rgba(125,86,148,0.35)",
            borderRadius: 20,
            display: "flex",
          }}
        />

        {/* small decorative ring badge — drawn purely with CSS shapes, no font glyph needed */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 78,
            height: 78,
            borderRadius: 999,
            border: "2px solid #a97fc0",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 14,
              height: 14,
              borderRadius: 999,
              backgroundColor: "#a97fc0",
            }}
          />
        </div>

        <div style={{ display: "flex", fontFamily: "Tajawal", fontSize: 30, color: "#7d5694", letterSpacing: 2 }}>
          {COPY.heroKicker}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginTop: 14,
            fontFamily: "Tajawal",
            fontWeight: 700,
            fontSize: 92,
            color: "#4a3b32",
          }}
        >
          <span>{WEDDING.groom}</span>
          <span style={{ color: "#a97fc0", fontSize: 60 }}>&amp;</span>
          <span>{WEDDING.bride}</span>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontFamily: "Tajawal",
            fontSize: 34,
            color: "#8b6d4b",
          }}
        >
          {WEDDING.dayName}، {WEDDING.dateLabel}
        </div>

        {WEDDING.venueName && (
          <div
            style={{
              display: "flex",
              marginTop: 10,
              fontFamily: "Tajawal",
              fontSize: 26,
              color: "#8b6d4b",
            }}
          >
            {WEDDING.venueName}
          </div>
        )}
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Tajawal", data: bold, weight: 700, style: "normal" },
        { name: "Tajawal", data: regular, weight: 400, style: "normal" },
      ],
    }
  );
}
