/**
 * The application groups, shared by the menus (components/sections/MegaMenus.tsx,
 * a client module) and the /applications page (a server page, 27 Oct 2026),
 * so both name and order them one way.
 *
 * Four groups a specifier would recognise, each named for the place, not the
 * buyer (28 Sep 2026). `note` is the menu's caption under the group's
 * picture; `intro` is the sentence under the group's heading on
 * /applications (28 Oct 2026, the independent review: the note with a full
 * stop read as a fragment beside /products' family sentences). Both are for
 * Doug to approve. Residential lists one driveways page (30 Sep 2026):
 * /applications/private-driveways was merged into residential-driveways.
 */
export const APPLICATION_GROUPS = [
  {
    label: "Streets & Safety",
    // "Crosswalks", never "crossings", for the marking (docs/GLOSSARY.md);
    // the menu printed "Crossings" until 27 Oct 2026.
    note: "Crosswalks, lanes and calming",
    intro: "Crosswalks, bike and bus lanes, traffic calming and regulatory markings, where drivers, cyclists and people on foot share the road.",
    slugs: ["crosswalks", "bike-lanes", "bus-lanes", "pedestrian-safety", "traffic-calming", "regulatory-markings"],
  },
  {
    label: "Parks & Public Spaces",
    note: "Paths, plazas, play and art",
    intro: "Park paths, plazas, playgrounds and splash pads, with public art and community branding on the surfaces a neighbourhood uses every day.",
    slugs: ["parks-paths", "public-spaces", "playgrounds", "splash-pads", "public-art", "community-branding"],
  },
  {
    label: "Commercial & Sustainability",
    note: "Lots, courts, airports and cool pavement",
    intro: "Parking lots and retail entries, sport courts, airfield markings, and solar-reflective pavement for projects working toward LEED.",
    slugs: ["parking-lots", "commercial-spaces", "sport-courts", "airports", "leed-urban-heat-island"],
  },
  {
    label: "Residential",
    note: "Driveways and townhome streets",
    intro: "Stamped and coloured asphalt for driveways, and for the entry courts and shared lanes of townhome and strata developments.",
    slugs: ["residential-driveways", "townhomes"],
  },
];

export type ApplicationGroup = (typeof APPLICATION_GROUPS)[number];

/** The group's anchor on /applications: "Streets & Safety" → "streets-and-safety". */
export function groupId(label: string): string {
  return label.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
