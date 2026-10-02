/**
 * Hero framing: where each product and application hero photo sits inside its banner.
 *
 * The banner is full width and clamp(360px, 52vh, 560px) tall with object-fit: cover, so
 * the same photo is cut to about 2.8:1 on a 1440 desktop and about 0.75:1 on a 390 phone.
 * One centre crop cannot suit both: the QA round (27 Sep 2026, pa#16) found heads cut off
 * on TrafficPatterns, the cyclist lost on Bike Lanes, and the plane gone from Airports.
 * Each value below is a CSS object-position chosen by previewing the photo at both shapes
 * under the banner's gradients, so the subject (the walkers, the cyclist, the trucks, the
 * plane, the crosswalk) stays in frame and clear of the headline in the lower left.
 * Keys are the photo's /public path, which is also what a Sanity photo records as its
 * `origin` (lib/photos.ts), so the value follows the photo rather than the page. The
 * templates read HERO_POSITION[photo origin] first, then the older per-product
 * `heroPosition` in lib/products.ts, then their default. A photo swapped in Studio has no
 * entry and falls back the same way; add a line here when you choose a new hero.
 */
export const HERO_POSITION: Record<string, string> = {
  // ── Products ────────────────────────────────────────────────────────────────
  "/images/products/traffic-patterns/traffic-patterns-87.jpg": "60% 0%", // veterans' heads and the maple leaf
  "/images/applications/crosswalks/crosswalks-114.png": "50% 45%", // TrafficPatternsXD: brick walkway, shelter above
  "/images/products/streetprint/streetprint-86.jpg": "50% 55%", // the gate stays centred on a phone
  "/images/products/streetbond/streetbond-19.jpg": "55% 40%", // red walkway, railing and cranes
  "/images/products/mmax/mmax-04.jpg": "55% 75%", // BUS ONLY legend; the tower shows on a phone
  "/images/applications/parks-paths/parks-paths-70.jpg": "50% 74%", // DecoMark: portrait photo, the medallion
  "/images/applications/traffic-calming/traffic-calming-03.jpg": "50% 70%", // DuraTherm: the yellow pattern
  "/images/applications/parks-paths/parks-paths-17.jpg": "25% 55%", // PreMark: bicycle symbol clear of the text
  "/images/products/airmark/airmark-04.jpg": "12% 28%", // control tower, hangar and holding lines
  "/images/products/durashield/durashield-11.jpg": "75% 92%", // the driveway; keeps the car's plate and the house number out
  "/images/products/streetbondsr/streetbondsr-02.jpg": "45% 70%", // the path junction; shelters show on a phone
  "/images/products/chipfill/chipfill-road-repair.webp": "50% 60%",
  "/images/products/aggrefill/aggrefill-02.jpg": "50% 50%",
  "/images/products/fast-patch/fastpatch-repaired.jpg": "50% 50%",

  // ── Applications ────────────────────────────────────────────────────────────
  "/images/applications/crosswalks/crosswalks-09.jpg": "50% 45%", // crosswalk with the buses behind it
  "/images/applications/bike-lanes/bike-lanes-01.jpg": "60% 4%", // the cyclist and the green box
  "/images/applications/bus-lanes/bus-lanes-41.jpg": "25% 60%", // the bus on the red lane
  "/images/products/streetprint/streetprint-25.jpg": "60% 75%", // Parking Lots: the red border and stalls
  "/images/applications/parks-paths/parks-paths-09.jpg": "40% 40%", // path, arrows and the water
  "/images/applications/playgrounds/playgrounds-01.jpg": "50% 60%",
  "/images/applications/community-branding/community-branding-17.jpg": "40% 52%", // the Geary Works lettering whole (was 62%: "GEARY WO…", 28 Sep QA)
  "/images/applications/residential-driveways/residential-driveways-21.jpg": "50% 32%", // Private Driveways: drive and the whole garage (28 Sep QA)
  "/images/products/streetbond/streetbond-67.png": "50% 60%", // Sport Courts
  "/images/applications/splash-pads/splash-pads-01.jpg": "50% 35%", // the umbrellas stay in (28 Sep QA)
  "/images/applications/commercial-spaces/commercial-spaces-55.jpg": "60% 40%", // Public Spaces: promenade, planters and the bird sculpture (28 Sep QA)
  "/images/applications/commercial-spaces/commercial-spaces-75.jpg": "50% 42%", // the crossing, and the Toronto Premium Outlets sign whole (28 Sep QA)
  "/images/applications/townhomes/townhomes-16.jpg": "50% 25%", // townhouses with their rooflines, the lane below (28 Sep QA)
  "/images/applications/residential-driveways/residential-driveways-18.jpg": "50% 55%", // lit pillars and the medallion
  "/images/applications/crosswalks/crosswalks-03.jpg": "40% 60%", // Pedestrian Safety: crosswalk and bike crossing
  "/images/applications/traffic-calming/traffic-calming-58.jpg": "50% 62%", // the roundabout and its chevron sign
  "/images/applications/airports/airports-08.jpg": "60% 0%", // plane and trucks; the marking shows on a phone
  "/images/applications/leed-urban-heat-island/leed-urban-heat-island-01.jpg": "50% 50%",
  "/images/applications/public-art/public-art-01.jpg": "50% 88%", // the artwork; at 70% a storefront's "CANNABIS" sign read in the top left at 1440 (28 Sep QA)
  "/images/applications/bike-lanes/bike-lanes-12.jpg": "85% 62%", // Regulatory Markings: ONLY BUS legend and bike lane
};

