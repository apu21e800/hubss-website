/**
 * Gallery curation — the editorial layer over "the folder is the gallery".
 *
 * WHY: the folder model (lib/asset-scan.ts) shows every file in filename order,
 * and filename order is upload order, not editorial order. On a product page
 * the first photo is a full-width hero tile and the next six are the only
 * ones visible without clicking "Load more", so the first seven decide the
 * page. A gallery whose first seven were six angles of one Vaughan crosswalk
 * plus a Walmart sign was doing HUB no favours.
 *
 * Verdicts come from the Sep 2026 visual sweep — every one of the 1,394
 * gallery photos was looked at on labelled contact sheets. Per gallery:
 *
 *   lead  — ORDERED basenames to open the gallery with. #1 is the 16:9 hero
 *           tile (a strong landscape); #2–#7 the visible grid, chosen for
 *           variety: no two shots of the same scene up front.
 *   hide  — never shown: off-subject for this gallery (a splash pad in
 *           bus-lanes), not a field photograph, stored sideways, or a privacy
 *           problem (a licence plate or a face as the main subject). The
 *           file stays on disk; delete the line to re-admit it. Since the
 *           28 Sep 2026 photo pass also: scenes photographed in the US (EXIF
 *           GPS, a US plate or flag, US-only signage), a child as the main
 *           subject, a third-party copyright in the file, supplier product
 *           shots that are not installations, and a lower-resolution copy of
 *           the page's own hero.
 *   trail — shown LAST: extra angles of a scene already represented, and
 *           real HUB work where a third-party storefront sign dominates the
 *           frame (Walmart, Home Depot, Fortinos…). Kept, because they are
 *           real installations; buried, because they should not be the
 *           first thing a specifier sees. Also another page's hero photo, so
 *           a hero is not repeated near the top of a second page.
 *
 * Paired pages (Crosswalks and Pedestrian Safety, Private and Residential
 * Driveways, PreMark and Regulatory Markings, StreetBondSR and LEED, AirMark
 * and Airports) draw on the same photos, so their leads are chosen to give
 * each a different first seven (QA pa#18, 27 Sep 2026).
 *
 * Resolution is handled by the generator, not here: files under 800px on
 * the long edge are hidden automatically and 800–1199px files sort after
 * full-size ones — see scripts/gen-gallery-manifest.mjs.
 *
 * Anything not named here keeps its natural (filename) order between the
 * lead and the trail. Basenames only, case-insensitive; cross-posted photos
 * are addressed by their own basename exactly like folder photos.
 *
 * Read at build time by scripts/gen-gallery-manifest.mjs; never imported by
 * the app.
 */

