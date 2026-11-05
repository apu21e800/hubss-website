import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * The Lunch & Learn page's own share card (4 Nov 2026). Until then the page
 * Doug and Vern send by email and LinkedIn, and the display ads land on,
 * shared the site's generic card (the UBC crosswalk); a card that says what
 * the page offers reads as an offer in a feed. Drawn here from words alone,
 * so no new photo file is needed (binaries travel by bundle, CLAUDE.md) and
 * nothing is read from /public (the deploy trap there: a file read packs
 * the folder into the function). Next renders it at build and serves it at
 * /lunch-learn/opengraph-image; lib/seo.ts's default stays on the other
 * pages. Inter from scripts/flyers/fonts (Inter 4.1, OFL).
 */
export const alt = "Lunch & Learn with HUB Surface Systems: specify with confidence, lunch is on us";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FONTS = path.join(process.cwd(), "scripts", "flyers", "fonts");

export default async function Image() {
  const [bold, medium] = await Promise.all([
    readFile(path.join(FONTS, "InterDisplay-ExtraBold.ttf")),
    readFile(path.join(FONTS, "Inter-Medium.ttf")),
  ]);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#101010",
          color: "#F5F0EB",
          fontFamily: "Inter",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 10, background: "linear-gradient(90deg, #F97316, #EAB308)", display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "72px 80px", width: 1200 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <div style={{ width: 22, height: 22, borderRadius: 11, background: "#F97316", display: "flex" }} />
            <div style={{ fontSize: 24, letterSpacing: 5, textTransform: "uppercase", color: "#F97316", fontWeight: 500, display: "flex" }}>Lunch &amp; Learn</div>
          </div>
          <div style={{ fontSize: 78, lineHeight: 1.02, fontWeight: 800, letterSpacing: -2.5, display: "flex", flexDirection: "column" }}>
            <span>Specify with confidence.</span>
            <span style={{ color: "#F97316" }}>Lunch is on us.</span>
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.35, color: "#B8B3AC", marginTop: 30, fontWeight: 500, display: "flex" }}>
            Sixty minutes with your engineering, landscape architecture or planning team. Canadian case studies, spec language and samples you can hold.
          </div>
          <div style={{ fontSize: 24, color: "#F5F0EB", marginTop: 36, fontWeight: 500, display: "flex" }}>HUB Surface Systems · hubss.com/lunch-learn</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: bold, weight: 800, style: "normal" },
        { name: "Inter", data: medium, weight: 500, style: "normal" },
      ],
    }
  );
}
