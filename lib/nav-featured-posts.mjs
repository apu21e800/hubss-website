// Curated Insights articles for the menus — the Insights mega menu (the first
// is its full-bleed cover), the "Latest from Insights" slot on the Products
// and Applications menus, and the phone drawer. `category` is the badge as the
// site prints it (lib/field-notes-taxonomy.ts, `badge`), and it must match
// the post's Type in Studio: on 25 Sep 2026 two of these four were wrong
// (a Guide labelled "Field Notes", a Case Study labelled "Project Profile").
// Check the post page's badge when you swap one in.
//
// Hardcoded for the client-component context; swap by hand when featuring
// different posts. It lives here rather than in Nav.tsx because
// scripts/gen-chrome-images.mjs reads it too: every `image` is baked into the
// menu's thumbnail sizes, and the first into the cover sizes, at build time.

/** @type {{ slug: string; title: string; category: string; image: string }[]} */
export const FEATURED_POSTS = [
  {
    slug: "best-crosswalks-canada",
    title: "Best crosswalks in Canada",
    category: "Article",
    image: "/images/blog/best-crosswalks-canada/featured.jpg",
  },
  {
    slug: "ubc-musqueam-crosswalk",
    title: "UBC × Musqueam — cultural identity in the street surface",
    category: "Case Study",
    image: "/images/blog/ubc-musqueam-crosswalk/featured.jpg",
  },
  {
    slug: "streetbondsr-solar-reflective-coatings",
    title: "StreetBondSR — cooler asphalt for hot cities",
    category: "Guide",
    image: "/images/blog/streetbondsr-solar-reflective-coatings/featured.jpg",
  },
  {
    slug: "transportation-infrastructure-guide",
    title: "Transportation infrastructure — the surface specifier's guide",
    category: "White Paper",
    image: "/images/blog/transportation-infrastructure-guide/featured.jpg",
  },
];
