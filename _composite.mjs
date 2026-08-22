import sharp from "sharp";
import * as fs from "fs";
const OUT = "/tmp/charcoal";
const VIEWS = ["home-hero","home-products","home-lunchlearn","product-hero","product-specs","resources-top","about-top"];
const LABELS = { current: "CURRENT — navy #0f1620", "A-base": "A — CHARCOAL BASE #20201F", "B-neutral": "B — CHARCOAL NEUTRAL LAYER" };
const W = 1440, H = 960, LBL = 54, GAP = 12;
for (const v of VIEWS) {
  const cols = [];
  for (const variant of ["current","A-base","B-neutral"]) {
    const img = await sharp(`${OUT}/${v}--${variant}.png`).toBuffer();
    const label = Buffer.from(`<svg width="${W}" height="${LBL}"><rect width="100%" height="100%" fill="#0A0A0A"/><text x="24" y="36" font-family="Arial" font-size="26" font-weight="bold" fill="${variant==="current"?"#8b8b8b":"#F97316"}">${LABELS[variant]}</text></svg>`);
    cols.push(await sharp({ create: { width: W, height: H + LBL, channels: 3, background: "#000" } })
      .composite([{ input: label, top: 0, left: 0 }, { input: img, top: LBL, left: 0 }]).png().toBuffer());
  }
  const total = W * 3 + GAP * 2;
  const flat = await sharp({ create: { width: total, height: H + LBL, channels: 3, background: "#333" } })
    .composite(cols.map((c, i) => ({ input: c, top: 0, left: i * (W + GAP) })))
    .png().toBuffer();
  await sharp(flat).resize({ width: 2400 }).jpeg({ quality: 88 }).toFile(`${OUT}/compare-${v}.jpg`);
}
console.log("composites done");
