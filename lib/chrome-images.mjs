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
 * 2 Oct 2026 (Vern: "choose better images for mega menu, chipfill is fine.
 * Try to pull images from the new print catalogue we built"): seven of the
 * eight panels now show the Idea Book's own photographs, web copies in
 * /images/catalogue-assets (its _manifest.json says where each sits in the
 * book and what the book's caption names). Each pick is sharp, on product,
 * the surface is the subject, and nobody's face is in it. None is a page
 * hero. The panels are decorative (the label is printed under them), so the
 * descriptions below are the record of what each frame shows.
 *
 * @type {Record<string, { src: string; position: [number, number] }>}
 */
export const CHROME_PANELS = {
  // Picked again on 2 Oct 2026 from the Idea Book's print set (Vern: "still
  // need to select better images for mega menu, try images from the new
  // print catalogue"): the brightest, most on-product frame for each family
  // or group, the surface itself the subject. The web copies and their
  // provenance are in public/images/catalogue-assets/_manifest.json.
  //
  // Red and black formline crosswalk in preformed thermoplastic, white edge
  // lines, a square frame. y=0.55: the design across the middle band.
  "Preformed Thermoplastics": { src: "/images/catalogue-assets/native-crosswalk-1.jpg", position: [0.5, 0.55] },
  // StreetBond in six colours over a plaza and up its planter walls, the
  // book's "colour on concrete and vertical surfaces" frame. y=0.55 keeps
  // the painted ground and the walls, a strip of the buildings behind.
  "Coatings": { src: "/images/catalogue-assets/streetbond-geometric-plaza.jpg", position: [0.5, 0.55] },
  // Red herringbone StreetPrint across a residential street, cars parked
  // along it: stamped asphalt as a street, not a driveway. y=0.45 keeps the
  // parked cars and the far curb for scale above the pattern.
  "Stamped Asphalt": { src: "/images/catalogue-assets/streetprint-red-herringbone-street.jpg", position: [0.5, 0.45] },
  // ChipFill poured from its bag into a pothole (1200 x 900): the hand and
  // the pour in the middle band of the 2:1 crop. Vern, 2 Oct: "chipfill is fine".
  "Asphalt & Concrete Repair": { src: "/images/products/chipfill/chipfill-application.jpg", position: [0.5, 0.5] },
  // "LOOK LISTEN LIVE .ca" in yellow DecoMark at a rail crossing, the train
  // behind: safety said in the surface. y=0.68: the lettering whole, the
  // train's wheels along the top.
  "Streets & Safety": { src: "/images/catalogue-assets/decomark-look-listen-live-rail-crossing.jpg", position: [0.5, 0.68] },
  // Splash pad coated in two blues with white spray arches, houses behind.
  // y=0.7: arches and pad, a strip of sky.
  "Parks & Public Spaces": { src: "/images/catalogue-assets/streetbond-splash-pad-arches.jpg", position: [0.5, 0.7] },
  // The blue and white sport court from the air (the Sport Courts gallery's
  // own sport-courts-24.jpg, the same frame the book prints). y=0.5: the
  // court's circle in the middle of the band.
  "Commercial & Sustainability": { src: "/images/applications/sport-courts/sport-courts-24.jpg", position: [0.5, 0.5] },
  // StreetPrint herringbone driveway under autumn leaves, the book's own
  // "The result" photo for stamped asphalt: a home's drive, so Residential.
  // The frame is almost 2:1 already.
  "Residential": { src: "/images/catalogue-assets/streetprint-driveway-autumn-leaves.jpg", position: [0.5, 0.5] },
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
