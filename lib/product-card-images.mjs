// The photograph on each /products index card — one line per system.
//
// TO SWAP A PHOTO: change `src` to any file under /public/images, push. The
// build (scripts/gen-card-images.mjs) crops it to 4:3 at `position`, writes
// 480 / 800 / 1200px WebP into /public/images/cards/, and the page picks the
// right size per screen. Nothing goes through /_next/image — this project ran
// out of Vercel image optimisation in Aug 2026 and answered 402 sitewide.
//
// `position` works like CSS object-position: "50% 75%" keeps the horizontal
// centre and slides the crop window three-quarters of the way down.
//
// Rules for a pick: a real HUB installation of THAT system (not a render,
// swatch, product can or stock), at least 1200px wide, and not a photo that is
// also filed under another product. Every pick below was looked at, not chosen
// from its filename. Alt text says what is in the frame and names a place only
// where the frame or the project records prove it.
//
// This is deliberately separate from productImages in lib/featured-images.ts,
// which feeds the product page heroes: a hero and a 4:3 card want different
// photographs.
//
// No entry for chipfill, aggrefill or fast-patch — the page renders them
// without a photo rather than stretch. AggreFill has nothing over 600px; the
// only ChipFill shot at size looks like supplier photography; the only Fast
// Patch shot carries "2014 Pavement Repair Products Co. - All Rights Reserved"
// in its EXIF. Add a line here when HUB has its own.

/** @type {Record<string, { src: string; position: string; alt: string }>} */
export const CARD_IMAGES = {
  "traffic-patterns-xd": {
    src: "/images/products/traffic-patterns-xd/traffic-patterns-xd-13.jpg",
    position: "50% 75%",
    alt: "Red brick-pattern TrafficPatternsXD crosswalk with white edge lines at Memorial Park, White Rock, BC",
  },
  "traffic-patterns": {
    src: "/images/products/traffic-patterns/traffic-patterns-05.jpg",
    position: "50% 55%",
    alt: "TrafficPatterns crosswalk carrying an Indigenous formline medallion",
  },
  premark: {
    src: "/images/products/premark/premark-04.jpg",
    position: "50% 55%",
    alt: "PreMark shared-lane legend with pedestrian, bicycle and car symbols",
  },
  duratherm: {
    src: "/images/products/duratherm/duratherm-33.jpg",
    position: "50% 70%",
    alt: "DuraTherm inlaid pattern crosswalk sitting flush with the road beside a wood-clad civic building",
  },
  decomark: {
    src: "/images/products/decomark/decomark-39.jpg",
    position: "50% 50%",
    alt: "Aerial view of a large DecoMark Indigenous-art medallion on a concrete plaza",
  },
  airmark: {
    src: "/images/products/airmark/airmark-04.jpg",
    position: "50% 65%",
    alt: "Yellow AirMark holding-position markings on an airport taxiway, control tower behind",
  },
  streetbond: {
    src: "/images/products/streetbond/streetbond-58.jpg",
    position: "50% 60%",
    alt: "Red and white StreetBond coated plaza leading to the Olympic Stadium tower, Montréal",
  },
  streetbondsr: {
    src: "/images/products/streetbondsr/streetbondsr-08.jpg",
    position: "40% 50%",
    alt: "Pale grey StreetBondSR solar-reflective coating on a parking lot",
  },
  mmax: {
    src: "/images/products/mmax/mmax-04.jpg",
    position: "35% 60%",
    alt: "Red MMAX bus-only lane in London, Ontario",
  },
  durashield: {
    src: "/images/applications/parking-lots/parking-lots-04.jpg",
    position: "50% 55%",
    alt: "Freshly coated DuraShield parking lot in front of a glass-fronted building",
  },
  streetprint: {
    src: "/images/products/streetprint/streetprint-73.jpg",
    position: "50% 60%",
    alt: "Red brick-pattern StreetPrint stamped asphalt on a roundabout apron",
  },
};
