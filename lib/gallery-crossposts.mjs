/**
 * Cross-posted images — one photograph, several galleries.
 *
 * The folder IS the gallery (lib/asset-scan.ts + docs/IMAGE-WORKFLOW.md), and
 * that covers most of the site. But a photo of an AirMark taxiway marking is
 * genuinely an AirMark photo AND an Airports photo, and a file can only live
 * in one folder. This is where that gets said out loud.
 *
 * NOTHING HERE IS INVENTED. All 259 entries were recovered from the hand
 * curation that already existed in Sanity, and every single path resolves to a
 * file already on disk. This file is that editorial judgement written down so
 * a folder-driven build cannot quietly lose it.
 *
 * FOUR GALLERIES HAVE NO FOLDER OF THEIR OWN and are built entirely from
 * cross-posts — pedestrian-safety, private-driveways, public-art and
 * regulatory-markings. Before this file existed each of them fell back to a
 * NEIGHBOUR'S folder, so /applications/private-driveways served the exact same
 * 44 photos as /applications/residential-driveways, and pedestrian-safety was
 * a pixel-for-pixel clone of crosswalks. Give any of them a real folder later
 * and the folder wins automatically; delete its block here when you do.
 *
 * TO ADD A CROSS-POST
 *   Find the gallery key, add the image's real path. Done. The file stays in
 *   exactly ONE folder on disk, so replacing it updates every gallery at once.
 *
 * Cross-posts render AFTER the gallery's own folder images, de-duplicated. A
 * path pointing at a missing file is dropped with a build warning rather than
 * shipped as a broken image. Read at build time by
 * scripts/gen-gallery-manifest.mjs; never imported by the app.
 */

