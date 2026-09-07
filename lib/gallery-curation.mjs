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
 *           file stays on disk; delete the line to re-admit it.
 *   trail — shown LAST: extra angles of a scene already represented, and
 *           real HUB work where a third-party storefront sign dominates the
 *           frame (Walmart, Home Depot, Fortinos…). Kept, because they are
 *           real installations; buried, because they should not be the
 *           first thing a specifier sees.
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
  "images/applications/airports": {
    lead: [
      "airports-10.jpg",
      "airports-15.jpg",
      "airports-08.jpg", // 2016px twin of airports-01 (see gallery-near-dupes.mjs)
      "airports-26.jpg",
      "airports-07.jpg", // 2016px twin of airports-03
      "airports-14.jpg", // 3264px twin of airports-02
      "airports-20.png",
      "airports-04.jpg",
    ],
    hide: [],
    trail: [],
  },

  // Good subject fit, but the set is dominated by 1536x2048 portrait phone shots of one residential 
  // green-lane project (16 to 24), and the downtown bike-box intersection appears four times (09, 10
  // , 30, 31). Only about a dozen landscape 1200px+ frames exist. Standouts: bike-lanes-01 (cyclist 
  // through the bike box), bike-lanes-11 (bridge), bike-lanes-12 (red bus + green bike lane).
  "images/applications/bike-lanes": {
    lead: [
      "bike-lanes-01.jpg",
      "bike-lanes-11.jpg",
      "bike-lanes-12.jpg",
      "bike-lanes-29.jpg",
      "bike-lanes-31.jpg",
      "bike-lanes-32.png",
      "bike-lanes-05.jpg",
      "bike-lanes-07.jpg",
    ],
    hide: [],
    trail: [
      "bike-lanes-04.jpg", // green lanes on the same bridge as bike-lanes-11
      "bike-lanes-09.jpg", // downtown green bike box intersection with SUV/BMW, same as bike-lanes-31
      "bike-lanes-10.jpg", // downtown green bike box intersection with SUV/BMW, same as bike-lanes-31
      "bike-lanes-30.jpg", // downtown green bike box intersection with SUV/BMW, same as bike-lanes-31
      "bike-lanes-28.jpg", // green triangle at the same corner as bike-lanes-27
      "bike-lanes-21.jpg", // green lane with white squares, same as bike-lanes-17
      "bike-lanes-35.jpg", // green box beside yellow markings, same as bike-lanes-06
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
  "images/applications/bus-lanes": {
    lead: [
      "bus-lanes-37.png",
      "bus-lanes-22.jpg",
      "bus-lanes-08.jpg",
      "bus-lanes-17.jpg",
      "bus-lanes-13.jpg",
      "bus-lanes-39.png",
      "bus-lanes-11.jpg",
      "bus-lanes-32.jpg",
    ],
    hide: [],
    trail: [
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
      "bus-lanes-24.jpg", // red stamped terminal apron with arrow, same as bus-lanes-01
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
  "images/applications/commercial-spaces": {
    lead: [
      "commercial-spaces-51.jpg",
      "commercial-spaces-08.jpg",
      "commercial-spaces-16.jpg",
      "commercial-spaces-91.jpg",
      "commercial-spaces-111.jpg",
      "commercial-spaces-67.jpg",
      "commercial-spaces-84.jpg",
      "commercial-spaces-32.jpg",
    ],
    hide: [
      "commercial-spaces-18.jpg", // Aerial of the Waterloo Park pedestrian bridge (park-name lettering decal); a public park, not a commercial space.
      "commercial-spaces-105.jpg", // Elementary-school playground with flower decals (school sign readable); playground/school, off-subject for commercial spaces.
      "commercial-spaces-77.jpg", // Bike-lane application shot (striping machine laying a blue lane and symbol on a street); no commercial context.
    ],
    trail: [
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
  "images/applications/community-branding": {
    lead: [
      "community-branding-04.jpg",
      "community-branding-03.jpg",
      "community-branding-09.jpg",
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
  "images/applications/crosswalks": {
    lead: [
      "crosswalks-02.jpg",
      "crosswalks-33.jpg",
      "crosswalks-55.jpg",
      "crosswalks-12.jpg",
      "crosswalks-92.jpg",
      "crosswalks-86.jpg",
      "crosswalks-105.jpg",
      "crosswalks-107.jpg",
    ],
    hide: [
      "crosswalks-29.jpg", // off-subject: aerial of a basketball court with a logo (Waterloo Park), no crosswalk
      "crosswalks-30.jpg", // off-subject: aerial of a park pathway with logo roundels, no crosswalk
      "crosswalks-31.jpg", // off-subject: aerial of the Waterloo Park bridge/path lettering, no crosswalk
      "crosswalks-32.jpg", // off-subject: second aerial of the same Waterloo Park bridge/path, no crosswalk
    ],
    trail: [
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
  "images/applications/leed-urban-heat-island": {
    lead: [
      "streetbondsr-08.jpg",
      "streetbondsr-06.jpg",
      "leed-urban-heat-island-01.jpg",
      "streetbondsr-01.png",
      "streetbondsr-07.jpg",
      "leed-urban-heat-island-02.jpg",
    ],
    hide: [],
    trail: [],
  },

  // Good subject fit overall: sealed lots, stalls, accessible symbols, EV stalls and stamped retail 
  // crossings. Two projects are over-represented - the fenced brick-building lot (parking-lots-06 to
  //  -10, -18) and the Winners/RBC chimney plaza (-34 to -37, -51). Standouts are the waterfront aer
  // ial -19, the clean DuraShield lot -04 and the green EV stall -01. Several images lean on big-box
  //  store signage (Home Depot, Lowe's, Walmart, Fortinos, Shoppers); the owner should decide whethe
  "images/applications/parking-lots": {
    lead: [
      "parking-lots-19.jpg",
      "parking-lots-04.jpg",
      "parking-lots-01.jpg",
      "parking-lots-34.jpg",
      "parking-lots-12.jpg",
      "parking-lots-14.jpg",
      "parking-lots-11.jpg",
      "parking-lots-21.jpg",
    ],
    hide: [
      "parking-lots-50.jpg", // Privacy: parked car with a readable front licence plate fills half the frame; the red stamped path is secondary.
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
  "images/applications/parks-paths": {
    lead: [
      "parks-paths-48.jpg",
      "parks-paths-09.jpg",
      "parks-paths-134.jpg",
      "parks-paths-125.jpg",
      "parks-paths-132.jpg",
      "parks-paths-118.jpg",
      "parks-paths-38.jpg",
      "parks-paths-17.jpg",
    ],
    hide: [
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
    ],
    trail: [
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
  "images/applications/pedestrian-safety": {
    lead: [
      "crosswalks-03.jpg",
      "crosswalks-107.jpg",
      "crosswalks-115.png",
      "crosswalks-33.jpg",
      "crosswalks-16.jpg",
      "crosswalks-45.jpg",
      "crosswalks-78.jpg",
      "traffic-patterns-xd-139.jpg",
    ],
    hide: [
      "crosswalks-31.jpg", // Off-subject: Waterloo Park bridge drone shot; a park path, no crosswalk or pedestrian-safety feature
    ],
    trail: [
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
      "playgrounds-33.jpg",
      "playgrounds-52.jpg",
      "playgrounds-17.jpg",
      "playgrounds-10.jpg",
      "playgrounds-39.jpg",
      "playgrounds-11.jpg",
      "playgrounds-05.jpg",
      "playgrounds-35.jpg",
    ],
    hide: [
      "playgrounds-38.jpg", // Off-subject: Waterloo Park bridge drone shot; a park path, no playground content
      "playgrounds-49.jpg", // Off-subject: UBC/Musqueam campus crosswalk with pedestrians; not a playground
      "playgrounds-51.jpg", // Off-subject: plain stamped pathway, no playground content (portrait)
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
  "images/applications/private-driveways": {
    lead: [
      "residential-driveways-18.jpg",
      "residential-driveways-02.jpg",
      "residential-driveways-11.jpg",
      "residential-driveways-03.jpg",
      "residential-driveways-21.jpg",
      "residential-driveways-07.jpg",
      "residential-driveways-42.jpg",
      "residential-driveways-10.jpg",
    ],
    hide: [],
    trail: [
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
  "images/applications/public-art": {
    lead: [
      "community-branding-02.jpg",
      "community-branding-09.jpg",
      "community-branding-10.jpg",
      "community-branding-13.jpg",
      "community-branding-14.jpg",
      "community-branding-03.jpg",
      "community-branding-11.jpg",
      "community-branding-04.jpg",
    ],
    hide: [],
    trail: [
      "community-branding-07.jpg", // Yates St. wayfinding block (yellow 3), same project as community-branding-05
      "community-branding-08.jpg", // Yates St. wayfinding block (green 4), same project as community-branding-05
    ],
  },

  // Good subject fit overall: plazas, campus and transit streetscapes, waterfront promenades and mur
  // al laneways. The Ogden Point / marina red promenade appears four times and the transit exchange 
  // three times, so extras are pushed back. Two frames (public-spaces-11 and -25) are stored sideway
  // s and should be re-saved upright; public-spaces-01 (colourful laneway), -44 (red promenade) and 
  // -29 (UBC mural crosswalk) are the standouts.
  "images/applications/public-spaces": {
    lead: [
      "public-spaces-01.jpg",
      "public-spaces-44.jpg",
      "public-spaces-29.png",
      "public-spaces-07.jpg",
      "public-spaces-31.png",
      "public-spaces-09.png",
      "public-spaces-40.jpg",
      "public-spaces-39.jpg",
    ],
    hide: [
      "public-spaces-11.png", // Unusable: image is rotated 90 degrees (displays sideways); needs re-orienting before use
      "public-spaces-25.png", // Unusable: image is rotated 90 degrees (displays sideways); orange size as well
      "public-spaces-23.png", // Third-party branding: Tanger Outlets directory sign listing retail brands dominates the frame; pavement is secondary
    ],
    trail: [
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
  "images/applications/regulatory-markings": {
    lead: [
      "premark-02.jpg",
      "premark-11.jpg",
      "premark-06.jpg",
      "premark-04.jpg",
      "premark-09.jpg",
      "traffic-calming-51.jpg",
      "commercial-spaces-87.jpg",
      "traffic-calming-43.png",
      "traffic-calming-21.jpg",
      "traffic-calming-04.jpg",
      "traffic-calming-32.jpg",
      "traffic-calming-44.jpg",
      "traffic-calming-08.jpg",
    ],
    hide: [
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
    ],
  },

  // Excellent fit and plenty of 3000px+ originals. The long red-brick driveway with the stone wall i
  // s shot three times (-33, -43, -44) and the castle twice (-26, -35). Standouts: -18 (dusk house w
  // ith medallion), -02 (large house, brick driveway), -11 (gate in fall colour), -03 (aerial medall
  // ion). Six images are portrait (04, 05, 15, 16, 19, 23) - fine in the grid, avoided for the hero.
  "images/applications/residential-driveways": {
    lead: [
      "residential-driveways-18.jpg",
      "residential-driveways-02.jpg",
      "residential-driveways-11.jpg",
      "residential-driveways-03.jpg",
      "residential-driveways-21.jpg",
      "residential-driveways-07.jpg",
      "residential-driveways-33.jpg",
      "residential-driveways-10.jpg",
    ],
    hide: [],
    trail: [
      "residential-driveways-43.jpg", // long curving red-brick driveway with stone retaining wall, same as residential-driveways-33
      "residential-driveways-44.jpg", // long curving red-brick driveway with stone retaining wall, same as residential-driveways-33
      "residential-driveways-35.jpg", // stone castle driveway, same building as residential-driveways-26
    ],
  },

  // One of the strongest galleries: everything is clearly a splash pad, 17 of 18 are 1200px+ (most a
  // t 4000px) and colour schemes vary widely. Only two repeated projects (09/10, 15/16). Hero 01 is 
  // native 16:9 with shade sails, spray arches and boulders; 02 is the only shot with water actually
  //  spraying.
  "images/applications/splash-pads": {
    lead: [
      "splash-pads-01.jpg",
      "splash-pads-07.jpg",
      "splash-pads-02.jpg",
      "splash-pads-06.jpg",
      "splash-pads-10.jpg",
      "splash-pads-11.png",
      "splash-pads-13.jpg",
      "splash-pads-05.jpg",
    ],
    hide: [],
    trail: [
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
      "sport-courts-14.jpg",
      "sport-courts-06.jpg",
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
  "images/applications/townhomes": {
    lead: [
      "townhomes-14.jpg",
      "townhomes-07.jpg",
      "townhomes-13.jpg",
      "townhomes-18.png",
      "townhomes-16.jpg",
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
  "images/applications/traffic-calming": {
    lead: [
      "traffic-calming-11.jpg",
      "traffic-calming-09.jpg",
      "traffic-calming-49.jpg",
      "traffic-calming-48.jpg",
      "traffic-calming-29.jpg",
      "traffic-calming-51.jpg",
      "traffic-calming-04.jpg",
      "traffic-calming-26.jpg",
    ],
    hide: [],
    trail: [
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
  "images/products/aggrefill": {
    lead: [
      "chipfill-application.jpg",
    ],
    hide: [],
    trail: [],
  },

  // Strong, clearly on-subject gallery with excellent hi-res leads (04 at 4032px, 11, 21). Red runwa
  // y-designation blocks are over-represented (8 of 18: 11, 12, 14, 15, 19, 20, 21, 22), so only two
  //  are in the top 8 and the extras are demoted. Five images (02, 03, 15, 19, 22) are under 800px a
  // nd hide automatically.
  "images/products/airmark": {
    lead: [
      "airmark-04.jpg",
      "airmark-11.jpg",
      "airmark-01.jpg",
      "airmark-09.jpg",
      "airmark-21.jpg",
      "airmark-05.jpg",
      "airmark-07.jpg",
      "airmark-14.jpg",
    ],
    hide: [],
    trail: [
      "airmark-12.jpg", // 24R-06L red runway designation block, same as airmark-14
      "airmark-20.jpg", // 13-31 red runway designation, same project as airmark-11
      "airmark-13.jpg", // yellow taxiway holding-position lines, same apron as airmark-04
      "airmark-10.jpg", // red stop octagon with aircraft symbol, same marking as airmark-01
    ],
  },

  // Six of eight images are under 800px and will be hidden, leaving just two visible: the hand-appli
  // cation shot (hero) and a very wide strip. The two-bag product shot (chipfill-aggrefill-bags.jpg,
  //  600px) would be a strong product hero if a higher-res original exists; owner should re-export 0
  // 1/02/03 and the bag photo at 1200px+.
  "images/products/chipfill": {
    lead: [
      "chipfill-application.jpg",
      "chipfill-04.jpg",
    ],
    hide: [],
    trail: [],
  },

  // Strong, on-subject gallery: logos, mascots, Indigenous medallions, playground games and safety d
  // ecals are all genuinely DecoMark. Over-represented projects are Little Italy The Drive (6 frames
  // ), the Waterloo Park drone series (3), the green sunburst park path (3) and the Anjou rink (3); 
  // one representative of each is kept forward and the rest pushed back. Standouts: decomark-39 (lar
  // ge Indigenous medallion), decomark-13 (Grizzly mascot), decomark-38 (Little Italy aerial), decom
  "images/products/decomark": {
    lead: [
      "decomark-39.jpg",
      "decomark-13.jpg",
      "decomark-38.jpg",
      "decomark-69.jpg",
      "decomark-28.jpg",
      "decomark-05.jpg",
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
  "images/products/durashield": {
    lead: [
      "durashield-05.jpg",
      "durashield-07.jpg",
      "durashield-10.jpg",
      "durashield-03.jpg",
      "durashield-06.jpg",
      "durashield-09.jpg",
      "durashield-02.jpg",
      "durashield-04.jpg",
    ],
    hide: [],
    trail: [],
  },

  // Good fit - inlaid patterns in asphalt throughout. The Steveston rope-pattern project appears ten
  //  times (duratherm-03, -15 to -23) and the overcast shopping-street brick crosswalks five times (
  // -07 to -11). Most of the gallery is 1024px orange; only ten images are 1200px+ (01, 02, 03, 05, 
  // 14, 29, 31, 32, 33, 34), so sourcing higher-res originals would help. Standouts: duratherm-33 (m
  // edallion crosswalk), duratherm-01 (yellow mosaic), duratherm-29 (LOOK crosswalk).
  "images/products/duratherm": {
    lead: [
      "duratherm-33.jpg",
      "duratherm-01.jpg",
      "duratherm-03.jpg",
      "duratherm-02.jpg",
      "duratherm-29.jpg",
      "duratherm-14.jpg",
      "duratherm-34.jpg",
      "duratherm-32.jpg",
    ],
    hide: [],
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
  "images/products/fast-patch": {
    lead: [
      "fastpatch-repaired.jpg",
      "fastpatch-bucket.jpg",
    ],
    hide: [],
    trail: [],
  },

  // Strong fit - red bus lanes and green bike lanes throughout, clearly MMA-type work. The BRT stati
  // on / stamped crosswalk site appears six times (mmax-08, -19, -22 to -25) and the same downtown c
  // orridor several more, so the demotes matter. Standouts: mmax-04 (BUS ONLY by the civic building)
  // , mmax-18 (cyclist beside bus lane) and mmax-01 (green lane with mural crosswalk).
  "images/products/mmax": {
    lead: [
      "mmax-04.jpg",
      "mmax-18.jpg",
      "mmax-01.jpg",
      "mmax-08.jpg",
      "mmax-20.jpg",
      "mmax-06.jpg",
      "mmax-26.jpg",
      "mmax-09.jpg",
    ],
    hide: [],
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
  "images/products/premark": {
    lead: [
      "premark-02.jpg",
      "premark-04.jpg",
      "premark-07.jpg",
      "premark-01.jpg",
      "premark-11.jpg",
      "premark-09.jpg",
      "premark-06.jpg",
      "premark-03.jpg",
    ],
    hide: [],
    trail: [
      "premark-05.jpg", // zebra crosswalk at hotel construction site (portrait), same as premark-01
      "premark-08.jpg", // green bike-lane install with striping machine, same as premark-07
    ],
  },

  // Excellent subject fit: colourful coated plazas, schoolyards, splash pads, courts, paths and stre
  // et murals. Over-represented projects are the orange park path (4 frames), the multicolour Vancou
  // ver patchwork plaza (4), the red cruise-pier boardwalk (6 incl. streetbond-92) and the UBC red-c
  // olumn plaza (3); these are demoted behind one representative each. Standouts: streetbond-58 (red
  // /white stripes to the Olympic Stadium), streetbond-82, streetbond-40 (schoolyard aerial), street
  "images/products/streetbond": {
    lead: [
      "streetbond-58.jpg",
      "streetbond-82.jpg",
      "streetbond-40.jpg",
      "streetbond-17.jpg",
      "streetbond-42.jpg",
      "streetbond-19.jpg",
      "streetbond-79.png",
      "streetbond-48.jpg",
    ],
    hide: [],
    trail: [
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
  "images/products/streetbondsr": {
    lead: [
      "streetbondsr-08.jpg",
      "streetbondsr-06.jpg",
      "streetbondsr-01.png",
      "streetbondsr-04.jpg",
      "streetbondsr-07.jpg",
    ],
    hide: [],
    trail: [
      "streetbondsr-02.jpg", // orange coated park path with shelter, same park as streetbondsr-04
      "streetbondsr-03.jpg", // orange coated park path with yellow shed, same park as streetbondsr-04
      "streetbondsr-05.jpg", // orange coated park path with playground, same park as streetbondsr-04
    ],
  },

  // Strong subject fit throughout - stamped driveways, plazas, medians and roundabouts. Over-represe
  // nted: the glass-storefront parking stalls (68-72, five shots), the red herringbone driveway (29-
  // 33, five), the red-ring roundabout (73-76, four) and the covered striped walkway (22-24, three).
  //  Standouts: 86 (gated estate driveway), 73 (roundabout), 45 (house driveway), 63 (pale grey heri
  // tage streetscape). Many originals are 4000px+ and could be downsized for the web.
  "images/products/streetprint": {
    lead: [
      "streetprint-86.jpg",
      "streetprint-73.jpg",
      "streetprint-45.jpg",
      "streetprint-29.jpg",
      "streetprint-02.jpg",
      "streetprint-63.png",
      "streetprint-78.jpg",
      "streetprint-59.jpg",
    ],
    hide: [
      "streetprint-35.jpg", // Night shot; a crowd of cyclists lit by a flashlight is the main subject and the stamped surface is barely readable.
    ],
    trail: [
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
  "images/products/traffic-patterns": {
    lead: [
      "traffic-patterns-10.jpg",
      "traffic-patterns-26.jpg",
      "traffic-patterns-05.jpg",
      "traffic-patterns-54.jpg",
      "traffic-patterns-12.jpg",
      "traffic-patterns-38.jpg",
      "traffic-patterns-53.jpg",
      "traffic-patterns-16.jpg",
    ],
    hide: [
      "traffic-patterns-35.jpg", // Image is rotated 90 degrees (sideways) - the horizon runs vertically; needs rotating before it can show.
      "traffic-patterns-39.jpg", // Image is rotated 90 degrees (sideways) - houses lie on their side; needs rotating before it can show.
    ],
    trail: [
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
  "images/products/traffic-patterns-xd": {
    lead: [
      "traffic-patterns-xd-82.jpg",
      "traffic-patterns-xd-41.jpg",
      "traffic-patterns-xd-13.jpg",
      "traffic-patterns-xd-49.jpg",
      "traffic-patterns-xd-28.jpg",
      "traffic-patterns-xd-62.jpg",
      "traffic-patterns-xd-90.jpg",
      "traffic-patterns-xd-142.jpg",
    ],
    hide: [
      "traffic-patterns-xd-36.jpg", // Outlet mall with J.Crew / Tommy Hilfiger signage and pedestrians facing camera; third-party branding
      "traffic-patterns-xd-56.jpg", // Blue car with licence plate fills the foreground; vehicle is the main subject
    ],
    trail: [
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
