/**
 * Cuts the homepage hero's framings from one master photograph.
 *
 * The master is a big canvas with the HUB sign in the middle: sky above it,
 * the crosswalk below, street either side (the designer extends the photo
 * to get there). From it, three centred crops:
 *
 *   public/images/hero/hero-1.jpg           16:10, 2400 px wide  (Studio, every screen by default)
 *   public/images/hero/hero-1-wide.jpg       2:1,   2560 px wide  (wide, short windows)
 *   public/images/hero/hero-1-portrait.jpg   9:16,  1080 px wide  (phones held upright)
 *
 * app/page.tsx offers the wide and portrait files through <picture> when
 * they exist; the 16:10 file is the one to push to Studio with
 * `npm run photos:sync -- --only=homepage`.
 *
 * Usage:  node scripts/hero-cuts.mjs <master.png|jpg> [--focus=0.5,0.5] [--place=0.5,0.36]
 * --focus is where the sign's centre sits in the master, as fractions of its
 * width and height; the default assumes the designer centred it. --place is
 * where that point should land in each cut: 0.5,0.36 puts the sign in the
 * upper middle, which leaves the lower part of the frame to the headline
 * (HeroSlideshow.tsx anchors the type low for exactly this reason).
 */
import sharp from "sharp";
import * as fs from "node:fs";
import * as path from "node:path";

const [, , masterArg, ...flags] = process.argv;
if (!masterArg) {
  console.error("Usage: node scripts/hero-cuts.mjs <master image> [--focus=0.5,0.5]");
  process.exit(1);
}
const focusFlag = flags.find((f) => f.startsWith("--focus="));
const [fx, fy] = focusFlag ? focusFlag.slice(8).split(",").map(Number) : [0.5, 0.5];
const placeFlag = flags.find((f) => f.startsWith("--place="));
const [px, py] = placeFlag ? placeFlag.slice(8).split(",").map(Number) : [0.5, 0.36];

const OUT = path.join(process.cwd(), "public", "images", "hero");
const CUTS = [
  { file: "hero-1.jpg", aspect: 16 / 10, width: 2400 },
  { file: "hero-1-wide.jpg", aspect: 2, width: 2560 },
  { file: "hero-1-portrait.jpg", aspect: 9 / 16, width: 1080 },
];

const master = sharp(masterArg).rotate();
const { width: W, height: H } = await master.metadata();
console.log(`master ${W}x${H}, focus ${fx},${fy}, placed at ${px},${py}`);

for (const cut of CUTS) {
  // The largest box of this shape that fits the master, placed so the focus
  // point lands at (px, py) of the box, as far as the edges allow.
  let w = W;
  let h = Math.round(w / cut.aspect);
  if (h > H) {
    h = H;
    w = Math.round(h * cut.aspect);
  }
  const left = Math.round(Math.min(Math.max(fx * W - px * w, 0), W - w));
  const top = Math.round(Math.min(Math.max(fy * H - py * h, 0), H - h));
  const outW = Math.min(cut.width, w);
  const outH = Math.round(outW / cut.aspect);
  const target = path.join(OUT, cut.file);
  await sharp(masterArg)
    .rotate()
    .extract({ left, top, width: w, height: h })
    .resize(outW, outH)
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(target);
  const kb = Math.round(fs.statSync(target).size / 1024);
  console.log(`${cut.file}: crop ${w}x${h} at ${left},${top} -> ${outW}x${outH}, ${kb} KB${outW < cut.width ? " (master smaller than the target width)" : ""}`);
}
