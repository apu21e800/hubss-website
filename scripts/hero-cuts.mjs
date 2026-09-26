/**
 * Cuts the homepage hero's framings from one master photograph.
 *
 * The master is a big canvas with the HUB sign in the middle: sky above it,
 * the crosswalk below, street either side (the designer extends the photo
 * to get there). From it, three centred crops:
 *
 *   public/images/hero/hero-1.jpg           16:10, 2400 px wide  (Studio, every screen by default)
 *   public/images/hero/hero-1-wide.jpg       2:1,   2560 px wide  (wide, short windows)
 *   public/images/hero/hero-1-mobile.jpg     5:4,   1200 px wide  (the phone's picture, above the headline, closer)
 *
 * app/page.tsx offers the wide and mobile files through <picture> when
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
  // The phone: the whole scene as a 4:3 picture above the headline, not a
  // full-bleed crop (a 9:16 slice of this scene is all sign and no street:
  // "too zoomed in", Vern, 26 Sep 2026). Nothing sits on top of it, so the
  // sign goes dead centre.
  // Closer than the whole scene (Vern: "on mobile it needs to be more
  // zoomed in on the HUB"), but not the 9:16 slice: 58% of the master's
  // width, 5:4, the sign a little above the middle so some crosswalk shows.
  { file: "hero-1-mobile.jpg", aspect: 5 / 4, width: 1200, place: [0.5, 0.42], zoom: 0.58 },
];

// A light grade on every cut (Vern: "add more colour and realism, it feels
// muted"): a touch more saturation and contrast, and a little sharpening,
// which the generated master, soft and flat out of the tool, takes well.
const GRADE = { saturation: 1.18, contrast: 1.1, sharpen: 0.8 };

const master = sharp(masterArg).rotate();
const { width: W, height: H } = await master.metadata();
console.log(`master ${W}x${H}, focus ${fx},${fy}, placed at ${px},${py}`);

for (const cut of CUTS) {
  // The largest box of this shape that fits the master, placed so the focus
  // point lands at (px, py) of the box, as far as the edges allow.
  let w = cut.zoom ? Math.round(W * cut.zoom) : W;
  let h = Math.round(w / cut.aspect);
  if (h > H) {
    h = H;
    w = Math.round(h * cut.aspect);
  }
  const [cx, cy] = cut.place ?? [px, py];
  // Where the sign should land. A crop as wide as the master cannot move
  // sideways, so for a cut that asks to centre an off-centre sign, narrow
  // the crop until it can (the phone picture asks for exactly that).
  if (cut.place) {
    const ideal = fx * W - cx * w;
    if (ideal < 0 || ideal + w > W) {
      w = Math.floor(2 * Math.min(fx * W, W - fx * W));
      h = Math.min(H, Math.round(w / cut.aspect));
      w = Math.round(h * cut.aspect);
    }
  }
  const left = Math.round(Math.min(Math.max(fx * W - cx * w, 0), W - w));
  const top = Math.round(Math.min(Math.max(fy * H - cy * h, 0), H - h));
  const outW = Math.min(cut.width, w);
  const outH = Math.round(outW / cut.aspect);
  const target = path.join(OUT, cut.file);
  await sharp(masterArg)
    .rotate()
    .extract({ left, top, width: w, height: h })
    .resize(outW, outH)
    .modulate({ saturation: GRADE.saturation })
    // Contrast about mid-grey: out = in * c + 128 * (1 - c).
    .linear(GRADE.contrast, 128 * (1 - GRADE.contrast))
    .sharpen({ sigma: GRADE.sharpen })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(target);
  const kb = Math.round(fs.statSync(target).size / 1024);
  console.log(`${cut.file}: crop ${w}x${h} at ${left},${top} -> ${outW}x${outH}, ${kb} KB${outW < cut.width ? " (master smaller than the target width)" : ""}`);
}