export const CROSSPOSTS = {
  // 14 from 14x airmark
  "images/applications/airports": [
    "/images/products/airmark/airmark-01.jpg",
    "/images/products/airmark/airmark-02.jpg",
    "/images/products/airmark/airmark-04.jpg",
    "/images/products/airmark/airmark-05.jpg",
    "/images/products/airmark/airmark-06.jpg",
    "/images/products/airmark/airmark-07.jpg",
    "/images/products/airmark/airmark-15.jpg",
    "/images/products/airmark/airmark-16.jpg",
    "/images/products/airmark/airmark-17.jpg",
    "/images/products/airmark/airmark-18.jpg",
    "/images/products/airmark/airmark-19.jpg",
    "/images/products/airmark/airmark-20.jpg",
    "/images/products/airmark/airmark-21.jpg",
    "/images/products/airmark/airmark-22.jpg"
  ],

  // 2 from 2x mmax
  "images/applications/bike-lanes": [
    "/images/products/mmax/mmax-07.jpg",
    "/images/products/mmax/mmax-10.jpg"
  ],

  // 3 from 2x mmax, 1x bike-lanes
  "images/applications/bus-lanes": [
    "/images/applications/bike-lanes/bike-lanes-12.jpg",
    "/images/products/mmax/mmax-05.jpg",
    "/images/products/mmax/mmax-06.jpg"
  ],

  // 13 from 11x parking-lots, 1x durashield, 1x duratherm
  "images/applications/commercial-spaces": [
    "/images/applications/parking-lots/parking-lots-02.jpg",
    "/images/applications/parking-lots/parking-lots-16.jpg",
    "/images/applications/parking-lots/parking-lots-20.jpg",
    "/images/applications/parking-lots/parking-lots-23.jpg",
    "/images/applications/parking-lots/parking-lots-35.jpg",
    "/images/applications/parking-lots/parking-lots-37.jpg",
    "/images/applications/parking-lots/parking-lots-40.jpg",
    "/images/applications/parking-lots/parking-lots-43.jpg",
    "/images/applications/parking-lots/parking-lots-45.jpg",
    "/images/applications/parking-lots/parking-lots-46.jpg",
    "/images/applications/parking-lots/parking-lots-58.jpg",
    "/images/products/durashield/durashield-08.jpg",
    "/images/products/duratherm/duratherm-26.jpg"
  ],

  // 6 from 6x traffic-patterns-xd
  "images/applications/crosswalks": [
    "/images/products/traffic-patterns-xd/traffic-patterns-xd-103.jpg",
    "/images/products/traffic-patterns-xd/traffic-patterns-xd-130.jpg",
    "/images/products/traffic-patterns-xd/traffic-patterns-xd-139.jpg",
    "/images/products/traffic-patterns-xd/traffic-patterns-xd-85.jpg",
    "/images/products/traffic-patterns-xd/traffic-patterns-xd-91.jpg",
    "/images/products/traffic-patterns-xd/traffic-patterns-xd-97.jpg"
  ],

  // 5 from 1x public-spaces, 1x residential-driveways, 1x traffic-calming, 1x airmark, 1x duratherm
  "images/applications/parks-paths": [
    "/images/applications/public-spaces/public-spaces-49.jpg",
    "/images/applications/residential-driveways/residential-driveways-41.jpg",
    "/images/applications/traffic-calming/traffic-calming-45.jpg",
    "/images/products/airmark/airmark-02.jpg",
    "/images/products/duratherm/duratherm-14.jpg"
  ],

  // 48 from 42x crosswalks, 6x traffic-patterns-xd
  "images/applications/pedestrian-safety": [
    "/images/applications/crosswalks/crosswalks-01.jpg",
    "/images/applications/crosswalks/crosswalks-03.jpg",
    "/images/applications/crosswalks/crosswalks-06.jpg",
    "/images/applications/crosswalks/crosswalks-08.jpg",
    "/images/applications/crosswalks/crosswalks-100.jpg",
    "/images/applications/crosswalks/crosswalks-102.jpg",
    "/images/applications/crosswalks/crosswalks-105.jpg",
    "/images/applications/crosswalks/crosswalks-107.jpg",
    "/images/applications/crosswalks/crosswalks-11.jpg",
    "/images/applications/crosswalks/crosswalks-110.jpg",
    "/images/applications/crosswalks/crosswalks-115.png",
    "/images/applications/crosswalks/crosswalks-117.jpg",
    "/images/applications/crosswalks/crosswalks-122.jpg",
    "/images/applications/crosswalks/crosswalks-13.jpg",
    "/images/applications/crosswalks/crosswalks-16.jpg",
    "/images/applications/crosswalks/crosswalks-18.jpg",
    "/images/applications/crosswalks/crosswalks-21.jpg",
    "/images/applications/crosswalks/crosswalks-23.jpg",
    "/images/applications/crosswalks/crosswalks-26.jpg",
    "/images/applications/crosswalks/crosswalks-28.jpg",
    "/images/applications/crosswalks/crosswalks-31.jpg",
    "/images/applications/crosswalks/crosswalks-33.jpg",
    "/images/applications/crosswalks/crosswalks-36.jpg",
    "/images/applications/crosswalks/crosswalks-38.jpg",
    "/images/applications/crosswalks/crosswalks-43.jpg",
    "/images/applications/crosswalks/crosswalks-45.jpg",
    "/images/applications/crosswalks/crosswalks-48.jpg",
    "/images/applications/crosswalks/crosswalks-53.jpg",
    "/images/applications/crosswalks/crosswalks-55.jpg",
    "/images/applications/crosswalks/crosswalks-58.jpg",
    "/images/applications/crosswalks/crosswalks-60.jpg",
    "/images/applications/crosswalks/crosswalks-63.jpg",
    "/images/applications/crosswalks/crosswalks-65.jpg",
    "/images/applications/crosswalks/crosswalks-68.jpg",
    "/images/applications/crosswalks/crosswalks-70.jpg",
    "/images/applications/crosswalks/crosswalks-73.jpg",
    "/images/applications/crosswalks/crosswalks-75.jpg",
    "/images/applications/crosswalks/crosswalks-78.jpg",
    "/images/applications/crosswalks/crosswalks-83.jpg",
    "/images/applications/crosswalks/crosswalks-85.jpg",
    "/images/applications/crosswalks/crosswalks-92.jpg",
    "/images/applications/crosswalks/crosswalks-95.jpg",
    "/images/products/traffic-patterns-xd/traffic-patterns-xd-103.jpg",
    "/images/products/traffic-patterns-xd/traffic-patterns-xd-130.jpg",
    "/images/products/traffic-patterns-xd/traffic-patterns-xd-139.jpg",
    "/images/products/traffic-patterns-xd/traffic-patterns-xd-85.jpg",
    "/images/products/traffic-patterns-xd/traffic-patterns-xd-91.jpg",
    "/images/products/traffic-patterns-xd/traffic-patterns-xd-97.jpg"
  ],

  // 1 from 1x streetprint
  "images/applications/playgrounds": [
    "/images/products/streetprint/streetprint-53.jpg"
  ],

  // 41 from 37x residential-driveways, 4x townhomes
  "images/applications/private-driveways": [
    "/images/applications/residential-driveways/residential-driveways-01.jpg",
    "/images/applications/residential-driveways/residential-driveways-02.jpg",
    "/images/applications/residential-driveways/residential-driveways-03.jpg",
    "/images/applications/residential-driveways/residential-driveways-06.jpg",
    "/images/applications/residential-driveways/residential-driveways-07.jpg",
    "/images/applications/residential-driveways/residential-driveways-08.jpg",
    "/images/applications/residential-driveways/residential-driveways-09.jpg",
    "/images/applications/residential-driveways/residential-driveways-10.jpg",
    "/images/applications/residential-driveways/residential-driveways-11.jpg",
    "/images/applications/residential-driveways/residential-driveways-12.jpg",
    "/images/applications/residential-driveways/residential-driveways-13.jpg",
    "/images/applications/residential-driveways/residential-driveways-14.jpg",
    "/images/applications/residential-driveways/residential-driveways-15.jpg",
    "/images/applications/residential-driveways/residential-driveways-16.jpg",
    "/images/applications/residential-driveways/residential-driveways-17.jpg",
    "/images/applications/residential-driveways/residential-driveways-18.jpg",
    "/images/applications/residential-driveways/residential-driveways-19.jpg",
    "/images/applications/residential-driveways/residential-driveways-20.jpg",
    "/images/applications/residential-driveways/residential-driveways-21.jpg",
    "/images/applications/residential-driveways/residential-driveways-22.jpg",
    "/images/applications/residential-driveways/residential-driveways-23.jpg",
    "/images/applications/residential-driveways/residential-driveways-24.jpg",
    "/images/applications/residential-driveways/residential-driveways-26.jpg",
    "/images/applications/residential-driveways/residential-driveways-27.jpg",
    "/images/applications/residential-driveways/residential-driveways-28.jpg",
    "/images/applications/residential-driveways/residential-driveways-29.jpg",
    "/images/applications/residential-driveways/residential-driveways-34.jpg",
    "/images/applications/residential-driveways/residential-driveways-35.jpg",
    "/images/applications/residential-driveways/residential-driveways-36.jpg",
    "/images/applications/residential-driveways/residential-driveways-37.jpg",
    "/images/applications/residential-driveways/residential-driveways-38.jpg",
    "/images/applications/residential-driveways/residential-driveways-39.jpg",
    "/images/applications/residential-driveways/residential-driveways-40.jpg",
    "/images/applications/residential-driveways/residential-driveways-41.jpg",
    "/images/applications/residential-driveways/residential-driveways-42.jpg",
    "/images/applications/residential-driveways/residential-driveways-43.jpg",
    "/images/applications/residential-driveways/residential-driveways-44.jpg",
    "/images/applications/townhomes/townhomes-03.jpg",
    "/images/applications/townhomes/townhomes-12.jpg",
    "/images/applications/townhomes/townhomes-13.jpg",
    "/images/applications/townhomes/townhomes-14.jpg"
  ],

  // 14 from 14x community-branding
  "images/applications/public-art": [
    "/images/applications/community-branding/community-branding-01.jpg",
    "/images/applications/community-branding/community-branding-02.jpg",
    "/images/applications/community-branding/community-branding-03.jpg",
    "/images/applications/community-branding/community-branding-04.jpg",
    "/images/applications/community-branding/community-branding-05.jpg",
    "/images/applications/community-branding/community-branding-06.jpg",
    "/images/applications/community-branding/community-branding-07.jpg",
    "/images/applications/community-branding/community-branding-08.jpg",
    "/images/applications/community-branding/community-branding-09.jpg",
    "/images/applications/community-branding/community-branding-10.jpg",
    "/images/applications/community-branding/community-branding-11.jpg",
    "/images/applications/community-branding/community-branding-12.jpg",
    "/images/applications/community-branding/community-branding-13.jpg",
    "/images/applications/community-branding/community-branding-14.jpg"
  ],

  // 4 from 2x traffic-calming, 2x streetprint
  "images/applications/public-spaces": [
    "/images/applications/traffic-calming/traffic-calming-38.jpg",
    "/images/applications/traffic-calming/traffic-calming-48.jpg",
    "/images/products/streetprint/streetprint-03.jpg",
    "/images/products/streetprint/streetprint-53.jpg"
  ],

  // 50 from 48x traffic-calming, 1x commercial-spaces, 1x townhomes
  "images/applications/regulatory-markings": [
    "/images/applications/commercial-spaces/commercial-spaces-87.jpg",
    "/images/applications/townhomes/townhomes-12.jpg",
    "/images/applications/traffic-calming/traffic-calming-01.jpg",
    "/images/applications/traffic-calming/traffic-calming-02.jpg",
    "/images/applications/traffic-calming/traffic-calming-03.jpg",
    "/images/applications/traffic-calming/traffic-calming-04.jpg",
    "/images/applications/traffic-calming/traffic-calming-05.jpg",
    "/images/applications/traffic-calming/traffic-calming-06.jpg",
    "/images/applications/traffic-calming/traffic-calming-07.jpg",
    "/images/applications/traffic-calming/traffic-calming-08.jpg",
    "/images/applications/traffic-calming/traffic-calming-09.jpg",
    "/images/applications/traffic-calming/traffic-calming-11.jpg",
    "/images/applications/traffic-calming/traffic-calming-12.jpg",
    "/images/applications/traffic-calming/traffic-calming-13.jpg",
    "/images/applications/traffic-calming/traffic-calming-14.jpg",
    "/images/applications/traffic-calming/traffic-calming-15.jpg",
    "/images/applications/traffic-calming/traffic-calming-16.jpg",
    "/images/applications/traffic-calming/traffic-calming-17.jpg",
    "/images/applications/traffic-calming/traffic-calming-18.jpg",
    "/images/applications/traffic-calming/traffic-calming-19.jpg",
    "/images/applications/traffic-calming/traffic-calming-21.jpg",
    "/images/applications/traffic-calming/traffic-calming-22.jpg",
    "/images/applications/traffic-calming/traffic-calming-23.jpg",
    "/images/applications/traffic-calming/traffic-calming-24.jpg",
    "/images/applications/traffic-calming/traffic-calming-25.jpg",
    "/images/applications/traffic-calming/traffic-calming-26.jpg",
    "/images/applications/traffic-calming/traffic-calming-27.jpg",
    "/images/applications/traffic-calming/traffic-calming-28.jpg",
    "/images/applications/traffic-calming/traffic-calming-29.jpg",
    "/images/applications/traffic-calming/traffic-calming-31.jpg",
    "/images/applications/traffic-calming/traffic-calming-32.jpg",
    "/images/applications/traffic-calming/traffic-calming-34.jpg",
    "/images/applications/traffic-calming/traffic-calming-35.jpg",
    "/images/applications/traffic-calming/traffic-calming-36.jpg",
    "/images/applications/traffic-calming/traffic-calming-37.jpg",
    "/images/applications/traffic-calming/traffic-calming-38.jpg",
    "/images/applications/traffic-calming/traffic-calming-39.jpg",
    "/images/applications/traffic-calming/traffic-calming-41.jpg",
    "/images/applications/traffic-calming/traffic-calming-42.jpg",
    "/images/applications/traffic-calming/traffic-calming-43.png",
    "/images/applications/traffic-calming/traffic-calming-44.jpg",
    "/images/applications/traffic-calming/traffic-calming-45.jpg",
    "/images/applications/traffic-calming/traffic-calming-47.jpg",
    "/images/applications/traffic-calming/traffic-calming-48.jpg",
    "/images/applications/traffic-calming/traffic-calming-49.jpg",
    "/images/applications/traffic-calming/traffic-calming-51.jpg",
    "/images/applications/traffic-calming/traffic-calming-52.jpg",
    "/images/applications/traffic-calming/traffic-calming-53.jpg",
    "/images/applications/traffic-calming/traffic-calming-54.jpg",
    "/images/applications/traffic-calming/traffic-calming-55.jpg"
  ],

  // 4 from 4x townhomes
  "images/applications/residential-driveways": [
    "/images/applications/townhomes/townhomes-03.jpg",
    "/images/applications/townhomes/townhomes-12.jpg",
    "/images/applications/townhomes/townhomes-13.jpg",
    "/images/applications/townhomes/townhomes-14.jpg"
  ],

  // 2 from 1x commercial-spaces, 1x townhomes
  "images/applications/traffic-calming": [
    "/images/applications/commercial-spaces/commercial-spaces-87.jpg",
    "/images/applications/townhomes/townhomes-12.jpg"
  ],

  // 3 from 3x chipfill
  "images/products/aggrefill": [
    "/images/products/chipfill/chipfill-aggrefill-bags.jpg",
    "/images/products/chipfill/chipfill-application.jpg",
    "/images/products/chipfill/chipfill-road-repair.webp"
  ],

  // 1 from 1x aggrefill
  "images/products/chipfill": [
    "/images/products/aggrefill/aggrefill-application.webp"
  ],

  // 10 from 4x playgrounds, 3x parks-paths, 1x bike-lanes, 1x crosswalks, 1x sport-courts
  "images/products/decomark": [
    "/images/applications/bike-lanes/bike-lanes-03.jpg",
    "/images/applications/crosswalks/crosswalks-31.jpg",
    "/images/applications/parks-paths/parks-paths-31.jpg",
    "/images/applications/parks-paths/parks-paths-55.jpg",
    "/images/applications/parks-paths/parks-paths-79.jpg",
    "/images/applications/playgrounds/playgrounds-19.jpg",
    "/images/applications/playgrounds/playgrounds-34.jpg",
    "/images/applications/playgrounds/playgrounds-38.jpg",
    "/images/applications/playgrounds/playgrounds-46.jpg",
    "/images/applications/sport-courts/sport-courts-16.jpg"
  ],

  // 6 from 4x streetbondsr, 1x splash-pads, 1x sport-courts
  "images/products/streetbond": [
    "/images/applications/splash-pads/splash-pads-19.jpg",
    "/images/applications/sport-courts/sport-courts-14.jpg",
    "/images/products/streetbondsr/streetbondsr-01.png",
    "/images/products/streetbondsr/streetbondsr-02.jpg",
    "/images/products/streetbondsr/streetbondsr-05.jpg",
    "/images/products/streetbondsr/streetbondsr-07.jpg"
  ],

  // 14 from 5x residential-driveways, 5x traffic-calming, 4x townhomes
  "images/products/streetprint": [
    "/images/applications/residential-driveways/residential-driveways-29.jpg",
    "/images/applications/residential-driveways/residential-driveways-34.jpg",
    "/images/applications/residential-driveways/residential-driveways-41.jpg",
    "/images/applications/residential-driveways/residential-driveways-43.jpg",
    "/images/applications/residential-driveways/residential-driveways-44.jpg",
    "/images/applications/townhomes/townhomes-03.jpg",
    "/images/applications/townhomes/townhomes-09.jpg",
    "/images/applications/townhomes/townhomes-14.jpg",
    "/images/applications/townhomes/townhomes-17.jpg",
    "/images/applications/traffic-calming/traffic-calming-37.jpg",
    "/images/applications/traffic-calming/traffic-calming-38.jpg",
    "/images/applications/traffic-calming/traffic-calming-39.jpg",
    "/images/applications/traffic-calming/traffic-calming-44.jpg",
    "/images/applications/traffic-calming/traffic-calming-48.jpg"
  ],

  // 16 from 7x decomark, 3x crosswalks, 3x parks-paths, 1x commercial-spaces, 1x playgrounds, 1x sport-courts
  "images/products/traffic-patterns": [
    "/images/applications/commercial-spaces/commercial-spaces-22.jpg",
    "/images/applications/crosswalks/crosswalks-26.jpg",
    "/images/applications/crosswalks/crosswalks-31.jpg",
    "/images/applications/crosswalks/crosswalks-33.jpg",
    "/images/applications/parks-paths/parks-paths-124.jpg",
    "/images/applications/parks-paths/parks-paths-43.jpg",
    "/images/applications/parks-paths/parks-paths-70.jpg",
    "/images/applications/playgrounds/playgrounds-38.jpg",
    "/images/applications/sport-courts/sport-courts-16.jpg",
    "/images/products/decomark/decomark-16.jpg",
    "/images/products/decomark/decomark-19.jpg",
    "/images/products/decomark/decomark-45.jpg",
    "/images/products/decomark/decomark-60.jpg",
    "/images/products/decomark/decomark-61.jpg",
    "/images/products/decomark/decomark-62.jpg",
    "/images/products/decomark/decomark-69.jpg"
  ],

  // 2 from 1x traffic-calming, 1x streetprint
  "images/products/traffic-patterns-xd": [
    "/images/applications/traffic-calming/traffic-calming-07.jpg",
    "/images/products/streetprint/streetprint-43.jpg"
  ],
};
