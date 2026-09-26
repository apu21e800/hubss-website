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
// chrome renders — every `imageUrl` in lib/products.ts and lib/applications.ts,
// FEATURED_POSTS in lib/nav-featured-posts.mjs, and CHROME_MARKS below — and
// writes /public/images/chrome/<family>/<stem>-<width>.webp. The files are
// committed and hash-skipped, so an unchanged tree encodes nothing.
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
  // Field Notes thumbnails: 52px in the desktop rail, 64px on the menu floor
  // and in the drawer. Centred, like the object-cover they replace.
  post: { square: true, position: [0.5, 0.5], widths: [64, 128, 192] },
  // The Field Notes mega menu cover, full bleed. Its box follows the viewport,
  // so the file keeps its aspect. These were the optimiser's own deviceSizes
  // above the smallest phone width, which a desktop-only menu never uses.
  cover: { square: false, widths: [828, 1200, 1920] },
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
 * always one that was baked. Pick a member's own photo that reads at 2:1.
 */
export const CHROME_PANELS = {
  "Preformed Thermoplastics": "/images/products/traffic-patterns-xd/traffic-patterns-xd-03.jpg",
  "Coatings": "/images/products/streetbondsr/streetbondsr-02.jpg",
  "Stamped Asphalt": "/images/products/streetprint/streetprint-01.jpg",
  "Asphalt & Concrete Repair": "/images/products/fast-patch/fastpatch-repaired.jpg",
  "Streets & Safety": "/images/applications/crosswalks/crosswalks-09.jpg",
  "Parks & Public Spaces": "/images/blog/white-rock-langley-trafficpatterns/featured.jpg",
  "Commercial & Sustainability": "/images/applications/parking-lots/parking-lots-01.jpg",
  "Residential": "/images/applications/residential-driveways/residential-driveways-18.jpg",
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
