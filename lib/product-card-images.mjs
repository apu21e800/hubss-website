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
// The repair family (chipfill, aggrefill, fast-patch) has cards with photos
// since 30 Sep 2026 (Vern: a missing image is a bug, "fix bugs like that").
// There is no HUB installation photo of these yet, so each shows its own
// product: ChipFill and AggreFill being poured into a pothole, the Fast Patch
// kit laid out. AggreFill's is 476px, the largest there is, so it stays soft
// on a 2x screen. Not fastpatch-repaired.jpg: its EXIF reads "2014 Pavement
// Repair Products Co. - All Rights Reserved". Swap in HUB's own when it has one.

/** @type {Record<string, { src: string; position: string; alt: string }>} */
export const CARD_IMAGES = {
  chipfill: {
    src: "/images/products/chipfill/chipfill-application.jpg",
    position: "50% 50%",
    alt: "ChipFill poured from its bag into a pothole",
  },
  aggrefill: {
    src: "/images/products/aggrefill/aggrefill-application.webp",
    position: "50% 70%",
    alt: "AggreFill poured from its bag into a pothole",
  },
  "fast-patch": {
    src: "/images/products/fast-patch/fastpatch-bucket.jpg",
    position: "50% 50%",
    alt: "A Fast Patch DPR kit laid out: bucket, component bags, gloves and instructions",
  },
  "traffic-patterns-xd": {
    src: "/images/products/traffic-patterns-xd/traffic-patterns-xd-13.jpg",
    position: "50% 75%",
    alt: "Red brick-pattern TrafficPatternsXD crosswalk with white edge lines at the White Rock Pier, BC",
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
