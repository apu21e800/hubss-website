// The four product families, in the order the site presents them.
//
// One list, two readers: the Products mega menu (components/sections/Nav.tsx)
// and the /products index (app/products/page.tsx). They used to keep their own
// copies, and the index drifted — it called the third group "Stamped Asphalt &
// Concrete" while the menu said "Stamped Asphalt". Add, rename or reorder a
// family here and both change together.
//
// The photo-card era of the menu carried icon/tag/image/pillarNote per
// category. Those fields died with the cards; what remains is exactly what a
// directory needs: a label, the members, and at most one "see also"
// destination.
export type ProductCategory = {
  label: string;
  slugs: string[];
  secondary?: { label: string; href: string; meta?: string };
  /**
   * One sentence under the family's heading on /products. The print catalogue
   * never groups its systems into families, so there is no book copy to lift;
   * each intro is assembled only from lines the book (or, for Asphalt &
   * Concrete Repair, lib/products.ts) already states about the members. Sources are noted on
   * each one. Do not add a claim here that no member's page makes.
   */
  intro: string;
};

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    label: "Preformed Thermoplastics",
    slugs: ["traffic-patterns-xd", "traffic-patterns", "premark", "duratherm", "decomark", "airmark"],
    // "Heat-applied" is true of every member: heat-fused (catalogue p8, p16;
    // DecoMark and DuraTherm specs), heat-applied (PreMark spec), heat
    // application (AirMark, lib/products.ts). Airfield markings are AirMark's
    // own line in lib/products.ts; the book does not cover AirMark.
    intro:
      "Thermoplastic, heat-applied to the pavement — decorative crosswalks, custom graphics, regulatory symbols, flush inlaid markings and airfield markings.",
  },
  {
    label: "Coatings",
    slugs: ["streetbond", "streetbondsr", "mmax", "durashield"],
    // Each clause is a member's own catalogue line: "Performance coatings
    // that add colour" (StreetBond, p8 — the printed spread retitled it "The
    // colour.", so the older "colour system" wording is not used), "Solar
    // reflective coating." (SR title), "transit lanes and area markings"
    // (MMAX, p8), "Pavement maintenance coating." (DuraShield title; its spec:
    // "Preserves and protects asphalt").
    intro:
      "Colour, reflectance and protection for pavement — StreetBond performance coatings, solar-reflective StreetBondSR, MMA lane and area markings, and DuraShield maintenance coating.",
  },
  {
    label: "Stamped Asphalt",
    slugs: ["streetprint"],
    secondary: { label: "Pattern gallery", href: "/patterns", meta: "16 stamping templates" },
    // Catalogue p8 ("The original stamped asphalt system."), p19 and the
    // StreetPrint spread: in-place stamping + StreetBond coating, new or
    // existing asphalt, flush with "nothing for a plow blade to catch".
    intro:
      "The original stamped asphalt system. Patterns are stamped into new or existing asphalt and coloured with StreetBond — flush, with nothing for a plow blade to catch.",
  },
  {
    // "Asphalt & Concrete Repair" (Doug, 25 Sep 2026): all three members list
    // "Substrate: asphalt and concrete" in their specs, and their eyebrow
    // already said so. The old "Asphalt Repair" undersold two of the three.
    label: "Asphalt & Concrete Repair",
    slugs: ["chipfill", "aggrefill", "fast-patch"],
    // Not in the print catalogue. Every clause is stated by all three members
    // in lib/products.ts: permanent repair, asphalt and concrete substrates,
    // year-round deployment. Deliberately NOT "no heating" (ChipFill uses a
    // torch), "no compaction" (Fast Patch is compacted), a single cure time
    // (they differ) or "cold-mix" (ChipFill is heat-activated).
    intro: "Permanent pothole and pavement repair for asphalt and concrete, deployable year-round.",
  },
];
