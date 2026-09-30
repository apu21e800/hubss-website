// Every photograph and mark the site's shared chrome draws — the mega menus,
// the mobile drawer, the footer, the Lunch & Learn card — baked to the sizes it
// is actually shown at and served as plain static files.
//
// WHY
// In August 2026 this project exhausted its Vercel image-optimisation allowance
// and every optimised image on the site answered 402. The chrome is on every
// page, so it was the biggest standing consumer: opening the phone menu once
// asked /_next/image for ~35 transforms (every product, application and
// featured field note), and each mega menu, the footer and the Moose avatar
// added more. None of it needs a runtime optimiser — it only ever renders at a
// handful of fixed sizes. Same fix as scripts/gen-catalogue-pages.mjs.
//
// HOW IT FITS TOGETHER
// scripts/gen-chrome-images.mjs (in `npm run build`) reads the same data the
// chrome renders (every `imageUrl` in lib/products.ts and lib/applications.ts,
// and CHROME_PANELS, CHROME_COVER and CHROME_MARKS below) and writes
// /public/images/chrome/<family>/<stem>-<width>.webp. The files are
// committed and hash-skipped, so an unchanged tree encodes nothing.
// (The Insights menu's posts are not baked: they come from Sanity's CDN at
// the size the menu shows them, via lib/nav-insights.json and
// scripts/gen-nav-insights.ts. Only the fallback cover below is baked.)
//
// The URL is a pure function of (family, source path). Nothing here reads a
// manifest, so the nav carries no lookup table into the browser.
//
// TO SWAP A PICTURE: change `imageUrl` (or the post, or the mark's `src`) and
// push; the build bakes the new one. In `npm run dev` run `npm run gen:chrome`
// first, or the new thumbnail will 404 until you do.
//
// Components render these through components/ui/ChromeImg.tsx.

/**
 * A size family. `widths` are the srcset rungs; the browser picks one from the
 * call site's `sizes`. `square` families are cropped to 1:1 at `position` (CSS
 * object-position, as fractions) so the file IS what the box shows; the rest
 * keep their own aspect and let object-fit do any cropping in CSS.
 *
 * A source smaller than a rung is written at its own size under that rung's
 * name — never upscaled — which is exactly what /_next/image did.
 *
 * `aspect` families are cropped to that width/height ratio at `position`, the
 * same way; `square` is the special case aspect 1.
 *
 * @typedef {{ square: boolean; aspect?: number; position?: [number, number]; widths: number[] }} ChromeFamily
 */

/** @satisfies {Record<string, ChromeFamily>} */
export const CHROME_FAMILIES = {
  // Mobile drawer product and application rows: 56px squares, framed at
  // "center 65%". 64/128/192 = 1x/2x/3x.
  row: { square: true, position: [0.5, 0.65], widths: [64, 128, 192] },
  // Insights post thumbnails, 64px squares in the menu and the drawer. Only
  // CHROME_COVER is baked here now; every other post thumbnail is a Sanity
  // CDN URL written by scripts/gen-nav-insights.ts.
  post: { square: true, position: [0.5, 0.5], widths: [64, 128, 192] },
  // The Insights menu's cover story when Sanity has no photo that qualifies
  // (28 Sep 2026): a 16:9 photograph about 490px wide, 640/960/1280 for 1x
  // to 2x, the shape scripts/gen-nav-insights.ts asks Sanity's CDN for. It was
  // a full-bleed, viewport-sized cover until Doug's round of 25 Sep.
  cover: { square: false, aspect: 16 / 9, position: [0.5, 0.55], widths: [640, 960, 1280] },
  // Moose: 49px wide in the menu card, 92–102px in the Lunch & Learn section.
  moose: { square: false, widths: [64, 128, 192, 256, 320] },
  // Mega menu column headers (26 Sep 2026): one photograph per family or
  // group, 2:1, the width of its column — about 270px on a 1440 screen, up to
  // ~300px at 2xl. 320/480/640 cover 1x to 2x.
  panel: { square: false, aspect: 2, position: [0.5, 0.55], widths: [320, 480, 640] },
  // Footer watermark, 180px square at 4% opacity.
  wheel: { square: false, widths: [180, 360, 540] },
  // Footer wordmark, 44px tall = 153px wide.
  logo: { square: false, widths: [160, 320, 480] },
};

