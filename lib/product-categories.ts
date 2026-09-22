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
};

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    label: "Preformed Thermoplastics",
    slugs: ["traffic-patterns-xd", "traffic-patterns", "premark", "duratherm", "decomark", "airmark"],
  },
  {
    label: "Coatings",
    slugs: ["streetbond", "streetbondsr", "mmax", "durashield"],
  },
  {
    label: "Stamped Asphalt",
    slugs: ["streetprint"],
    secondary: { label: "Pattern gallery", href: "/patterns", meta: "16 stamping templates" },
  },
  {
    label: "Asphalt Repair",
    slugs: ["chipfill", "aggrefill", "fast-patch"],
  },
];
