/**
 * Cuts the homepage hero's framings from one master photograph.
 *
 * The master (2 Oct 2026) is the photograph at its full size: the print
 * catalogue's "UBC Crosswalk 1.png" (2540 x 1904, in the client folder under
 * _archive/design-assets/catalog-print-build/assets/booklet/) with the sign's
 * letters replaced by the HUB letters of the retouch the client approved
 * (26 Sep 2026, a 1632 px copy of the same photograph): registered on the
 * facades, the plinth and the pavement round the sign, scaled up, toned to
 * the original and pasted with a wide feather, so the rest of the frame is
 * the original's own pixels. It is a 7 MB PNG and is not in the repo. Before
 * it, the 1632 px retouch itself was the master, and before that a generated
 * extension of the photo, which Vern sent back on 26 Sep ("swap back in the
 * original").
 *
 * The photograph is 4:3 and has nothing more at its sides than any cut
 * shows, so "zoomed out" (Vern, 2 Oct 2026: "main hero image, can it be
 * zoomed out a bit to show more of the crosswalk?") cannot come from a
 * wider crop. What the cuts do: every one starts just above the sign, so
 * the rows the old cuts spent on the building go to the crosswalk, and the
 * wide one is the shape HeroSlideshow.tsx shows it at (lib/hero-framing.ts,
 * HOME_HERO). From the master, three crops:
 *
 *   public/images/hero/hero-1.jpg           16:10, 1920 px wide  (Studio, every screen by default)
 *   public/images/hero/hero-1-wide.jpg      1.8:1, 1920 px wide  (windows 16:9 and wider)
 *   public/images/hero/hero-1-mobile.jpg     5:4,  1200 px wide  (the phone's picture, above the headline, closer)
 *
 * app/page.tsx offers the wide and mobile files through <picture> when
 * they exist; the 16:10 file is the one to push to Studio with
 * `npm run photos:sync -- --only=homepage`.
 *
 * Usage:  node scripts/hero-cuts.mjs <master.png|jpg> [--focus=0.598,0.269] [--place=0.5,0.278] [--grade=photo|pop|generated|none] [--out=dir]
 * --focus is where the sign's centre sits in the master, as fractions of its
 * width and height; the default is the 2 Oct 2026 master's (the sign spans
 * x 1102-1935 and y 230-795 there, plinth included). --place is where that
 * point lands in the 16:10 cut; the wide and phone cuts carry their own,
 * because the same top edge needs a different fraction in each shape. The
 * type sits low in every framing (HeroSlideshow.tsx anchors it there), so
 * the sign stays in the upper part. --out writes the files elsewhere, to
 * preview them before they replace the ones in /public.
 *
 * The files in /public were cut on 2 Oct 2026 with `--grade=pop`, the grade
 * the 28 Sep files had (measured against them), so the colour is unchanged:
 *   node scripts/hero-cuts.mjs hero-master-2540.png --grade=pop
 */
import sharp from "sharp";
import * as fs from "node:fs";
import * as path from "node:path";

const [, , masterArg, ...flags] = process.argv;
if (!masterArg) {
  console.error("Usage: node scripts/hero-cuts.mjs <master image> [--focus=0.598,0.269]");
  process.exit(1);
}
const focusFlag = flags.find((f) => f.startsWith("--focus="));
const [fx, fy] = focusFlag ? focusFlag.slice(8).split(",").map(Number) : [0.598, 0.269];
const placeFlag = flags.find((f) => f.startsWith("--place="));
const [px, py] = placeFlag ? placeFlag.slice(8).split(",").map(Number) : [0.5, 0.278];
const outFlag = flags.find((f) => f.startsWith("--out="));