/**
 * The photograph each mega menu column and drawer row opens with, by the
 * family or group label the menu prints (components/sections/Nav.tsx). One
 * list, read by the menu and by the baker, so a picture the menu asks for is
 * always one that was baked. `position` is where the 2:1 crop sits (CSS
 * object-position, as fractions); it overrides the panel family's default.
 *
 * The photo editor's picks of 28 Sep 2026 (QA pa#7, pa#27): none of them is a
 * page hero or a gallery opener, so the menu no longer repeats the picture
 * the visitor is about to land on. Asphalt & Concrete Repair: since 30 Sep
 * 2026 ChipFill being poured into a pothole (Vern: the column "is still
 * missing an image"; the ruled tile read as a missing picture). Not
 * fastpatch-repaired.jpg, whose EXIF carries a third party's copyright.
 *
 * @type {Record<string, { src: string; position: [number, number] }>}
 */
export const CHROME_PANELS = {
  // Teal canoe graphic with hand and globe symbols set into pavers.
  "Preformed Thermoplastics": { src: "/images/products/traffic-patterns/traffic-patterns-24.jpg", position: [0.5, 0.55] },
  // Green StreetBond circles; y=1 keeps the parked vans out of the top edge.
  "Coatings": { src: "/images/products/streetbond/streetbond-17.jpg", position: [0.5, 1] },
  // Red herringbone StreetPrint around a grey stamped medallion.
  "Stamped Asphalt": { src: "/images/products/streetprint/streetprint-29.jpg", position: [0.5, 0.6] },
  // ChipFill poured from its bag into a pothole (1200 x 900): the hand and
  // the pour in the middle band of the 2:1 crop.
  "Asphalt & Concrete Repair": { src: "/images/products/chipfill/chipfill-application.jpg", position: [0.5, 0.5] },
  // Red and yellow tactile-block crosswalk on a residential street.
  "Streets & Safety": { src: "/images/applications/crosswalks/crosswalks-105.jpg", position: [0.5, 0.7] },
  // Park plaza: a paver walk with an orange stripe leading to a pavilion.
  "Parks & Public Spaces": { src: "/images/applications/parks-paths/parks-paths-74.jpg", position: [0.5, 0.55] },
  // Pedestrians crossing a red and white brick-pattern crosswalk, Kitchener.
  "Commercial & Sustainability": { src: "/images/applications/commercial-spaces/commercial-spaces-99.jpg", position: [0.5, 0.8] },
  // Red brick-pattern driveway at a white house's front steps; no house number in frame.
  "Residential": { src: "/images/applications/residential-driveways/residential-driveways-22.jpg", position: [0.5, 0.7] },
};

/**
 * The Insights menu's cover story when Sanity has no post with a landscape
 * photo 1200px or wider (scripts/gen-nav-insights.ts picks the newest one that
 * has). The photo editor's pick: the labyrinth plaza at BC Children's
 * Hospital, a published project post, bright and not a hero anywhere. Baked
 * as a "cover" and as a "post" thumbnail, so the fallback never 404s.
 *
 * @type {{ src: string; slug: string; position: [number, number] }}
 */
export const CHROME_COVER = {
  src: "/images/blog/bc-childrens-hospital-labyrinth/featured.jpg",
  slug: "bc-childrens-hospital-labyrinth",
  position: [0.5, 0.55],
};

/** The fixed marks, one per mark family. */
export const CHROME_MARKS = {
  moose: "/images/lunch-learn/moose.png",
  wheel: "/images/hub-wheel-orange.png",
  logo: "/images/hub-logo-white.png",
};

/**
 * File stem for a source path — readable, flat, stable:
 * "/images/products/mmax/mmax-01.jpg" → "products_mmax_mmax-01".
 * @param {string} src
 */
export function chromeStem(src) {
  return src
    .replace(/^\/+/, "")
    .replace(/^images\//, "")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/\//g, "_")
    .replace(/[^a-zA-Z0-9_-]+/g, "-");
}

/**
 * Public URL of one baked rung.
 * @param {keyof typeof CHROME_FAMILIES} family
 * @param {string} src
 * @param {number} width
 */
export function chromeUrl(family, src, width) {
  return `/images/chrome/${family}/${chromeStem(src)}-${width}.webp`;
}

/**
 * `src` and `srcSet` for a baked chrome image. `src` is the second rung — the
 * 2x size for the thumbnails — for the rare client that ignores srcset.
 * @param {keyof typeof CHROME_FAMILIES} family
 * @param {string} src
 */
export function chromeImage(family, src) {
  const { widths } = CHROME_FAMILIES[family];
  return {
    src: chromeUrl(family, src, widths[Math.min(1, widths.length - 1)]),
    srcSet: widths.map((w) => `${chromeUrl(family, src, w)} ${w}w`).join(", "),
  };
}
