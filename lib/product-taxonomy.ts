/**
 * Product taxonomy — single source of truth.
 * Technology-based grouping used across mega menu, products page, and product detail pages.
 * Organized by how engineers and specifiers think, not by use-case.
 */

export const PRODUCT_TAXONOMY = [
  {
    label: "Preformed Thermoplastics",
    desc: "Factory-manufactured, heat-fused. Regulatory, decorative, and custom-graphic.",
    slugs: ["traffic-patterns-xd", "traffic-patterns", "premark", "duratherm", "decomark", "airmark"],
  },
  {
    label: "Coatings",
    desc: "Liquid-applied colour bonded chemically to asphalt and concrete.",
    slugs: ["streetbond", "streetbondsr", "mmax", "durashield"],
  },
  {
    label: "Stamped Asphalt",
    desc: "In-place stamping process that transforms existing asphalt into decorative hardscape.",
    slugs: ["streetprint"],
  },
  {
    label: "Asphalt Repair",
    desc: "Cold-mix and permanent repair compounds for potholes, utility cuts, and surface defects.",
    slugs: ["chipfill", "aggrefill", "fast-patch"],
  },
] as const;

/** Returns the taxonomy family label for a given product slug. */
export function getProductFamily(slug: string): string {
  for (const group of PRODUCT_TAXONOMY) {
    if ((group.slugs as readonly string[]).includes(slug)) {
      return group.label;
    }
  }
  return "Other";
}