const OUT = outFlag ? path.resolve(outFlag.slice(6)) : path.join(process.cwd(), "public", "images", "hero");
// 2 Oct 2026, in master pixels (1904 rows): the sign's top is row 230, the
// salmon's scales end about row 1560 and its outline about row 1600.
// Widths and JPEG qualities keep each file near the size of the one it
// replaces (505, 391 and 245 KB); the full-size master has more detail per
// pixel than the 1632 px one did, so the same quality costs more bytes.
const CUTS = [
  // 16:10, as wide as the photo, top edge at row 71. HeroSlideshow.tsx frames
  // this file at "69% 42%", which at 1440 x 900 shows rows 151-1548: the sign
  // with a little air above it, the salmon down to the bottom of the frame.
  // That is the window the old cut gave there (141-1532), so Studio's copy
  // frames the same before and after it is replaced; the new file is sharper.
  { file: "hero-1.jpg", aspect: 16 / 10, width: 1920, quality: 76 },
  // Windows 16:9 and wider (Vern's screenshot, about 1625 x 720). This cut was
  // 2:1 from row 140 and the frame cropped it further, so the sign filled the
  // top half and the art was cut off under the buttons. Now: rows 150-1561,
  // the sign with a little air above it and the salmon down through its
  // scales, 1.8:1, and HeroSlideshow.tsx shows the whole cut at the hero's
  // height (lib/hero-framing.ts, HOME_HERO.wide.shape is this aspect).
  { file: "hero-1-wide.jpg", aspect: 1.8, width: 1920, quality: 74, place: [0.5, 0.257] },
  // The phone: the whole scene as a 4:3 picture above the headline, not a
  // full-bleed crop (a 9:16 slice of this scene is all sign and no street:
  // "too zoomed in", Vern, 26 Sep 2026). Nothing sits on top of it, so the
  // sign goes dead centre.
  // Closer than the whole scene (Vern: "on mobile it needs to be more
  // zoomed in on the HUB"), but not the 9:16 slice: 62% of the master's
  // width, 5:4. 2 Oct 2026: the sign keeps that size; the window starts at
  // row 110 instead of the top of the photo, so the crosswalk's band and the
  // salmon's fin show at the foot where the building was.
  { file: "hero-1-mobile.jpg", aspect: 5 / 4, width: 1200, quality: 76, place: [0.5, 0.319], zoom: 0.62, centre: true },
];

// A light grade on every cut (Vern: "add more colour and realism, it feels
// muted", then "light it"). `photo` is for a real photograph: a small lift
// in brightness, saturation and contrast and a little sharpening. `generated`
// is stronger, for a master that came soft and flat out of an image tool.
// Pick with --grade=photo|pop|generated|none.
// `pop` (27 Sep 2026, Vern: the desktop hero "needs some colour pop, seems too
// muted") pushes the crosswalk's blues, greens and gold without touching the
// steel sign, which is grey and barely moves under saturation.
const GRADES = {
  photo: { brightness: 1.04, saturation: 1.1, contrast: 1.06, sharpen: 0.6 },
  pop: { brightness: 1.05, saturation: 1.24, contrast: 1.08, sharpen: 0.6 },
  generated: { brightness: 1.0, saturation: 1.18, contrast: 1.1, sharpen: 0.8 },
  none: { brightness: 1.0, saturation: 1.0, contrast: 1.0, sharpen: 0 },
};
const gradeFlag = flags.find((f) => f.startsWith("--grade="));
const GRADE = GRADES[gradeFlag ? gradeFlag.slice(8) : "photo"] ?? GRADES.photo;

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
  // the crop until it can (the phone picture asks for exactly that; the
  // wide cut's place is only about its top edge, so it keeps the full width).
  if (cut.centre) {
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
    .modulate({ brightness: GRADE.brightness, saturation: GRADE.saturation })
    // Contrast about mid-grey: out = in * c + 128 * (1 - c).
    .linear(GRADE.contrast, 128 * (1 - GRADE.contrast))
    .sharpen(GRADE.sharpen ? { sigma: GRADE.sharpen } : undefined)
    .jpeg({ quality: cut.quality ?? 88, mozjpeg: true })
    .toFile(target);
  const kb = Math.round(fs.statSync(target).size / 1024);
  console.log(`${cut.file}: crop ${w}x${h} at ${left},${top} -> ${outW}x${outH}, ${kb} KB${outW < cut.width ? " (master smaller than the target width)" : ""}`);
}
