/**
 * SITE_IMAGES — Central image registry for static slots.
 *
 * HOW TO SWAP IN REAL PHOTOS:
 * 1. Drop the photo into the correct /public/images/ subfolder
 * 2. Change the URL below from the Unsplash URL to the local path
 *    e.g. "https://images.unsplash.com/..." → "/images/hero/hero-bg.jpg"
 * 3. Save. The site updates instantly — no other code changes needed.
 *
 * For dynamic content (products, projects, applications) see:
 *   lib/products.ts → product.imageUrl
 *   lib/projects.ts → project.imageUrl
 *   lib/applications.ts → application.imageUrl
 */
export const SITE_IMAGES = {
  // ── Hero ──────────────────────────────────────────────────────────────
  hero_bg: "/images/hero/hero-bg.jpg",

  // ── About Page ────────────────────────────────────────────────────────
  about_team: "/images/applications/commercial-spaces/granville-island-installation-crew-01.jpg",
  about_story: "/images/applications/traffic-calming/roundabout-aerial-red-white-checkerboard-01.jpg",

  // ── Blog ──────────────────────────────────────────────────────────────
  blog_default: "/images/applications/bus-bike-lanes/red-bus-lane-brt-transit-station-01.jpg",

  // ── Lunch & Learn ─────────────────────────────────────────────────────
  lunch_learn: "/images/applications/commercial-spaces/little-italy-aerial-colourful-intersection-01.jpg",
} as const;

export type ImageKey = keyof typeof SITE_IMAGES;

/** Get a site image URL by key */
export function img(key: ImageKey): string {
  return SITE_IMAGES[key];
}