/**
 * Phone zoom, per photo (QA C4, 30 Sep 2026). On a 390 px phone the banner is
 * about 0.9:1 and a 4:3 photo shows its WHOLE height, sky included, with the
 * paving under the title: object-position cannot lift it, because nothing is
 * cropped vertically (the first value, the horizontal one, is all that moves
 * there). So on phones (under 640 px) these photos are scaled up around a
 * point near the surface, which pushes the sky out of the top. `origin` is a
 * CSS transform-origin; keep its y at or under 1 - 0.5/scale (75% at 2, 66% at 1.5,
 * 61% at 1.3), or the bottom of the photo lifts off the band. From sm up the
 * values are not applied. The application template reads this through
 * heroPhoneZoom().
 */
export const HERO_PHONE_ZOOM: Record<string, { scale: number; origin: string }> = {
  "/images/applications/public-art/public-art-01.jpg": { scale: 2, origin: "50% 75%" }, // the medallion up from under the title, the clouds and the lamp post out
  "/images/applications/traffic-calming/traffic-calming-58.jpg": { scale: 2, origin: "50% 75%" }, // the roundabout apron and its chevron sign; the sky was the top half
  "/images/applications/commercial-spaces/commercial-spaces-75.jpg": { scale: 1.5, origin: "50% 66%" }, // the brick crossing; the poles and sky out
  "/images/applications/commercial-spaces/commercial-spaces-55.jpg": { scale: 1.3, origin: "50% 61%" }, // Public Spaces: the promenade, the bird sculpture kept
};

/** The phone zoom for a hero photo, or undefined for the photos that need none. */
export function heroPhoneZoom(photo: { src: string; origin?: string }): { scale: number; origin: string } | undefined {
  return HERO_PHONE_ZOOM[photo.origin ?? photo.src];
}

/**
 * Hero colour, per photo. Every photo hero gets the site-wide `hero-pop` lift
 * (app/globals.css, HERO COLOUR). A few photos were already vivid and the lift
 * pushed them over (QA, 28 Sep 2026): StreetPrint's lawn went neon green and
 * its leaves magenta, the lit pillars on Residential Driveways glowed orange,
 * and StreetBondSR's peach coating read as orange. These get the lighter
 * `hero-pop-lite` instead. Keyed like HERO_POSITION, by the photo's /public
 * path (a Sanity photo's `origin`), so the setting follows the photo to
 * whichever page uses it. A photo not listed here gets `hero-pop`.
 */
export const HERO_POP_LITE: ReadonlySet<string> = new Set([
  "/images/products/streetprint/streetprint-86.jpg", // StreetPrint: the lawn and the autumn leaves
  "/images/products/streetbondsr/streetbondsr-02.jpg", // StreetBondSR: the peach coating stays peach
  "/images/applications/residential-driveways/residential-driveways-18.jpg", // Residential Driveways: the lit pillars at dusk
  "/images/applications/playgrounds/playgrounds-01.jpg", // Playgrounds: turquoise, orange and yellow markings
  "/images/products/streetbond/streetbond-67.png", // Sport Courts: the pink, orange and yellow court
]);

/** The colour class for a hero photo: `hero-pop`, or `hero-pop-lite` for the photos above. */
export function heroColourClass(photo: { src: string; origin?: string }): "hero-pop" | "hero-pop-lite" {
  return HERO_POP_LITE.has(photo.origin ?? photo.src) ? "hero-pop-lite" : "hero-pop";
}
