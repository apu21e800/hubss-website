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
  /**
   * `meta` prints on the /products tile; `menuLine` is the line under the
   * label in the Products menu and the phone drawer (see PRODUCT_MENU_LINES).
   */
  secondary?: { label: string; href: string; meta?: string; menuLine?: string };
  /**
   * One sentence under the family's heading on /products. The print catalogue
   * never groups its systems into families, so there is no book copy to lift;
   * each intro is assembled only from lines the book (or, for Asphalt &
   * Concrete Repair, lib/products.ts) already states about the members. Sources are noted on
   * each one. Do not add a claim here that no member's page makes.
   */
  intro: string;
  /**
   * The menu's four-word version of `intro`, under the family name in the
   * phone drawer's closed rows (Vern, 26 Sep 2026: names alone read as a
   * directory listing; a family name like "Preformed Thermoplastics" earns one
   * plain line saying what the family does). Same sources as `intro`; no claim
   * that isn't already in it. Since 28 Sep the desktop Products panel prints a
   * line under each product instead (PRODUCT_MENU_LINES), so it leaves this
   * out rather than say "repair" five times in one column.
   */
  menuNote: string;
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
      "Thermoplastic, heat-applied to the pavement: decorative crosswalks, custom graphics, regulatory symbols, flush inlaid markings and airfield markings.",
    menuNote: "Heat-applied markings and graphics",
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
      "Colour, reflectance and protection for pavement: StreetBond performance coatings, solar-reflective StreetBondSR, MMA lane and area markings, and DuraShield maintenance coating.",
    menuNote: "Colour, reflectance and protection",
  },
  {
    label: "Stamped Asphalt",
    slugs: ["streetprint"],
    // No count in the meta (Doug's round, 25 Sep 2026): the gallery is named, not measured.
    // menuLine: /patterns calls itself "StreetPrint templates" and its
    // pieces "stamping templates".
    secondary: { label: "Pattern gallery", href: "/patterns", menuLine: "StreetPrint stamping templates" },
    // Catalogue p8 ("The original stamped asphalt system."), p19 and the
    // StreetPrint spread: in-place stamping + StreetBond coating, new or
    // existing asphalt, flush with "nothing for a plow blade to catch".
    intro:
      "The original stamped asphalt system. Patterns are stamped into new or existing asphalt and coloured with StreetBond. The surface stays flush, with nothing for a plow blade to catch.",
    menuNote: "Patterns stamped into asphalt",
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
    menuNote: "Permanent pothole and pavement repair",
  },
];

/**
 * The line under each product's name in the Products menu and the phone
 * drawer (Vern, 28 Sep 2026: "the Products mega menu should have a short
 * descriptor under each product; we stripped the last version a bit too
 * much"). A brand name like MMAX tells a specifier nothing on its own; one
 * plain line says what it is. Every line is the printed Idea Book's own words
 * (lib/product-catalogue.ts: the spread's title or subhead, or the book's
 * systems index, SYSTEMS_INDEX) or, for the four systems the book does not
 * cover, the product's shortDesc in lib/products.ts, shortened and never
 * added to. Sentence case, about 40 characters at most so none wraps in a
 * menu column at 1440. Sanity does not override these: they are menu labels,
 * not product copy.
 */
export const PRODUCT_MENU_LINES: Record<string, string> = {
  // Book subhead: "Aggregate-reinforced, preformed thermoplastic."
  "traffic-patterns-xd": "Aggregate-reinforced thermoplastic",
  // Book title "Preformed thermoplastic." and subhead "You design it, we
  // build it"; lib/products.ts: "factory-made to your design".
  "traffic-patterns": "Preformed thermoplastic to your design",
  // Book title: "Road marking symbols."
  premark: "Road marking symbols",
  // Book systems index: "Inlaid, flush mounted thermoplastic markings".
  duratherm: "Inlaid, flush-mounted thermoplastic",
  // Book title "Custom graphics." and subhead "Community identity. Public art."
  decomark: "Custom graphics and public art",
  // Not in the book. shortDesc: "Preformed thermoplastic for non-runway airfield markings."
  airmark: "Non-runway airfield markings",
  // Book systems index: "Performance coatings that add colour".
  streetbond: "Coloured pavement coating",
  // Book title: "Solar reflective coating."
  streetbondsr: "Solar-reflective coating",
  // Book systems index: "Industry leading MMA, transit lanes and area markings".
  mmax: "MMA lane and area markings",
  // Book title: "Pavement maintenance coating."
  durashield: "Pavement maintenance coating",
  // Book systems index: "The original stamped asphalt system."
  streetprint: "The original stamped asphalt system",
  // Not in the book. shortDesc: "Heat-activated preformed material for permanent pothole repair."
  chipfill: "Heat-activated pothole repair",
  // Not in the book. shortDesc: "Pre-coated aggregate filler for larger potholes."
  aggrefill: "Aggregate filler for larger potholes",
  // Not in the book. shortDesc: "Polymer-blend repair for potholes, spalls, and utility cuts."
  "fast-patch": "Polymer-blend pothole repair",
};
