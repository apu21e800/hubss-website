// Curated Field Notes for the menus — the Field Notes mega menu (the first is
// its full-bleed cover), the "From the field notes" slot on the Products and
// Applications menus, and the phone drawer.
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
    category: "Field Notes",
    image: "/images/blog/best-crosswalks-canada/featured.jpg",
  },
  {
    slug: "ubc-musqueam-crosswalk",
    title: "UBC × Musqueam — cultural identity in the street surface",
    category: "Project Profile",
    image: "/images/blog/ubc-musqueam-crosswalk/featured.jpg",
  },
  {
    slug: "streetbondsr-solar-reflective-coatings",
    title: "StreetBondSR — cooler asphalt for hot cities",
    category: "Field Notes",
    image: "/images/blog/streetbondsr-solar-reflective-coatings/featured.jpg",
  },
  {
    slug: "transportation-infrastructure-guide",
    title: "Transportation infrastructure — the surface specifier's guide",
    category: "White Paper",
    image: "/images/blog/transportation-infrastructure-guide/featured.jpg",
  },
];