export const CURATION = {
  // Half the gallery (05, 06, 11, 12, 13, 16, 21, 28) is under 800px and will be hidden, leaving exa
  // ctly eight, so all eight are pinned. Most files duplicate the airmark product gallery at lower r
  // esolution (airports-02 is airmark-05 at 1200px vs 3264px). Owner should cross-post airmark-11, a
  // irmark-09 and airmark-14 here to fill the grid with hi-res variety.
  // 28 Sep 2026: airports-08 is now this page's hero, and airports-10 is the same photo as the
  // AirMark hero, so neither opens the gallery. What is left is five twins of AirMark photos;
  // the AirMark gallery puts those twins last so the two pages open differently.
  "images/applications/airports": {
    lead: [
      "airports-15.jpg",
      "airports-20.png",
      "airports-14.jpg", // 3264px twin of airports-02
      "airports-07.jpg", // 2016px twin of airports-03
      "airports-26.jpg",
    ],
    hide: [
      "airports-10.jpg", // same photo as the AirMark hero (airmark-04)
      "airports-04.jpg", // off-subject: a red rapid-transit bus lane at a station, no airfield
    ],
    trail: [],
  },

  // Good subject fit, but the set is dominated by 1536x2048 portrait phone shots of one residential 
  // green-lane project (16 to 24), and the downtown bike-box intersection appears four times (09, 10
  // , 30, 31). Only about a dozen landscape 1200px+ frames exist. Standouts: bike-lanes-01 (cyclist 
  // through the bike box), bike-lanes-11 (bridge), bike-lanes-12 (red bus + green bike lane).
  // 28 Sep 2026: bike-lanes-01 is the page hero and bike-lanes-12 the Regulatory Markings hero.
  "images/applications/bike-lanes": {
    lead: [
      "bike-lanes-11.jpg",
      "bike-lanes-29.jpg",
      "bike-lanes-31.jpg",
      "bike-lanes-02.jpg",
      "bike-lanes-40.jpg",
      "bike-lanes-08.jpg",
      "bike-lanes-32.png",
      "bike-lanes-07.jpg",
    ],
    hide: [
      "bike-lanes-39.jpg", // US: New England triple-deckers and a BIKE SIGNAL sign (QA pa#6)
      "bike-lanes-33.jpg", // US: EXIF GPS in California
      "bike-lanes-35.jpg", // US: EXIF GPS in California
      "bike-lanes-05.jpg", // US: the same road and cyclist as bike-lanes-33
      "bike-lanes-06.jpg", // US: the same bike box as bike-lanes-35
      "bike-lanes-34.jpg", // US: same 2016 iPhone series as -33 and -35, palms and a sharrow
    ],
    trail: [
      "bike-lanes-12.jpg", // same photo as the Regulatory Markings hero (and bus-lanes-17)
      "bike-lanes-04.jpg", // green lanes on the same bridge as bike-lanes-11
      "bike-lanes-09.jpg", // downtown green bike box intersection with SUV/BMW, same as bike-lanes-31
      "bike-lanes-10.jpg", // downtown green bike box intersection with SUV/BMW, same as bike-lanes-31
      "bike-lanes-30.jpg", // downtown green bike box intersection with SUV/BMW, same as bike-lanes-31
      "bike-lanes-28.jpg", // green triangle at the same corner as bike-lanes-27
      "bike-lanes-21.jpg", // green lane with white squares, same as bike-lanes-17
      "bike-lanes-19.jpg", // overcast residential green lane, same street as bike-lanes-16
      "bike-lanes-23.jpg", // curving residential green lane, same project as bike-lanes-24
      "bike-lanes-20.jpg", // two-way green path with yellow centre line, same as bike-lanes-18
      "bike-lanes-15.jpg", // close-up of the bike symbol in the same green box as bike-lanes-14
    ],
  },

  // Very strong fit, but heavily weighted to one BRT corridor: the station/stamped-crosswalk interse
  // ction appears eight or nine times (bus-lanes-03, -07 to -10, -16, -26 to -28) and the same downt
  // own corridors several more, so most of the gallery is demoted. Standouts: bus-lanes-37.png (BUS 
  // ONLY by the civic building), bus-lanes-22 (bus on red lane downtown), bus-lanes-39.png (drone sh
  // ot of red lanes on a bridge) and bus-lanes-17 (red bus + green bike lane).
  // 28 Sep 2026: bus-lanes-41 is the page hero; bus-lanes-37 is the MMAX hero and bus-lanes-17
  // the Regulatory Markings hero, so both move to the end.
  "images/applications/bus-lanes": {
    lead: [
      "bus-lanes-22.jpg",
      "bus-lanes-08.jpg",
      "bus-lanes-39.png",
      "bus-lanes-11.jpg",
      "bus-lanes-34.jpg",
      "bus-lanes-05.jpg",
      "bus-lanes-14.jpg",
      "bus-lanes-32.jpg",
    ],
    hide: [
      "bus-lanes-01.jpg", // US: EXIF GPS in Delaware; an entrance drive with no bus (QA pa#9)
      "bus-lanes-24.jpg", // US: EXIF GPS in Delaware, same site as bus-lanes-01
    ],
    trail: [
      "bus-lanes-37.png", // same photo as the MMAX hero (mmax-04)
      "bus-lanes-17.jpg", // same photo as the Regulatory Markings hero (bike-lanes-12)
      "bus-lanes-07.jpg", // BRT station red lane with stamped crosswalk, same as bus-lanes-08
      "bus-lanes-09.jpg", // BRT station red lane with stamped crosswalk, same as bus-lanes-08
      "bus-lanes-10.jpg", // BRT station red lane with stamped crosswalk, same as bus-lanes-08
      "bus-lanes-16.jpg", // BRT station red lane with stamped crosswalk, same as bus-lanes-08
      "bus-lanes-26.jpg", // BRT station red lane with stamped crosswalk, same as bus-lanes-08
      "bus-lanes-27.jpg", // BRT station red lane with stamped crosswalk, same as bus-lanes-08
      "bus-lanes-28.jpg", // BRT station red lane with stamped crosswalk, same as bus-lanes-08
      "bus-lanes-03.jpg", // red lane with stamped crosswalk, same BRT corridor as bus-lanes-08
      "bus-lanes-06.jpg", // white SUV at the red lane and crosswalk, same intersection as bus-lanes-05
      "bus-lanes-04.jpg", // red BUS ONLY lane beside the stone civic building, same corridor as bus-lanes-37.png (strong alternate hero)
      "bus-lanes-19.jpg", // red BUS ONLY lane beside the stone civic building, same corridor as bus-lanes-37.png
      "bus-lanes-18.jpg", // red BUS ONLY lane beside the stone civic building (portrait), same corridor as bus-lanes-37.png
      "bus-lanes-23.jpg", // downtown red lane with diamond and skyline (portrait), same corridor as bus-lanes-22
      "bus-lanes-25.jpg", // downtown red lane with diamond and skyline, same corridor as bus-lanes-22
      "bus-lanes-12.jpg", // two-way red lanes with stamped median (portrait), same as bus-lanes-11
      "bus-lanes-15.jpg", // two-way red lanes with stamped median, same as bus-lanes-11
      "bus-lanes-29.jpg", // red lane at signalised intersection (portrait), same as bus-lanes-30
      "bus-lanes-35.jpg", // red texture close-up (portrait), same surface as bus-lanes-36
      "bus-lanes-20.jpg", // London Transit bus on red lane (portrait), same day as bus-lanes-02
    ],
  },

  // Large gallery (113) with mostly good fit: storefront walkways, retail-lot crosswalks and stamped
  //  parking. Over-represented: the brick-facade lifestyle plaza (Royal Bank/Winners/Jack Astor's, 6
  //  shots), the tan block crosswalk (3), the 2856px red-brick lot series (3), plus off-subject stra
  // ys (bus-lane terminal, bike lanes, park bridge, school playground, rooftop play area, waterfront
  //  promenade). Standouts: 51 (outlet mall), 16 (sunset lot), 08 (hex-pattern plaza), 111 (wave cro
  // 28 Sep 2026: the hero is now commercial-spaces-75 (Toronto Premium Outlets), so the other
  // outlet photos and the brand-led storefronts move back.
  "images/applications/commercial-spaces": {
    lead: [
      "commercial-spaces-52.jpg",
      "commercial-spaces-111.jpg",
      "commercial-spaces-84.jpg",
      "commercial-spaces-64.jpg",
      "commercial-spaces-67.jpg",
      "commercial-spaces-27.jpg",
      "commercial-spaces-22.jpg",
      "commercial-spaces-99.jpg",
    ],
    hide: [
      "commercial-spaces-18.jpg", // Aerial of the Waterloo Park pedestrian bridge (park-name lettering decal); a public park, not a commercial space.
      "commercial-spaces-105.jpg", // Elementary-school playground with flower decals (school sign readable); playground/school, off-subject for commercial spaces.
      "commercial-spaces-77.jpg", // Bike-lane application shot (striping machine laying a blue lane and symbol on a street); no commercial context.
    ],
    trail: [
      "commercial-spaces-51.jpg", // outlet storefront brands (J.Crew, Tommy Hilfiger) dominate the frame
      "commercial-spaces-91.jpg", // Tim Hortons storefront dominates the frame
      "commercial-spaces-117.jpg", // a car dealership's brand sign is legible above the plaza
      "parking-lots-60.jpg", // Toronto Premium Outlets again, the site of this page's hero
      "commercial-spaces-55.jpg", // the Public Spaces hero
      "commercial-spaces-30.jpg", // brick-facade retail plaza (Royal Bank/Winners/Jack Astor's), red stamped crosswalks, same as commercial-spaces
      "commercial-spaces-31.jpg", // brick-facade retail plaza (Royal Bank/Winners/Jack Astor's), red stamped crosswalks, same as commercial-spaces
      "commercial-spaces-33.jpg", // brick-facade retail plaza (Royal Bank/Winners/Jack Astor's), red stamped crosswalks, same as commercial-spaces
      "commercial-spaces-34.jpg", // brick-facade retail plaza, bus on herringbone stamped drive aisle, same as commercial-spaces-32
      "commercial-spaces-35.jpg", // brick-facade retail plaza (Jack Astor's), same as commercial-spaces-32
      "commercial-spaces-54.jpg", // Hillside Centre entrance red coating (portrait), same as commercial-spaces-27
      "commercial-spaces-06.jpg", // barn-style building with stamped crossing, same as commercial-spaces-05
      "commercial-spaces-66.jpg", // tan block crosswalk with white stripes, same as commercial-spaces-65
      "commercial-spaces-109.jpg", // tan block crosswalk with white stripes, same as commercial-spaces-65
      "commercial-spaces-68.jpg", // grey stamped parking stalls at glass entrance, same as commercial-spaces-67
      "commercial-spaces-74.jpg", // red brick stamped crosswalk in retail lot (2856px series), same as commercial-spaces-71
      "commercial-spaces-75.jpg", // red brick stamped crosswalk in retail lot (2856px series), same as commercial-spaces-71
      "commercial-spaces-79.jpg", // Home Depot white-striped crosswalk, same as commercial-spaces-40
      "commercial-spaces-106.jpg", // Walmart Supercentre entrance crosswalk (portrait), same as commercial-spaces-101
      "commercial-spaces-112.jpg", // wave-pattern crosswalk at Verve building, same as commercial-spaces-111
      "commercial-spaces-44.jpg", // yellow coated crosswalk at condo lot (fisheye), same as commercial-spaces-43
      "commercial-spaces-88.jpg", // red bus lane at transit terminal, same as commercial-spaces-87
      "commercial-spaces-89.jpg", // red bus lane at transit terminal, same as commercial-spaces-87
      "commercial-spaces-45.jpg", // Little Italy (Commercial Drive) geometric crosswalk, same as commercial-spaces-28
      "commercial-spaces-49.jpg", // Little Italy logo decal install, same as commercial-spaces-28
      "commercial-spaces-37.jpg", // rooftop courtyard/play area fisheye, same as commercial-spaces-36
      "commercial-spaces-95.jpg", // Granville Island entrance roadworks, same as commercial-spaces-42
    ],
  },

  // Good fit - BIA crosswalk, wayfinding, commemorative medallion, logos and stamped medallions all 
  // read as identity on pavement. Three near-identical Yates St. blocks (05/07/08) are the only redu
  // ndancy; two demoted. The same 14 files are cross-posted to public-art, so the two galleries were
  //  given different leads (04 here, 02 there).
  // 28 Sep 2026: community-branding-17 (Geary Works) is now the page hero.
  "images/applications/community-branding": {
    lead: [
      "community-branding-04.jpg",
      "community-branding-03.jpg",
      "community-branding-15.jpg",
      "community-branding-09.jpg",
      "crosswalks-128.jpg",
      "community-branding-07.jpg",
      "community-branding-12.jpg",
      "community-branding-01.jpg",
      "community-branding-02.jpg",
      "community-branding-13.jpg",
    ],
    hide: [],
    trail: [
      "community-branding-05.jpg", // Yates St. wayfinding block (yellow 3, portrait), same project as community-branding-07
      "community-branding-08.jpg", // Yates St. wayfinding block (green 4), same project as community-branding-07
    ],
  },

  // Subject fit is strong: nearly everything is a decorative crosswalk. The gallery is heavily over-
  // represented by red-brick-with-white-ladder-bars crosswalks from the Vaughan VMC / Hwy 7 corridor
  //  and Brampton transit sites (well over 30 near-identical frames), so the pins deliberately mix i
  // n yellow (winter), beige, Indigenous-art and civic settings. Standouts: crosswalks-33 (Indigenou
  // s art crosswalk), crosswalks-02, crosswalks-55, crosswalks-107. The four Waterloo Park aerials a
  // 28 Sep 2026: Pedestrian Safety is built from this folder, so the two pages now open on
  // different photos: people crossing lead there, design variety leads here.
  "images/applications/crosswalks": {
    lead: [
      "crosswalks-126.jpg",
      "crosswalks-55.jpg",
      "crosswalks-11.jpg",
      "crosswalks-43.jpg",
      "crosswalks-37.jpg",
      "crosswalks-10.jpg",
      "crosswalks-105.jpg",
      "crosswalks-23.jpg",
    ],
    hide: [
      "crosswalks-129.jpg", // a family with an identifiable toddler is the main subject (also parks-paths-146)
      "crosswalks-29.jpg", // off-subject: aerial of a basketball court with a logo (Waterloo Park), no crosswalk
      "crosswalks-30.jpg", // off-subject: aerial of a park pathway with logo roundels, no crosswalk
      "crosswalks-31.jpg", // off-subject: aerial of the Waterloo Park bridge/path lettering, no crosswalk
      "crosswalks-32.jpg", // off-subject: second aerial of the same Waterloo Park bridge/path, no crosswalk
    ],
    trail: [
      "crosswalks-02.jpg", // the Vaughan VMC intersection of the Pedestrian Safety hero (crosswalks-03)
      "crosswalks-115.png", // the Lest We Forget crosswalk of the TrafficPatterns hero
      "traffic-patterns-87.jpg", // the TrafficPatterns hero
      "crosswalks-114.png", // the TrafficPatternsXD hero
      "crosswalks-03.jpg", // Vaughan VMC intersection (red crosswalk + green bike lane), same as crosswalks-02
      "crosswalks-04.jpg", // Vaughan VMC intersection (red crosswalk + green bike lane), same as crosswalks-02
      "crosswalks-05.jpg", // Vaughan VMC intersection (red crosswalk + green bike lane), same as crosswalks-02
      "crosswalks-06.jpg", // VMC / Hwy 7 red crosswalk, same day as crosswalks-02
      "crosswalks-08.jpg", // Brampton bus terminal red crosswalk, same as crosswalks-07
      "crosswalks-09.jpg", // Brampton bus terminal red crosswalk, same as crosswalks-07
      "crosswalks-15.jpg", // yellow ladder crosswalk by the church, same street as crosswalks-14
      "crosswalks-16.jpg", // yellow ladder crosswalk by the church, same street as crosswalks-14
      "crosswalks-20.jpg", // transit station lot at sunset, same as crosswalks-19
      "crosswalks-21.jpg", // transit station lot at sunset, same as crosswalks-19
      "crosswalks-22.jpg", // transit station lot, same as crosswalks-19
      "crosswalks-24.jpg", // beige crosswalk in the same townhome development as crosswalks-23
      "crosswalks-47.jpg", // Granville Island crossing, same as crosswalks-48 (cement truck blocks the view)
      "crosswalks-49.jpg", // red brick crosswalk with white bars, Vaughan Hwy 7 corridor series
      "crosswalks-50.jpg", // red brick crosswalk with white bars, Vaughan Hwy 7 corridor series
      "crosswalks-51.jpg", // red brick crosswalk with white bars, Vaughan Hwy 7 corridor series
      "crosswalks-52.jpg", // red brick crosswalk with white bars, Vaughan Hwy 7 corridor series
      "crosswalks-53.jpg", // red brick crosswalk with white bars, Vaughan Hwy 7 corridor series
      "crosswalks-56.jpg", // Brampton office-building crossing, same as crosswalks-57
      "crosswalks-58.jpg", // Brampton office-building crossing, same as crosswalks-57
      "crosswalks-67.jpg", // Home Depot lot, black/white striped crosswalks, same as crosswalks-69
      "crosswalks-68.jpg", // Home Depot lot, black/white striped crosswalks, same as crosswalks-69
      "crosswalks-70.jpg", // Home Depot lot, black/white striped crosswalks, same as crosswalks-69
      "crosswalks-71.jpg", // Home Depot lot, black/white striped crosswalks, same as crosswalks-69
      "crosswalks-83.jpg", // downtown red/white crosswalk surface close-up with no context, same series as crosswalks-82
      "crosswalks-87.jpg", // GO bus at the downtown red crosswalk, same as crosswalks-86
      "crosswalks-93.jpg", // beige crosswalk with pedestrians, same as crosswalks-92
      "crosswalks-106.jpg", // Kelowna waterfront crossing, same as crosswalks-107 (fire truck blocks the view)
      "crosswalks-111.png", // red crosswalk in snow by the pergola, close-up of crosswalks-114
    ],
  },

  // Only two images, both plausible but neither is a textbook pale solar-reflective surface. The gal
  // lery needs cross-posts from streetbondsr (pale grey/beige lots and plazas) to fill the seven vis
  // ible slots.
  // 28 Sep 2026: leed-urban-heat-island-01 is the page hero and streetbondsr-02 the StreetBondSR
  // hero. The rest are StreetBondSR photos in a different order from that page (which opens on
  // streetbondsr-06); a truly separate first seven needs photos this page doesn't have yet.
  "images/applications/leed-urban-heat-island": {
    lead: [
      "streetbondsr-01.png",
      "streetbondsr-08.jpg",
      "streetbondsr-06.jpg",
      "leed-urban-heat-island-02.jpg",
      "streetbondsr-07.jpg",
    ],
    hide: [
      "streetbondsr-02.jpg", // the StreetBondSR hero
    ],
    trail: [],
  },

  // Good subject fit overall: sealed lots, stalls, accessible symbols, EV stalls and stamped retail 
  // crossings. Two projects are over-represented - the fenced brick-building lot (parking-lots-06 to
  //  -10, -18) and the Winners/RBC chimney plaza (-34 to -37, -51). Standouts are the waterfront aer
  // ial -19, the clean DuraShield lot -04 and the green EV stall -01. Several images lean on big-box
  //  store signage (Home Depot, Lowe's, Walmart, Fortinos, Shoppers); the owner should decide whethe
  // 28 Sep 2026: the hero is now streetprint-25. Toronto Premium Outlets (parking-lots-60) no
  // longer leads because Commercial Spaces now opens on that site.
  "images/applications/parking-lots": {
    lead: [
      "streetbond-113.jpg",
      "parking-lots-01.jpg",
      "parking-lots-12.jpg",
      "parking-lots-14.jpg",
      "parking-lots-11.jpg",
      "parking-lots-23.jpg",
      "parking-lots-45.jpg",
      "parking-lots-04.jpg",
    ],
    hide: [
      "parking-lots-50.jpg", // Privacy: parked car with a readable front licence plate fills half the frame; the red stamped path is secondary.
      "parking-lots-19.jpg", // US: a marina lot with coconut palms and high-rise hotels, reads as Florida
      "parking-lots-26.jpg", // US: the same marina, coconut palms
    ],
    trail: [
      "parking-lots-07.jpg", // grey sealed lot at brick building with iron fence and cones, same as parking-lots-06
      "parking-lots-08.jpg", // grey sealed lot at brick building with iron fence and cones, same as parking-lots-06
      "parking-lots-09.jpg", // grey sealed lot at brick building with iron fence and cones, same as parking-lots-06
      "parking-lots-10.jpg", // grey sealed lot at brick building with iron fence and cones, same as parking-lots-06
      "parking-lots-18.jpg", // grey sealed lot at brick building with iron fence and cones, same as parking-lots-06
      "parking-lots-05.jpg", // side elevation of the same freshly sealed lot as parking-lots-04
      "parking-lots-35.jpg", // Winners/RBC retail plaza (chimney site), red stamped crossings, same as parking-lots-34
      "parking-lots-36.jpg", // Winners/RBC retail plaza (chimney site), red stamped crossings, same as parking-lots-34
      "parking-lots-37.jpg", // Winners/RBC retail plaza (chimney site), red stamped crossings, same as parking-lots-34
      "parking-lots-51.jpg", // Winners/RBC retail plaza (chimney site), red stamped crossings, same as parking-lots-34
      "parking-lots-48.jpg", // red stamped path to Ralph's (portrait), same site as parking-lots-47
    ],
  },

  // Subject fit is loose: roughly a third of the 141 files are crosswalks, plazas, playgrounds, spor
  // t courts, splash pads or street murals rather than park paths. Clear off-subject cases are exclu
  // ded; borderline plaza/public-art shots are flagged uncertain rather than removed. Over-represent
  // ed projects: the dotted skate-park plaza (4 aerials: 84/105/135/137), the ribbon playground path
  //  (56-59), the orange swirl plaza (126-128), the blue river path (130-132), the purple/teal stree
  // 28 Sep 2026: parks-paths-09 is now the page hero. parks-paths-48 and -145 are the park of the
  // StreetBondSR hero, and -17 is the PreMark hero, so they no longer lead.
  "images/applications/parks-paths": {
    lead: [
      "parks-paths-125.jpg",
      "parks-paths-132.jpg",
      "parks-paths-74.jpg",
      "parks-paths-77.jpg",
      "parks-paths-119.jpg",
      "parks-paths-38.jpg",
      "parks-paths-134.jpg",
      "parks-paths-118.jpg",
    ],
    hide: [
      "parks-paths-146.jpg", // a family with an identifiable toddler is the main subject (also crosswalks-129)
      "parks-paths-05.jpg", // Red stamped-asphalt road median with traffic cones; traffic-calming on a street, not a park path
      "parks-paths-12.jpg", // Street pedestrian crosswalk (yellow/green), not a park path
      "parks-paths-18.jpg", // Sport court / rink surfacing, off-subject
      "parks-paths-19.jpg", // Splash pad, off-subject
      "parks-paths-20.jpg", // Splash pad (second angle), off-subject
      "parks-paths-21.jpg", // Striped parking lot, off-subject
      "parks-paths-22.jpg", // Street crosswalk installation with truck, off-subject
      "parks-paths-24.jpg", // Same Grizzly mascot logo, wider; not a path
      "parks-paths-25.jpg", // Aerial of a road crosswalk mural, off-subject
      "parks-paths-33.jpg", // Downtown street intersection mural, off-subject
      "parks-paths-40.jpg", // Road intersection mural, off-subject
      "parks-paths-42.jpg", // Street crosswalk (puzzle pattern), off-subject
      "parks-paths-47.jpg", // Street crosswalk (circle pattern), off-subject
      "parks-paths-64.jpg", // Road crosswalk under an overpass, off-subject
      "parks-paths-80.jpg", // School playground number-grid game, off-subject
      "parks-paths-100.png", // SeaBus terminal crowd shot: transit plaza full of people with terminal signage, off-subject
      "parks-paths-110.jpg", // Sport court (red/blue with purple circles), off-subject
      "parks-paths-111.jpg", // Sport court (second angle), off-subject
      "parks-paths-136.jpg", // Green bike-lane crossing on a road, off-subject
      "parks-paths-141.jpg", // Road crosswalk with cyclist, off-subject
      "parks-paths-142.jpg", // Road crosswalk (circle pattern) with crew and car, off-subject
    
      "parks-paths-96.png", // 1024px copy; parks-paths-96.jpg is the same photo at 2016px (catalogue playground hero)
    ],
    trail: [
      "parks-paths-48.jpg", // the park and path of the StreetBondSR hero (same file as streetbondsr-05)
      "parks-paths-145.jpg", // the path junction of the StreetBondSR hero, another angle
      "parks-paths-17.jpg", // the PreMark hero
      "parks-paths-70.jpg", // the DecoMark hero
      "parks-paths-95.jpg", // the LEED hero (same file as leed-urban-heat-island-01)
      "parks-paths-07.jpg", // branding in frame — kept, shown last: Commercial retail plaza with storefront signage and seated patrons; not a park path
      "parks-paths-23.jpg", // branding in frame — kept, shown last: School mascot logo (Grizzly) on pavement; community branding, not a path
      "parks-paths-39.jpg", // branding in frame — kept, shown last: Tim Hortons storefront with readable signage; commercial entry walkway, off-subject and third-party 
      "parks-paths-55.jpg", // branding in frame — kept, shown last: Little Italy BIA sidewalk medallion with crew and pedestrian; community branding on a downtown sidew
      "parks-paths-02.jpg", // leafy park path with distance markers, same path as parks-paths-01
      "parks-paths-04.jpg", // brick-pattern plaza crossing, same plaza as parks-paths-03
      "parks-paths-13.jpg", // blue multi-use path with paver edge, same as parks-paths-14
      "parks-paths-15.jpg", // Route logo install on trail with crew, same trail as parks-paths-16
      "parks-paths-28.jpg", // Richmond Olympic Oval plaza, same site as parks-paths-32
      "parks-paths-37.jpg", // playground with wooden poles, same as parks-paths-36
      "parks-paths-56.jpg", // purple/orange/yellow ribbon playground path, same project as parks-paths-57
      "parks-paths-58.jpg", // green-with-dots section, same project as parks-paths-57
      "parks-paths-59.jpg", // ribbon playground path with bike racks, same as parks-paths-57
      "parks-paths-71.jpg", // teal canoe Indigenous design close-up, same as aerial parks-paths-62
      "parks-paths-73.jpg", // compass rose on waterfront path, same as parks-paths-72
      "parks-paths-75.jpg", // paver plaza with coloured stripe, same as parks-paths-74
      "parks-paths-82.jpg", // purple/teal geometric street pattern, same as parks-paths-81
      "parks-paths-83.jpg", // purple/teal geometric street pattern, same as parks-paths-81
      "parks-paths-104.png", // aerial blue coated park plaza, same site as parks-paths-103.png
      "parks-paths-105.png", // dotted skate-park plaza aerial, same site as parks-paths-84
      "parks-paths-135.jpg", // dotted skate-park plaza aerial, same site as parks-paths-84
      "parks-paths-137.jpg", // dotted skate-park plaza aerial, same site as parks-paths-84
      "parks-paths-109.jpg", // orange coated park path, same park as parks-paths-48
      "parks-paths-113.jpg", // checkerboard plaza under overpass, same as parks-paths-112
      "parks-paths-120.jpg", // geometric coloured courtyard path aerial, same as parks-paths-119
      "parks-paths-122.jpg", // park-edge crosswalk, same as parks-paths-121
      "parks-paths-124.jpg", // rainbow path at building entry, same project as parks-paths-125
      "parks-paths-127.jpg", // orange swirl plaza, same as parks-paths-126
      "parks-paths-128.jpg", // orange swirl plaza, same as parks-paths-126
      "parks-paths-130.jpg", // blue river path, same project as parks-paths-132
      "parks-paths-131.jpg", // blue river path under shelter, same project as parks-paths-132
      "parks-paths-139.jpg", // dog-walker pedestrian symbol, same path as parks-paths-138
    ],
  },

  // Solid fit: nearly every frame is a high-visibility or decorative crosswalk, plus raised tables a
  // nd a transit-station crossing; the only clear miss is the Waterloo Park bridge. The gallery lean
  // s heavily on red/white brick crosswalks, so the top 8 mixes in the commemorative Lest We Forget 
  // crossing, an Indigenous-design speed table, a yellow heritage crossing, a green raised crossing 
  // and a grey waterfront crossing. Several frames feature big-box retailer signage (Walmart, Home D
  // 28 Sep 2026: crosswalks-03 is the page hero. This page opens on people crossing; Crosswalks
  // opens on design variety, so the two first sevens no longer overlap.
  "images/applications/pedestrian-safety": {
    lead: [
      "crosswalks-123.jpg",
      "crosswalks-125.jpg",
      "crosswalks-124.jpg",
      "crosswalks-16.jpg",
      "crosswalks-92.jpg",
      "crosswalks-107.jpg",
      "crosswalks-78.jpg",
      "traffic-patterns-xd-139.jpg",
    ],
    hide: [
      "crosswalks-31.jpg", // Off-subject: Waterloo Park bridge drone shot; a park path, no crosswalk or pedestrian-safety feature
    ],
    trail: [
      "crosswalks-115.png", // the Lest We Forget crosswalk of the TrafficPatterns hero
      "traffic-patterns-xd-91.jpg", // GO bus terminal red crosswalk, same terminal as crosswalks-08
      "crosswalks-117.jpg", // small-town main street red brick crosswalk, same streetscape as crosswalks-100
      "crosswalks-68.jpg", // big-box store entrance crosswalk, same lot as crosswalks-70
    ],
  },

  // Very on-subject and high-resolution gallery, but heavily clustered by project: the curved-line s
  // choolyard (6 frames), the blue Montreal yard (3), the 'action' activity path (4) and the grass-s
  // ide track (3) would otherwise dominate the visible grid. One frame per school is kept forward. S
  // tandouts are playgrounds-33 (blue/green coated yard with mural wall), -52 (aerial red/green play
  // ground) and -17 (concentric oval track).
  "images/applications/playgrounds": {
    lead: [
      "parks-paths-96.jpg",
      "playgrounds-33.jpg",
      "playgrounds-52.jpg",
      "playgrounds-17.jpg",
      "playgrounds-10.jpg",
      "playgrounds-11.jpg",
      "playgrounds-05.jpg",
      "playgrounds-35.jpg",
    ],
    hide: [
      "playgrounds-39.jpg", // US: EXIF GPS in Santa Monica, California (same file as streetbond-28)
      "playgrounds-38.jpg", // Off-subject: Waterloo Park bridge drone shot; a park path, no playground content
      "playgrounds-49.jpg", // Off-subject: UBC/Musqueam campus crosswalk with pedestrians; not a playground
      "playgrounds-51.jpg", // Off-subject: plain stamped pathway, no playground content (portrait)
    
      "parks-paths-96.png", // 1024px copy; parks-paths-96.jpg is the same photo at 2016px
    ],
    trail: [
      "playgrounds-02.jpg", // white/blue/tan coated playground, same project as playgrounds-03
      "playgrounds-04.jpg", // white/blue/tan coated playground with ramp, same project as playgrounds-03
      "playgrounds-07.jpg", // narrow Montreal schoolyard games, same yard as playgrounds-06
      "playgrounds-08.jpg", // blue coated Montreal schoolyard with yellow games, same yard as playgrounds-10
      "playgrounds-09.jpg", // blue coated Montreal schoolyard with yellow games, same yard as playgrounds-10
      "playgrounds-12.jpg", // traffic-garden schoolyard with tyre obstacles, portrait of playgrounds-11
      "playgrounds-14.jpg", // 'action' circle activity path, detail of playgrounds-13
      "playgrounds-15.jpg", // 'action' activity path, same school as playgrounds-13
      "playgrounds-16.jpg", // coloured-dot activity path, same series as playgrounds-13
      "playgrounds-22.jpg", // curved-line schoolyard shot over a rooftop, same school as playgrounds-27
      "playgrounds-23.jpg", // curved-line schoolyard with planter island, same school as playgrounds-27
      "playgrounds-24.jpg", // curved-line schoolyard, white circle game, same school as playgrounds-27
      "playgrounds-25.jpg", // curved-line schoolyard with crew and truck, same school as playgrounds-27
      "playgrounds-26.jpg", // curved-line schoolyard with planter island, same school as playgrounds-27
      "playgrounds-28.jpg", // schoolyard with garden beds, same yard as playgrounds-29
      "playgrounds-31.jpg", // grass-side school track with yellow dashes, same school as playgrounds-30
      "playgrounds-32.jpg", // grass-side school path with dots and bars, same school as playgrounds-30
      "playgrounds-43.jpg", // yellow-maze schoolyard, same school as playgrounds-42
      "playgrounds-44.jpg", // pac-man maze, same schoolyard as playgrounds-42
      "playgrounds-36.jpg", // labyrinth garden, same site as playgrounds-50
    ],
  },

  // This gallery is a cross-post mirror of residential-driveways (same photos, a few renamed: -42 he
  // re is the -33 driveway, -34 here is the -04 walkway) plus three townhomes cross-posts, so the pi
  // cks match. Same over-represented scenes: the red-brick stone-wall driveway (-42, -43, -44) and t
  // he castle (-26, -35). Standouts: -18, -02, -11, -03.
  // 28 Sep 2026 (QA pa#18): the two driveway pages shared their first seven. They now share
  // none: this page opens on residential-driveways-22 and its own picks below, Residential
  // Driveways on -33. Its hero is residential-driveways-21; -18 is the Residential hero, -11 the
  // StreetPrint hero and -06 the DuraShield hero, so those go last. -20 shows a house number.
  "images/applications/private-driveways": {
    lead: [
      "residential-driveways-22.jpg",
      "residential-driveways-07.jpg",
      "residential-driveways-12.jpg",
      "residential-driveways-08.jpg",
      "residential-driveways-39.jpg",
      "residential-driveways-14.jpg",
      "residential-driveways-13.jpg",
    ],
    hide: [],
    trail: [
      "residential-driveways-18.jpg", // the Residential Driveways hero
      "residential-driveways-11.jpg", // same photo as the StreetPrint hero (streetprint-86)
      "residential-driveways-06.jpg", // same photo as the DuraShield hero (durashield-11)
      "residential-driveways-02.jpg", // same photo as streetprint-45 and residential-driveways-29
      "residential-driveways-19.jpg", // the house of the Residential Driveways hero
      "residential-driveways-20.jpg", // the house number is legible on the driveway
      "residential-driveways-43.jpg", // long curving red-brick driveway with stone retaining wall, same as residential-driveways-42
      "residential-driveways-44.jpg", // long curving red-brick driveway with stone retaining wall, same as residential-driveways-42
      "residential-driveways-35.jpg", // stone castle driveway, same building as residential-driveways-26
    ],
  },

  // Every image is cross-posted from community-branding. The real art pieces lead (02 B/W artistic c
  // rosswalk, 09 circular mural, 10 painted laneway, 13/14 Indigenous-motif crosswalks, 03 Terry Fox
  //  medallion, 11 alphabet ring); the wayfinding blocks (05/07/08), stamped medallions (01/06) and 
  // the tennis logo (12) are branding rather than public art and could be dropped here. Nothing exce
  // eds 1600px, so nothing is hidden but nothing is very hi-res either.
  // 28 Sep 2026: public-art-01 is now the page hero and public-art-02 is the same artwork up
  // close, so it goes last. The lead avoids Community Branding's first seven.
  "images/applications/public-art": {
    lead: [
      "community-branding-02.jpg",
      "public-art-03.jpg",
      "community-branding-13.jpg",
      "public-art-05.jpg",
      "community-branding-14.jpg",
      "public-art-04.jpg",
      "community-branding-11.jpg",
      "community-branding-10.jpg",
      "community-branding-09.jpg",
      "community-branding-03.jpg",
      "community-branding-04.jpg",
    ],
    hide: [],
    trail: [
      "public-art-02.jpg", // the hero's artwork, closer
      "community-branding-07.jpg", // Yates St. wayfinding block (yellow 3), same project as community-branding-05
      "community-branding-08.jpg", // Yates St. wayfinding block (green 4), same project as community-branding-05
    ],
  },

  // Good subject fit overall: plazas, campus and transit streetscapes, waterfront promenades and mur
  // al laneways. The Ogden Point / marina red promenade appears four times and the transit exchange 
  // three times, so extras are pushed back. Two frames (public-spaces-11 and -25) are stored sideway
  // s and should be re-saved upright; public-spaces-01 (colourful laneway), -44 (red promenade) and 
  // -29 (UBC mural crosswalk) are the standouts.
  // 28 Sep 2026 (QA pa#19): no longer opens on public-spaces-70, whose frame is full of
  // construction fencing and caution tape.
  "images/applications/public-spaces": {
    lead: [
      "public-spaces-44.jpg",
      "public-spaces-01.jpg",
      "public-spaces-68.jpg",
      "public-spaces-29.png",
      "public-spaces-49.jpg",
      "public-spaces-07.jpg",
      "public-spaces-60.jpg",
      "public-spaces-40.jpg",
      "public-spaces-39.jpg",
    ],
    hide: [
      "public-spaces-23.png", // Third-party branding: Tanger Outlets directory sign listing retail brands dominates the frame; pavement is secondary
    ],
    trail: [
      "public-spaces-70.jpg", // construction fencing, cones and caution tape in frame
      "public-spaces-09.png", // same photo as the Crosswalks hero (crosswalks-09)
      "public-spaces-37.png", // a freight car's US flag decal is in frame (the scene itself is Canadian)
      "public-spaces-19.png", // transit exchange green/blue grid crosswalk, same as public-spaces-08 (orange)
      "public-spaces-43.jpg", // red brick waterfront promenade with white star, portrait of public-spaces-44
      "public-spaces-61.jpg", // marina promenade panorama, same waterfront as public-spaces-44
      "public-spaces-56.png", // cruise terminal red promenade, same waterfront project as public-spaces-44
      "public-spaces-33.png", // rainbow crosswalk in the rain, same crossing as public-spaces-32
      "public-spaces-30.png", // UBC logo detail, same crossing as public-spaces-29
      "public-spaces-15.png", // transit exchange red lanes and stamped crosswalk, same site as public-spaces-09
      "public-spaces-04.jpg", // multicolour striped crosswalk, detail of public-spaces-05
      "public-spaces-35.png", // smoke-free decal, detail of the covered transit walkway in public-spaces-34
      "public-spaces-02.jpg", // grey stamped heritage-building plaza, same site as public-spaces-07
    ],
  },

  // This gallery is essentially the whole traffic-calming folder cross-posted, and only about half o
  // f it shows an actual marking (crosswalk bars, a SCHOOL ZONE legend, a BUS legend, yield triangle
  // s, channelization islands, lane lines); none shows classic PreMark work (arrows, stop bars, bike
  //  symbols, accessible-parking symbols). Stamped driveways, laneways, roundabout aprons and unmark
  // ed medians were excluded as off-subject. Strongly recommend pulling real PreMark/regulatory phot
  // 28 Sep 2026 (QA pa#18): the PreMark page shows every PreMark photo, so this page now opens on
  // its own legends and crossings and puts the PreMark photos last. The hero is bike-lanes-12.
  "images/applications/regulatory-markings": {
    lead: [
      "traffic-calming-51.jpg",
      "commercial-spaces-87.jpg",
      "traffic-calming-04.jpg",
      "traffic-calming-53.jpg",
      "traffic-calming-21.jpg",
      "traffic-calming-54.jpg",
      "traffic-calming-08.jpg",
      "traffic-calming-43.png",
    ],
    hide: [
      "premark-02.jpg", // US: a desert street with a US flag and a US billboard (QA pa#6)
      "townhomes-12.jpg", // Off-subject: townhouse driveway with stamped border, no regulatory markings
      "traffic-calming-01.jpg", // Off-subject: coloured coating on a roadway, no arrows/lines/legends
      "traffic-calming-02.jpg", // Off-subject: stamped red median apron, no markings
      "traffic-calming-09.jpg", // Off-subject: stamped red median, no markings
      "traffic-calming-11.jpg", // Off-subject: roundabout truck apron, no pavement markings
      "traffic-calming-12.jpg", // Off-subject: stamped red island, no markings (portrait)
      "traffic-calming-13.jpg", // Off-subject: stamped red path with cyclists, no markings
      "traffic-calming-14.jpg", // Off-subject: laneway with stamped border, no markings
      "traffic-calming-17.jpg", // Off-subject: roundabout apron, no markings
      "traffic-calming-18.jpg", // Off-subject: townhouse driveway, no markings
      "traffic-calming-19.jpg", // Off-subject: stamped speed hump, no markings
      "traffic-calming-22.jpg", // Off-subject: roundabout with wagon sculpture, no markings
      "traffic-calming-23.jpg", // Off-subject: townhouse laneway, no markings
      "traffic-calming-28.jpg", // Off-subject: roundabout apron, no markings
      "traffic-calming-39.jpg", // Off-subject: roundabout with no pavement markings
      "traffic-calming-42.jpg", // Off-subject: plaza with planters and benches, no markings
      "traffic-calming-47.jpg", // Off-subject: paving crew and machine on a roundabout under construction, no markings
      "traffic-calming-48.jpg", // Off-subject: roundabout with wagon sculpture (duplicate of -22), no markings
      "traffic-calming-52.jpg", // Off-subject: blue coated lane in a parking lot, no regulatory markings
    ],
    trail: [
      "traffic-calming-26.jpg", // green/yellow grid crosswalk with yield triangles, same crossing as traffic-calming-04
      "traffic-calming-03.jpg", // the DuraTherm hero
      "premark-04.jpg", // PreMark photos: they lead the PreMark page
      "premark-07.jpg",
      "premark-11.jpg",
      "premark-05.jpg",
      "premark-03.jpg",
      "premark-06.jpg",
      "premark-08.jpg",
      "premark-01.jpg",
      "premark-09.jpg",
    ],
  },

  // Excellent fit and plenty of 3000px+ originals. The long red-brick driveway with the stone wall i
  // s shot three times (-33, -43, -44) and the castle twice (-26, -35). Standouts: -18 (dusk house w
  // ith medallion), -02 (large house, brick driveway), -11 (gate in fall colour), -03 (aerial medall
  // ion). Six images are portrait (04, 05, 15, 16, 19, 23) - fine in the grid, avoided for the hero.
  // 28 Sep 2026: -18 stays this page's hero; the lead no longer overlaps Private Driveways'.
  // -21 is the Private hero, -11 the StreetPrint hero and -06 the DuraShield hero; -02 is the
  // photo proposed for the section further down this page, so they all go last.
  "images/applications/residential-driveways": {
    lead: [
      "residential-driveways-33.jpg",
      "residential-driveways-03.jpg",
      "residential-driveways-10.jpg",
      "residential-driveways-09.jpg",
      "residential-driveways-37.jpg",
      "residential-driveways-38.jpg",
      "residential-driveways-16.jpg",
    ],
    hide: [],
    trail: [
      "residential-driveways-21.jpg", // the Private Driveways hero
      "residential-driveways-11.jpg", // same photo as the StreetPrint hero (streetprint-86)
      "residential-driveways-06.jpg", // same photo as the DuraShield hero (durashield-11)
      "residential-driveways-02.jpg", // same photo as residential-driveways-29, proposed for the section below
      "residential-driveways-19.jpg", // the hero's house again, portrait
      "residential-driveways-43.jpg", // long curving red-brick driveway with stone retaining wall, same as residential-driveways-33
      "residential-driveways-44.jpg", // long curving red-brick driveway with stone retaining wall, same as residential-driveways-33
      "residential-driveways-35.jpg", // stone castle driveway, same building as residential-driveways-26
    ],
  },

  // One of the strongest galleries: everything is clearly a splash pad, 17 of 18 are 1200px+ (most a
  // t 4000px) and colour schemes vary widely. Only two repeated projects (09/10, 15/16). Hero 01 is 
  // native 16:9 with shade sails, spray arches and boulders; 02 is the only shot with water actually
  //  spraying.
  // 28 Sep 2026 (QA pa#39): no longer opens on two identifiable children in swimwear.
  "images/applications/splash-pads": {
    lead: [
      "splash-pads-26.jpg",
      "splash-pads-07.jpg",
      "splash-pads-02.jpg",
      "splash-pads-06.jpg",
      "splash-pads-13.jpg",
      "splash-pads-20.jpg",
      "splash-pads-11.png",
      "splash-pads-05.jpg",
    ],
    hide: [
      "splash-pads-25.jpg", // two identifiable children in swimwear are the main subject
    ],
    trail: [
      "splash-pads-22.jpg", // two toddlers in the foreground
      "splash-pads-09.jpg", // orange/blue splash pad with boulders, same project as splash-pads-10
      "splash-pads-16.jpg", // salmon/white splash pad with spheres, same project as splash-pads-15
    ],
  },

  // Excellent, clearly on-subject gallery with lots of 4032px material. Heavy duplication: three sho
  // ts of the multi-game court (03/04/05), three of the La Dauversiere red courts (01/14/15), two ea
  // ch of the blue court (06/07) and the schoolyard (08/09) - extras demoted so the visible grid sho
  // ws eight different jobs. Standouts: 03, 14, 06.
  "images/applications/sport-courts": {
    lead: [
      "sport-courts-03.jpg",
      "sport-courts-24.jpg",
      "sport-courts-14.jpg",
      "sport-courts-22.jpg",
      "sport-courts-06.jpg",
      "sport-courts-23.jpg",
      "sport-courts-08.jpg",
      "sport-courts-13.jpg",
      "sport-courts-10.jpg",
      "sport-courts-20.jpg",
      "sport-courts-02.jpg",
    ],
    hide: [],
    trail: [
      "sport-courts-04.jpg", // multi-colour multi-game court, same court as sport-courts-03
      "sport-courts-05.jpg", // multi-colour multi-game court close-up, same court as sport-courts-03
      "sport-courts-07.jpg", // blue/grey basketball court by black building, same as sport-courts-06
      "sport-courts-09.jpg", // schoolyard circles and track lines, same yard as sport-courts-08
      "sport-courts-15.jpg", // La Dauversiere red courts aerial, same as sport-courts-14
      "sport-courts-01.jpg", // La Dauversiere red court at ground level, same project as sport-courts-14
    ],
  },

  // Very good subject fit - stamped-asphalt laneways, driveways and visitor parking in strata develo
  // pments, with a nice mix of red brick, grey and blue-grey finishes. Three images (03, 09, 17) are
  //  under 800px and hidden; 01 is orange (960px) and auto-demoted. Hero townhomes-14 (4032px red br
  // ick lane with motif) is the standout; 15 is the same lane shot in portrait.
  // 28 Sep 2026: townhomes-16 is now the page hero (the same photo as streetprint-02).
  "images/applications/townhomes": {
    lead: [
      "townhomes-20.jpg",
      "townhomes-14.jpg",
      "townhomes-19.jpg",
      "townhomes-22.jpg",
      "townhomes-07.jpg",
      "townhomes-21.jpg",
      "townhomes-13.jpg",
      "townhomes-18.png",
      "townhomes-10.jpg",
      "townhomes-11.jpg",
      "townhomes-05.png",
    ],
    hide: [],
    trail: [
      "townhomes-15.jpg", // red brick lane with diamond motif, same lane as townhomes-14 (portrait)
    ],
  },

  // Good fit overall: stamped roundabout aprons, medians, splitter islands, raised crossings, curb e
  // xtensions and school-zone legends. Roundabouts dominate (about 10 frames) and the covered-wagon 
  // roundabout appears twice (also in the streetbond gallery), so the pins alternate roundabouts wit
  // h medians and raised crossings. Three townhouse-driveway shots (traffic-calming-18, -23, -46) pl
  // us a few branded, regulatory or crew photos do not read as traffic calming and are flagged. Stan
  // 28 Sep 2026: traffic-calming-58 is now the page hero, and the lead avoids the photos that
  // open Regulatory Markings (-51, -04) and DuraTherm (duratherm-37). traffic-calming-03 is the
  // DuraTherm hero.
  "images/applications/traffic-calming": {
    lead: [
      "traffic-calming-11.jpg",
      "traffic-calming-48.jpg",
      "traffic-calming-38.jpg",
      "traffic-calming-09.jpg",
      "traffic-calming-49.jpg",
      "traffic-calming-29.jpg",
      "traffic-calming-07.jpg",
      "traffic-calming-57.jpg",
    ],
    hide: [],
    trail: [
      "traffic-calming-03.jpg", // the DuraTherm hero
      "traffic-calming-22.jpg", // covered-wagon roundabout (Okanagan), lower-res duplicate of traffic-calming-48
      "traffic-calming-20.jpg", // red SCHOOL ZONE legend, same road as traffic-calming-51
      "traffic-calming-46.jpg", // townhouse driveway with red stamped border, same as traffic-calming-18
      "traffic-calming-34.jpg", // Hwy 7 BRT station crossing, same series as traffic-calming-33
    ],
  },

  // Five of six images are under 800px and will be hidden; the only visible photo is the cross-poste
  // d ChipFill application shot. Owner needs 1200px+ AggreFill photos - the two-bag product shot (ag
  // grefill-chipfill-bags.jpg, 600px) and the pouring shot (aggrefill-01.jpg, 476px) would be the ri
  // ght leads if re-exported at full resolution.
  // 28 Sep 2026 (QA pa#19): AggreFill and ChipFill both open on chipfill-application, and still
  // do: everything AggreFill has of its own is 476px, and a 476px photo in the full-width
  // opening tile looks worse than the repeat. Needs HUB's own AggreFill photos at 1200px+.
  // The two-bag shot is supplier packaging, and chipfill-road-repair is the ChipFill hero.
  "images/products/aggrefill": {
    lead: [
      "chipfill-application.jpg",
      "aggrefill-03.jpg",
    ],
    hide: [
      "aggrefill-chipfill-bags.jpg", // supplier bags, not an installation
      "chipfill-road-repair.webp", // the ChipFill hero
    ],
    trail: [
      "aggrefill-01.jpg", // a supplier-branded bag is in frame
    ],
  },

  // Strong, clearly on-subject gallery with excellent hi-res leads (04 at 4032px, 11, 21). Red runwa
  // y-designation blocks are over-represented (8 of 18: 11, 12, 14, 15, 19, 20, 21, 22), so only two
  //  are in the top 8 and the extras are demoted. Five images (02, 03, 15, 19, 22) are under 800px a
  // nd hide automatically.
  // 28 Sep 2026 (QA pa#18): airmark-04 is now the page hero and airmark-01 is the Airports hero's
  // photo. The Airports gallery is five twins of AirMark photos (airports-26 = airmark-21,
  // -14 = -05, -07 = -07, -15 = -20), so those go last here and the two pages open differently.
  "images/products/airmark": {
    lead: [
      "airmark-11.jpg",
      "airmark-09.jpg",
      "airmark-13.jpg",
      "airmark-08.jpg",
      "airmark-14.jpg",
      "airmark-10.jpg",
      "airmark-12.jpg",
    ],
    hide: [],
    trail: [
      "airmark-01.jpg", // same photo as the Airports hero (airports-08)
      "airmark-21.jpg", // on Airports as airports-26
      "airmark-05.jpg", // on Airports as airports-14
      "airmark-07.jpg", // on Airports as airports-07
      "airmark-20.jpg", // on Airports as airports-15
    ],
  },

  // Six of eight images are under 800px and will be hidden, leaving just two visible: the hand-appli
  // cation shot (hero) and a very wide strip. The two-bag product shot (chipfill-aggrefill-bags.jpg,
  //  600px) would be a strong product hero if a higher-res original exists; owner should re-export 0
  // 1/02/03 and the bag photo at 1200px+.
  // 28 Sep 2026: the bag shot is supplier packaging, not an installation, and
  // aggrefill-application shows AggreFill poured beside a supplier-branded bag.
  "images/products/chipfill": {
    lead: [
      "chipfill-application.jpg",
      "chipfill-02.jpg",
      "chipfill-03.jpg",
      "chipfill-01.jpg",
      "chipfill-04.jpg",
    ],
    hide: [
      "chipfill-aggrefill-bags.jpg", // supplier bags, not an installation
      "aggrefill-application.webp", // AggreFill, with a supplier-branded bag in frame
    ],
    trail: [],
  },

  // Strong, on-subject gallery: logos, mascots, Indigenous medallions, playground games and safety d
  // ecals are all genuinely DecoMark. Over-represented projects are Little Italy The Drive (6 frames
  // ), the Waterloo Park drone series (3), the green sunburst park path (3) and the Anjou rink (3); 
  // one representative of each is kept forward and the rest pushed back. Standouts: decomark-39 (lar
  // ge Indigenous medallion), decomark-13 (Grizzly mascot), decomark-38 (Little Italy aerial), decom
  // 28 Sep 2026: decomark-05 (the tennis-club logo) opens Community Branding as
  // community-branding-12, so the City of Surrey logo from the Idea Book takes its place.
  "images/products/decomark": {
    lead: [
      "decomark-39.jpg",
      "decomark-13.jpg",
      "decomark-38.jpg",
      "decomark-69.jpg",
      "decomark-28.jpg",
      "decomark-43.jpg",
      "decomark-60.jpg",
      "decomark-12.jpg",
    ],
    hide: [],
    trail: [
      "decomark-01.jpg", // EV charging stall symbol, same site as decomark-02 (portrait, orange)
      "decomark-03.jpg", // '3+' path decal, same path as decomark-04
      "decomark-09.jpg", // Anjou Montreal outdoor rink, same project as decomark-08
      "decomark-51.jpg", // Anjou Montreal outdoor rink centre logo, same project as decomark-08
      "decomark-16.jpg", // Waterloo Park drone series, same flight as decomark-17
      "decomark-18.jpg", // Waterloo Park bridge lettering, wider frame of decomark-17
      "decomark-42.jpg", // Little Italy The Drive medallion at dusk, same project as decomark-38/35
      "decomark-45.jpg", // Little Italy geometric crosswalk, same intersection as decomark-38
      "decomark-52.jpg", // Little Italy medallion with crew, same project as decomark-38/35
      "decomark-74.jpg", // Little Italy medallion install, same project as decomark-38/35
      "decomark-70.jpg", // Terry Fox map surface (Quebec marker), same surface as decomark-69
      "decomark-61.jpg", // green sunburst logo on park path, same path as decomark-60
      "decomark-62.jpg", // green sunburst logo on park path, same path as decomark-60
      "decomark-30.jpg", // leaf decal on concrete path, same series as decomark-22
      "decomark-33.jpg", // Indigenous medallion with cobble ring, same series as decomark-31
    ],
  },

  // Good subject fit - uniform grey sealed parking lots, driveways and roads, no repeated projects. 
  // Two of ten (01, 08) are under 800px and drop out automatically, leaving exactly eight visible. B
  // est shots: 05 (wide grey road), 07 (estate driveway), 10 (aerial dealership lot).
  // 28 Sep 2026: durashield-11 is now the page hero, and durashield-09 is the same photo at 1200px.
  "images/products/durashield": {
    lead: [
      "durashield-05.jpg",
      "durashield-07.jpg",
      "durashield-12.jpg",
      "durashield-10.jpg",
      "durashield-06.jpg",
      "durashield-02.jpg",
      "durashield-04.jpg",
    ],
    hide: [
      "durashield-09.jpg", // a 1200px copy of the hero (durashield-11)
      "durashield-03.jpg", // US: a desert road with palo verde scrub, reads as the US Southwest
    ],
    trail: [],
  },

  // Good fit - inlaid patterns in asphalt throughout. The Steveston rope-pattern project appears ten
  //  times (duratherm-03, -15 to -23) and the overcast shopping-street brick crosswalks five times (
  // -07 to -11). Most of the gallery is 1024px orange; only ten images are 1200px+ (01, 02, 03, 05, 
  // 14, 29, 31, 32, 33, 34), so sourcing higher-res originals would help. Standouts: duratherm-33 (m
  // edallion crosswalk), duratherm-01 (yellow mosaic), duratherm-29 (LOOK crosswalk).
  // 28 Sep 2026: the page hero is now traffic-calming-03, the full-size original of duratherm-01.
  "images/products/duratherm": {
    lead: [
      "duratherm-37.jpg",
      "duratherm-33.jpg",
      "duratherm-03.jpg",
      "duratherm-02.jpg",
      "duratherm-29.jpg",
      "duratherm-14.jpg",
      "duratherm-34.jpg",
      "duratherm-32.jpg",
    ],
    hide: [
      "duratherm-01.jpg", // a 1280px crop of the hero photo
    ],
    trail: [
      "duratherm-15.jpg", // Steveston rope-pattern crosswalks, same project as duratherm-03
      "duratherm-16.jpg", // Steveston rope-pattern crosswalks, same project as duratherm-03
      "duratherm-17.jpg", // Steveston rope-pattern crosswalks, same project as duratherm-03
      "duratherm-18.jpg", // Steveston rope-pattern crosswalks, same project as duratherm-03
      "duratherm-19.jpg", // Steveston rope-pattern crosswalks, same project as duratherm-03
      "duratherm-20.jpg", // Steveston rope-pattern crosswalks, same project as duratherm-03
      "duratherm-21.jpg", // Steveston rope-pattern crosswalks, same project as duratherm-03
      "duratherm-22.jpg", // Steveston rope-pattern crosswalks, same project as duratherm-03
      "duratherm-23.jpg", // Steveston rope-pattern crosswalks, same project as duratherm-03
      "duratherm-08.jpg", // brick-pattern crosswalks on overcast shopping street, same project as duratherm-07
      "duratherm-09.jpg", // brick-pattern crosswalks on overcast shopping street, same project as duratherm-07
      "duratherm-10.jpg", // brick-pattern crosswalks on overcast shopping street, same project as duratherm-07
      "duratherm-11.jpg", // brick-pattern crosswalks on overcast shopping street, same project as duratherm-07
      "duratherm-13.jpg", // red brick inlay at parkade entry with green bike lane, same as duratherm-12
      "duratherm-05.jpg", // close-up of the yellow mosaic inlay shown in duratherm-01
      "duratherm-30.jpg", // hex pattern close-up, same as duratherm-28
      "duratherm-35.jpg", // grey/white brick pattern close-up, same as duratherm-25
      "duratherm-36.jpg", // grey/white brick pattern close-up, same as duratherm-25
      "duratherm-27.jpg", // hex crosswalk at the same retail plaza as duratherm-26
      "duratherm-31.jpg", // medallion-pattern crosswalk, same site as duratherm-33
    ],
  },

  // Only three images and two are usable (the repaired patch and the kit-in-bucket shot), so the pin
  // ned list is short by necessity. The gallery needs field photos - pothole before/during/after and
  //  application shots - to fill the seven visible tiles.
  // 28 Sep 2026: fastpatch-repaired is the page hero and carries a third-party copyright in its
  // EXIF; the pack shot is not an installation. The kit photo stays only because an empty folder
  // gallery falls back to lib/products.ts, which lists all three. Needs real HUB photos.
  "images/products/fast-patch": {
    lead: [
      "fastpatch-bucket.jpg",
    ],
    hide: [
      "fast-patch-01.png", // supplier pack shot on white, not an installation
    ],
    trail: [],
  },

  // Strong fit - red bus lanes and green bike lanes throughout, clearly MMA-type work. The BRT stati
  // on / stamped crosswalk site appears six times (mmax-08, -19, -22 to -25) and the same downtown c
  // orridor several more, so the demotes matter. Standouts: mmax-04 (BUS ONLY by the civic building)
  // , mmax-18 (cyclist beside bus lane) and mmax-01 (green lane with mural crosswalk).
  // 28 Sep 2026: mmax-04 stays the page hero; mmax-18 was a US photo (QA pa#6). The bike-lane
  // shots (mmax-09, -26) open Bike Lanes and mmax-06 is an Insights photo, so the lead is red
  // bus lanes, mostly from London's East Link corridor.
  "images/products/mmax": {
    lead: [
      "mmax-01.jpg",
      "mmax-08.jpg",
      "mmax-28.jpg",
      "mmax-20.jpg",
      "mmax-30.jpg",
      "mmax-32.jpg",
      "mmax-11.jpg",
    ],
    hide: [
      "mmax-18.jpg", // US: a Portland TriMet bus with an Oregon plate
    ],
    trail: [
      "mmax-19.jpg", // BRT station red lane with stamped crosswalk, same as mmax-08
      "mmax-22.jpg", // BRT station red lane with stamped crosswalk, same as mmax-08
      "mmax-23.jpg", // BRT station red lane with stamped crosswalk, same as mmax-08
      "mmax-24.jpg", // BRT station red lane with stamped crosswalk, same as mmax-08
      "mmax-25.jpg", // BRT station red lane with stamped crosswalk, same as mmax-08
      "mmax-27.jpg", // London Transit bus on red lane, same bus and site as mmax-05
      "mmax-29.jpg", // red/black hatched zone at building entry, same as mmax-28
      "mmax-16.jpg", // red MMA texture close-up (portrait), same surface as mmax-17
      "mmax-32.jpg", // downtown red bus lane beside stone civic building, same corridor as mmax-04
      "mmax-15.jpg", // downtown red bus lane beside stone civic building (portrait), same corridor as mmax-04
      "mmax-31.jpg", // two-way red bus lanes with stamped median (portrait), same as mmax-12
      "mmax-14.jpg", // BUS ONLY legend by condo towers (portrait), same corridor as mmax-21
      "mmax-03.jpg", // green park path (portrait), same path as mmax-02
    ],
  },

  // Small gallery (11 photos, one under 800px so ten usable). Fit is good: zebra crosswalks, SHARED 
  // LANE legend, bike symbol, arrows, 30KM/H legends. Three of the usable ten are install-in-progres
  // s shots with machinery (07, 08, 11) and there are two duplicate pairs (01/05, 07/08), so the top
  //  8 uses every distinct scene. Best: 02 (clean zebra crosswalk), 04 (shared-lane legend), 07 (gre
  // en bike symbol).
  // 28 Sep 2026: premark-02 was a US street (QA pa#6). premark-05 and -01 show the same hotel
  // crossing; -01 has cones and a dumpster in frame, so -05 is kept forward and -01 goes last.
  // premark-09 (a beach boardwalk, possibly US, unconfirmed) goes last too.
  "images/products/premark": {
    lead: [
      "premark-04.jpg",
      "premark-07.jpg",
      "premark-11.jpg",
      "premark-05.jpg",
      "premark-03.jpg",
      "premark-06.jpg",
      "premark-08.jpg",
    ],
    hide: [
      "premark-02.jpg", // US: a desert street with a US flag and a US billboard
    ],
    trail: [
      "premark-01.jpg", // hotel worksite with cones and a dumpster, same crossing as premark-05
      "premark-09.jpg", // beach boardwalk LOOK marking; the setting looks American, unconfirmed
    ],
  },

  // Excellent subject fit: colourful coated plazas, schoolyards, splash pads, courts, paths and stre
  // et murals. Over-represented projects are the orange park path (4 frames), the multicolour Vancou
  // ver patchwork plaza (4), the red cruise-pier boardwalk (6 incl. streetbond-92) and the UBC red-c
  // olumn plaza (3); these are demoted behind one representative each. Standouts: streetbond-58 (red
  // /white stripes to the Olympic Stadium), streetbond-82, streetbond-40 (schoolyard aerial), street
  // 28 Sep 2026 (QA pa#18): streetbond-58 is the same file as the LEED hero, so it no longer
  // opens this gallery. streetbond-19 is this page's hero. The lead avoids the schoolyard and
  // splash-pad photos that open Sport Courts and Splash Pads.
  "images/products/streetbond": {
    lead: [
      "streetbond-82.jpg",
      "streetbond-17.jpg",
      "streetbond-64.png",
      "streetbond-79.png",
      "streetbond-48.jpg",
      "streetbond-44.jpg",
      "streetbond-77.png",
    ],
    hide: [
      "streetbond-28.jpg", // US: EXIF GPS in Santa Monica, California (same file as playgrounds-39)
      "streetbond-45.jpg", // US: palms and a mission-style building, reads as California
      "streetbond-56.jpg", // EXIF names a third-party photographer as the copyright holder
      "streetbond-08.png", // US: Boston's Custom House Tower (under 800px, so already hidden)
      "streetbond-73.png", // US: Boston's Custom House Tower (under 800px, so already hidden)
    ],
    trail: [
      "streetbond-58.jpg", // the LEED hero (same file as leed-urban-heat-island-01)
      "streetbond-02.png", // GO station platform grey coating, same as streetbond-01
      "streetbond-04.png", // Canada Post depot lot, same as streetbond-03
      "streetbond-10.jpg", // orange park path by the playground, same as streetbond-09
      "streetbond-11.jpg", // orange park path by the playground, same as streetbond-09
      "streetbond-12.jpg", // orange park path by the playground, same as streetbond-09
      "streetbond-27.jpg", // Richmond Olympic Oval plaza, fisheye aerial of streetbond-23
      "streetbond-32.jpg", // red-column plaza (pale blue coating), same as streetbond-31
      "streetbond-34.jpg", // red-column plaza (pale blue coating), same as streetbond-31
      "streetbond-35.jpg", // red coated cruise-pier boardwalk with white stars, same as streetbond-50
      "streetbond-49.png", // red coated cruise-pier boardwalk, same site as streetbond-50 (ship dominates)
      "streetbond-51.jpg", // red coated cruise-pier boardwalk with white stars, same as streetbond-50
      "streetbond-52.jpg", // red coated cruise-pier boardwalk with white stars, same as streetbond-50
      "streetbond-92.jpg", // red coated waterfront pier, same site family as streetbond-50
      "streetbond-37.jpg", // striped grey/tan surface under the terminal canopy, same as streetbond-36
      "streetbond-41.jpg", // La Dauversiere schoolyard aerial, same as streetbond-40
      "streetbond-53.jpg", // yellow roundabout apron, same as streetbond-54
      "streetbond-63.png", // colourful splash pad with the blue-ring sprayer, same site as streetbond-42
      "streetbond-68.png", // schoolyard courts with orange/blue circles, same school as streetbond-70
      "streetbond-69.png", // schoolyard courts with orange/blue circles, same school as streetbond-70
      "streetbond-83.jpg", // multicolour patchwork plaza under the bridge, same as streetbond-82
      "streetbond-86.jpg", // multicolour patchwork plaza under the bridge, same as streetbond-82
      "streetbond-87.jpg", // multicolour patchwork plaza under the bridge, same as streetbond-82
      "streetbond-85.jpg", // blue wave courtyard, same as streetbond-84
      "streetbond-110.jpg", // labyrinth playground design, same as streetbond-100
    ],
  },

  // Only 8 images. The two light-grey parking lots (08 at 5472x3080 as hero, 06) are the only frames
  //  that read unmistakably as solar-reflective pavement; four of the eight are the same orange park
  //  path, so there are just five unique scenes. Pinned the five, demoted the three duplicate path a
  // ngles. The gallery needs more pale-grey/beige lot and plaza shots to fill a 7-tile opening view.
  // 28 Sep 2026: streetbondsr-02 is now the page hero (the Idea Book photo). The gallery no longer
  // opens on streetbondsr-08, a flat grey lot with weeds in the corner (QA pa#19); the other
  // shots of the hero's park come last.
  "images/products/streetbondsr": {
    lead: [
      "streetbondsr-06.jpg",
      "streetbondsr-01.png",
      "streetbondsr-04.jpg",
      "streetbondsr-08.jpg",
      "streetbondsr-07.jpg",
    ],
    hide: [],
    trail: [
      "streetbondsr-03.jpg", // orange coated park path with yellow shed, same park as streetbondsr-04
      "streetbondsr-05.jpg", // orange coated park path with playground, same park as streetbondsr-04
    ],
  },

  // Strong subject fit throughout - stamped driveways, plazas, medians and roundabouts. Over-represe
  // nted: the glass-storefront parking stalls (68-72, five shots), the red herringbone driveway (29-
  // 33, five), the red-ring roundabout (73-76, four) and the covered striped walkway (22-24, three).
  //  Standouts: 86 (gated estate driveway), 73 (roundabout), 45 (house driveway), 63 (pale grey heri
  // tage streetscape). Many originals are 4000px+ and could be downsized for the web.
  // 28 Sep 2026: streetprint-86 stays the page hero. streetprint-02 is the Townhomes hero,
  // streetprint-25 the Parking Lots hero, and streetprint-59 opens Public Spaces (as
  // public-spaces-44), so none of them leads here.
  "images/products/streetprint": {
    lead: [
      "streetprint-73.jpg",
      "streetprint-45.jpg",
      "streetprint-29.jpg",
      "streetprint-63.png",
      "streetprint-78.jpg",
      "streetprint-62.jpg",
      "streetprint-23.jpg",
    ],
    hide: [
      "streetprint-35.jpg", // Night shot; a crowd of cyclists lit by a flashlight is the main subject and the stamped surface is barely readable.
    ],
    trail: [
      "streetprint-02.jpg", // the Townhomes hero (same file as townhomes-16)
      "streetprint-25.jpg", // the Parking Lots hero
      "streetprint-30.jpg", // red herringbone driveway with hedges, same as streetprint-29
      "streetprint-31.jpg", // red herringbone driveway with hedges, same as streetprint-29
      "streetprint-32.jpg", // red herringbone driveway with hedges, same as streetprint-29
      "streetprint-33.jpg", // red herringbone driveway with hedges (portrait, leaves), same as streetprint-29
      "streetprint-69.jpg", // grey stamped parking stalls at glass storefront, same as streetprint-68
      "streetprint-70.jpg", // grey stamped parking stalls at glass storefront, same as streetprint-68
      "streetprint-71.jpg", // grey stamped parking stalls at glass storefront, same as streetprint-68
      "streetprint-72.jpg", // grey stamped parking stalls at glass storefront, same as streetprint-68
      "streetprint-74.jpg", // red-ring roundabout, same as streetprint-73
      "streetprint-75.jpg", // red-ring roundabout, same as streetprint-73
      "streetprint-76.jpg", // red stamped median at the same roundabout road, same as streetprint-73
      "streetprint-22.jpg", // covered walkway with striped stamped bands (portrait), same as streetprint-23
      "streetprint-24.jpg", // covered walkway with striped stamped bands, same as streetprint-23
      "streetprint-03.jpg", // grey herringbone townhome plaza, same as streetprint-02
      "streetprint-08.jpg", // house with red circle medallion driveway, same as streetprint-06
      "streetprint-13.jpg", // house with red circle medallion driveway, same as streetprint-06
      "streetprint-28.jpg", // tan/red path with decal at condos (portrait), same as streetprint-27
      "streetprint-36.jpg", // Surrey Memorial Hospital north entrance (portrait), same as streetprint-37
      "streetprint-51.jpg", // waterfront park path with planters, same as streetprint-50
      "streetprint-52.jpg", // waterfront park path with loungers (portrait), same as streetprint-50
      "streetprint-58.jpg", // red stamped pier with star decal (portrait), same as streetprint-59
    ],
  },

  // Good fit - decorative crosswalks and surface art dominate. Over-represented: the orange concentr
  // ic strip-mall crosswalk (6 shots incl. the aerial 45), the tan block crosswalk (7 shots, two of 
  // them rotated sideways), the schoolyard plaza fisheye series (5) and the park-path sun logo (3). 
  // Two sideways images (35, 39) need rotating or removal. Several DecoMark-type logo shots (Waterlo
  // o Park, UBC crest, sport court, rink) live here and may belong in decomark. Standouts: 10 (brick
  // 28 Sep 2026: traffic-patterns-87 is now the page hero; -22 and -62 are the same file as the
  // DecoMark hero (parks-paths-70).
  "images/products/traffic-patterns": {
    lead: [
      "traffic-patterns-10.jpg",
      "traffic-patterns-91.jpg",
      "traffic-patterns-26.jpg",
      "traffic-patterns-88.jpg",
      "traffic-patterns-05.jpg",
      "traffic-patterns-54.jpg",
      "traffic-patterns-12.jpg",
      "traffic-patterns-38.jpg",
      "traffic-patterns-53.jpg",
      "traffic-patterns-16.jpg",
    ],
    hide: [
    ],
    trail: [
      "traffic-patterns-22.jpg", // the DecoMark hero
      "traffic-patterns-62.jpg", // the DecoMark hero
      "traffic-patterns-25.jpg", // orange concentric-pattern crosswalks at wood-facade strip mall (portrait), same as traffic-patterns-26
      "traffic-patterns-50.jpg", // orange concentric-pattern crosswalks at wood-facade strip mall, same as traffic-patterns-26
      "traffic-patterns-52.jpg", // orange concentric-pattern crosswalks at wood-facade strip mall (Mark's), same as traffic-patterns-26
      "traffic-patterns-57.jpg", // orange concentric-pattern crosswalk at roadside, same project as traffic-patterns-26
      "traffic-patterns-45.jpg", // aerial of the same strip-mall plaza with orange crosswalk, same as traffic-patterns-26
      "traffic-patterns-27.jpg", // red brick crosswalk with white lines, close-up of traffic-patterns-10
      "traffic-patterns-36.jpg", // tan block crosswalk detail with cones, same as traffic-patterns-38
      "traffic-patterns-37.jpg", // tan block crosswalk install with machine and crew, same as traffic-patterns-38
      "traffic-patterns-40.jpg", // tan block crosswalk with white stripes, same as traffic-patterns-38
      "traffic-patterns-44.jpg", // tan block crosswalk close-up, same as traffic-patterns-38
      "traffic-patterns-70.jpg", // schoolyard plaza medallion install in progress (fisheye), same as traffic-patterns-11
      "traffic-patterns-71.jpg", // schoolyard plaza medallion install in progress (fisheye), same as traffic-patterns-11
      "traffic-patterns-72.jpg", // schoolyard plaza medallion install in progress (fisheye), same as traffic-patterns-11
      "traffic-patterns-80.jpg", // schoolyard plaza medallion nearly complete (fisheye), same as traffic-patterns-11
      "traffic-patterns-29.jpg", // green sun logo on park path, same as traffic-patterns-28
      "traffic-patterns-30.jpg", // green sun logo on park path (close-up), same as traffic-patterns-28
      "traffic-patterns-17.jpg", // Little Italy geometric crosswalk (portrait), same as traffic-patterns-12
      "traffic-patterns-55.jpg", // Little Italy geometric crosswalk (portrait), same as traffic-patterns-12
      "traffic-patterns-56.jpg", // burgundy/gold chevron crosswalk close-up, same as traffic-patterns-53
      "traffic-patterns-60.jpg", // burgundy/gold chevron crosswalk at storefront (orange), same as traffic-patterns-53
      "traffic-patterns-48.jpg", // UBC crest decal close-up, same as traffic-patterns-58
      "traffic-patterns-09.jpg", // UBC art crosswalk with bus (orange), same as traffic-patterns-08
      "traffic-patterns-04.jpg", // Waterloo Park bridge aerial, same as traffic-patterns-03
      "traffic-patterns-19.jpg", // outdoor rink markings with Anjou Montreal logo, same as traffic-patterns-18
    ],
  },

  // Strong subject fit: nearly every usable frame is a brick-pattern crosswalk, intersection or tran
  // sit plaza. Heavy over-representation of the red-surface rapidway zebra series (49-54, six frames
  // ), the Granville Island crosswalk (34/35/42/45/46), the RBC/Winners retail plaza (55-61, seven f
  // rames, several dominated by big-box signage) and the GRT transit plaza (62-65). Big-box storefro
  // nt shots (Walmart, Home Depot, Fortinos, Winners) are excluded for branding; the owner may want 
  // 28 Sep 2026 (QA pa#19): no longer opens on traffic-patterns-xd-82, cracked concrete in the
  // foreground. -70 is the same file as the Crosswalks hero.
  "images/products/traffic-patterns-xd": {
    lead: [
      "traffic-patterns-xd-90.jpg",
      "traffic-patterns-xd-41.jpg",
      "traffic-patterns-xd-62.jpg",
      "traffic-patterns-xd-28.jpg",
      "traffic-patterns-xd-142.jpg",
      "traffic-patterns-xd-20.jpg",
      "traffic-patterns-xd-23.jpg",
      "traffic-patterns-xd-13.jpg",
    ],
    hide: [
      // Doug, May 2026, on this exact photo: "This is TrafficPatterns, not
      // TPXD ( there's no stamping )". Vern confirmed the rule in September:
      // XD is stamped, TrafficPatterns is not. The frame is a flat chevron
      // graphic on smooth asphalt outside a Safeway — no relief, no brick
      // texture — so it is TP work sitting in the XD gallery. Hidden here
      // rather than moved: it probably belongs in images/products/
      // traffic-patterns/, but only Doug can confirm that, and a wrong move
      // is harder to spot than a missing photo.
      "traffic-patterns-xd-01.jpg",
      "traffic-patterns-xd-36.jpg", // Outlet mall with J.Crew / Tommy Hilfiger signage and pedestrians facing camera; third-party branding
      "traffic-patterns-xd-56.jpg", // Blue car with licence plate fills the foreground; vehicle is the main subject
    ],
    trail: [
      "traffic-patterns-xd-82.jpg", // cracked concrete fills the foreground
      "traffic-patterns-xd-70.jpg", // the Crosswalks hero (same file as crosswalks-09)
      "traffic-patterns-xd-11.jpg", // branding in frame — kept, shown last: Walmart Supercentre signage dominates the frame; third-party branding
      "traffic-patterns-xd-134.jpg", // branding in frame — kept, shown last: Same Walmart frame at lower resolution; third-party branding
      "traffic-patterns-xd-35.jpg", // branding in frame — kept, shown last: 'Granville Island Brewing' signage dominates; third-party branding
      "traffic-patterns-xd-58.jpg", // branding in frame — kept, shown last: Winners storefront is the main subject; third-party branding
      "traffic-patterns-xd-59.jpg", // branding in frame — kept, shown last: Winners storefront with planters is the main subject; third-party branding
      "traffic-patterns-xd-74.jpg", // branding in frame — kept, shown last: The Home Depot signage spans the top of the frame; third-party branding
      "traffic-patterns-xd-75.jpg", // branding in frame — kept, shown last: The Home Depot storefront is the main subject; third-party branding
      "traffic-patterns-xd-93.jpg", // branding in frame — kept, shown last: 'Alpha Oil Inc.' branded tanker truck fills half the frame; third-party branding
      "traffic-patterns-xd-119.jpg", // branding in frame — kept, shown last: Fortinos storefront signage dominates; third-party branding
      "traffic-patterns-xd-120.jpg", // branding in frame — kept, shown last: Fortinos signage dominates; third-party branding
      "traffic-patterns-xd-22.jpg", // yellow/green brick crosswalk, same as traffic-patterns-xd-21
      "traffic-patterns-xd-24.jpg", // grey/yellow plaza crossing, same site as traffic-patterns-xd-23
      "traffic-patterns-xd-25.jpg", // grey paver plaza under construction, same site as traffic-patterns-xd-23
      "traffic-patterns-xd-29.jpg", // red BUS ONLY rapidway with white brick crosswalk, same as traffic-patterns-xd-41
      "traffic-patterns-xd-42.jpg", // Granville Island red brick crosswalk, same site as traffic-patterns-xd-34
      "traffic-patterns-xd-45.jpg", // Granville Island crosswalk with cement truck, same site as traffic-patterns-xd-34
      "traffic-patterns-xd-46.jpg", // Granville Island crosswalk with cyclist, same site as traffic-patterns-xd-34
      "traffic-patterns-xd-47.jpg", // City Market red brick crosswalk, same as traffic-patterns-xd-02
      "traffic-patterns-xd-44.jpg", // downtown red/white brick corner with van, same as traffic-patterns-xd-43
      "traffic-patterns-xd-50.jpg", // red rapidway with white brick zebra, same business-park corridor as traffic-patterns-xd-49
      "traffic-patterns-xd-51.jpg", // red rapidway with white brick zebra, same corridor as traffic-patterns-xd-49
      "traffic-patterns-xd-52.jpg", // red rapidway zebra with black car, same corridor as traffic-patterns-xd-49
      "traffic-patterns-xd-53.jpg", // red rapidway zebra with blue glass tower, same corridor as traffic-patterns-xd-49
      "traffic-patterns-xd-54.jpg", // red rapidway zebra with cars, same corridor as traffic-patterns-xd-49
      "traffic-patterns-xd-55.jpg", // RBC/Winners retail plaza red brick crosswalk, same plaza as traffic-patterns-xd-61
      "traffic-patterns-xd-57.jpg", // RBC/Winners retail plaza red brick crosswalk, same plaza as traffic-patterns-xd-61
      "traffic-patterns-xd-60.jpg", // RBC/Winners retail plaza with planters, same plaza as traffic-patterns-xd-61
      "traffic-patterns-xd-63.jpg", // GRT bus on herringbone transit plaza, same site as traffic-patterns-xd-62
      "traffic-patterns-xd-64.jpg", // herringbone transit plaza with car, same site as traffic-patterns-xd-62
      "traffic-patterns-xd-65.jpg", // GRT bus close on transit plaza, same site as traffic-patterns-xd-62
      "traffic-patterns-xd-68.jpg", // beige brick crosswalk with red Zum bus, same intersection as traffic-patterns-xd-67
      "traffic-patterns-xd-136.jpg", // beige brick crosswalk with bus and glass office, same intersection as traffic-patterns-xd-67
      "traffic-patterns-xd-71.jpg", // black/grey checkerboard crosswalk, same as traffic-patterns-xd-69
      "traffic-patterns-xd-87.jpg", // red/white brick crosswalk flat close-up, same condo street as traffic-patterns-xd-86
      "traffic-patterns-xd-88.jpg", // pedestrian legs on red/white brick crosswalk, same condo street as traffic-patterns-xd-86
      "traffic-patterns-xd-95.jpg", // semi trucks on red/white crosswalk by towers, same as traffic-patterns-xd-94
      "traffic-patterns-xd-117.jpg", // transit plaza panorama, same as traffic-patterns-xd-116
      "traffic-patterns-xd-122.jpg", // grey/white brick crosswalk, same as traffic-patterns-xd-121
      "traffic-patterns-xd-123.jpg", // grey paver plaza with yellow tactile strip, same site as traffic-patterns-xd-08
      "traffic-patterns-xd-143.jpg", // yellow-on-grey brick crosswalk, same as traffic-patterns-xd-142
    ],
  },
};
