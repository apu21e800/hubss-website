# Asset Inventory — hubss-website

_Regenerate with `npm run assets:inventory`. Generated into docs/ASSET-INVENTORY.md._

Folder-driven galleries: product + application galleries are the contents of
their folders (see `docs/ASSETS.md`). Add/delete files there; heroes are set
in `lib/products.ts` / `lib/applications.ts`.

| Folder | Files | MB | Used by |
|---|---:|---:|---|
| images/_featured | 0 | 0.0 | Featured-image overrides (lib/featured-images.ts) |
| images/about | 1 | 0.0 | About page |
| images/applications | 1 | 0.4 | Application pages — hero from lib/applications.ts; gallery = folder scan |
| &nbsp;&nbsp;└ images/applications/airports | 28 | 19.0 |  |
| &nbsp;&nbsp;└ images/applications/bike-lanes | 38 | 44.4 |  |
| &nbsp;&nbsp;└ images/applications/bus-lanes | 40 | 89.3 |  |
| &nbsp;&nbsp;└ images/applications/commercial-spaces | 115 | 63.6 |  |
| &nbsp;&nbsp;└ images/applications/community-branding | 14 | 12.9 |  |
| &nbsp;&nbsp;└ images/applications/crosswalks | 123 | 222.6 |  |
| &nbsp;&nbsp;└ images/applications/leed-urban-heat-island | 2 | 2.9 |  |
| &nbsp;&nbsp;└ images/applications/parking-lots | 59 | 45.3 |  |
| &nbsp;&nbsp;└ images/applications/parks-paths | 144 | 279.4 |  |
| &nbsp;&nbsp;└ images/applications/playgrounds | 53 | 145.2 |  |
| &nbsp;&nbsp;└ images/applications/public-spaces | 67 | 115.0 |  |
| &nbsp;&nbsp;└ images/applications/residential-driveways | 44 | 69.1 |  |
| &nbsp;&nbsp;└ images/applications/splash-pads | 19 | 36.2 |  |
| &nbsp;&nbsp;└ images/applications/sport-courts | 21 | 42.8 |  |
| &nbsp;&nbsp;└ images/applications/townhomes | 18 | 27.2 |  |
| &nbsp;&nbsp;└ images/applications/traffic-calming | 56 | 59.0 |  |
| images/assets | 0 | 0.0 | Misc legacy assets (logos, installation exports) — prune candidate |
| images/blog | 2 | 0.2 | Blog posts — featuredImage frontmatter + inline MDX refs (one folder per post slug) |
| &nbsp;&nbsp;└ images/blog/bc-childrens-hospital-labyrinth | 2 | 0.4 |  |
| &nbsp;&nbsp;└ images/blog/best-crosswalks-canada | 1 | 0.3 |  |
| &nbsp;&nbsp;└ images/blog/bowen-island-asphalt-path | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/branded-crosswalks-vancouver-richmond | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/commercial-applications | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/community-branding-case-study | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/community-spaces | 1 | 0.1 |  |
| &nbsp;&nbsp;└ images/blog/complete-streets-new-westminster | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/cycling-transit-integration-surface-solutions | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/decorative-asphalt-crosswalks | 1 | 0.1 |  |
| &nbsp;&nbsp;└ images/blog/decorative-asphalt-high-traffic | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/decorative-crosswalk-commercial-drive | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/decorative-crosswalk-meridian | 1 | 0.1 |  |
| &nbsp;&nbsp;└ images/blog/decorative-crosswalks-community-identity | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/decorative-hardscape-grey-is-new-black | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/decorative-paving-solutions | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/durable-coatings-waterparks | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/durable-transit-lanes-crossings | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/educational-facilities | 1 | 0.1 |  |
| &nbsp;&nbsp;└ images/blog/every-child-matters-crosswalk | 1 | 0.1 |  |
| &nbsp;&nbsp;└ images/blog/extending-transit-lane-lifespan | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/imprinted-asphalt-york-transit | 1 | 0.1 |  |
| &nbsp;&nbsp;└ images/blog/keeping-pedestrians-safe | 1 | 0.5 |  |
| &nbsp;&nbsp;└ images/blog/laneway-project | 1 | 0.5 |  |
| &nbsp;&nbsp;└ images/blog/langley-railroad-heritage | 2 | 2.5 |  |
| &nbsp;&nbsp;└ images/blog/multimodal-connectivity-york-region | 1 | 0.1 |  |
| &nbsp;&nbsp;└ images/blog/municipalities-case-study | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/murrayville-schoolhouse-sidewalk | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/parc-riviera-streetbond-walkway | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/pedestrian-channelization-public-spaces | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/pedestrian-safety-solutions | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/performance-crosswalks-asphalt-concrete | 1 | 0.1 |  |
| &nbsp;&nbsp;└ images/blog/pictograph-crosswalk-sechelt | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/playgrounds-recreation | 1 | 0.1 |  |
| &nbsp;&nbsp;└ images/blog/richmond-brighouse-crosswalk | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/roadway-accents-natures-walk | 1 | 0.1 |  |
| &nbsp;&nbsp;└ images/blog/safety-durability-transit-stations | 1 | 0.1 |  |
| &nbsp;&nbsp;└ images/blog/simcoe-rainbow-crosswalk | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/spirit-trail-wayfinding-vancouver | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/stamped-asphalt-parking-lot | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/stamped-asphalt-vs-concrete | 1 | 0.3 |  |
| &nbsp;&nbsp;└ images/blog/streetbondsr-solar-reflective-coatings | 1 | 0.1 |  |
| &nbsp;&nbsp;└ images/blog/terry-fox-plaza-coquitlam | 1 | 0.1 |  |
| &nbsp;&nbsp;└ images/blog/trafficpatternsxd-urban-design | 1 | 0.3 |  |
| &nbsp;&nbsp;└ images/blog/transportation-infrastructure-guide | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/tsain-ko-crosswalk-sechelt | 1 | 0.1 |  |
| &nbsp;&nbsp;└ images/blog/ubc-musqueam-crosswalk | 2 | 0.3 |  |
| &nbsp;&nbsp;└ images/blog/vancouver-decorative-crosswalk-design | 1 | 0.1 |  |
| &nbsp;&nbsp;└ images/blog/veterans-crosswalk-kitchener | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/white-paper-resilient-transit-infrastructure | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/white-paper-transportation-urban-design | 1 | 0.2 |  |
| &nbsp;&nbsp;└ images/blog/white-rock-langley-trafficpatterns | 2 | 0.6 |  |
| &nbsp;&nbsp;└ images/blog/white-rock-pier-crosswalk | 1 | 0.1 |  |
| images/catalogue-assets | 10 | 5.6 |  |
| images/catalogue-figma | 57 | 32.7 | Downscaled photo set streamed by the Figma catalogue plugin |
| images/flags | 1 | 0.0 | Locale flags |
| images/hero | 5 | 2.0 | Homepage hero slideshow |
| images/icons | 1 | 0.0 | UI icons |
| images/instagram | 6 | 0.0 | Instagram strip |
| images/logos | 1 | 0.2 | Brand + partner logos |
| images/lunch-learn | 14 | 24.5 | Lunch & Learn funnel (moose mascot etc.) |
| images/partners | 2 | 0.0 | TrustedBy marquee |
| images/patterns | 16 | 1.7 | /patterns library + StreetPrint templates section (lib/pattern-templates.ts) |
| images/products | 0 | 0.0 | Product pages — hero from lib/products.ts imageUrl; gallery = folder scan (lib/asset-scan.ts) |
| &nbsp;&nbsp;└ images/products/aggrefill | 6 | 0.6 |  |
| &nbsp;&nbsp;└ images/products/airmark | 22 | 12.8 |  |
| &nbsp;&nbsp;└ images/products/chipfill | 8 | 1.8 |  |
| &nbsp;&nbsp;└ images/products/decomark | 78 | 114.7 |  |
| &nbsp;&nbsp;└ images/products/durashield | 11 | 8.7 |  |
| &nbsp;&nbsp;└ images/products/duratherm | 36 | 17.3 |  |
| &nbsp;&nbsp;└ images/products/fast-patch | 5 | 1.6 |  |
| &nbsp;&nbsp;└ images/products/mmax | 33 | 10.2 |  |
| &nbsp;&nbsp;└ images/products/premark | 11 | 5.6 |  |
| &nbsp;&nbsp;└ images/products/streetbond | 114 | 161.2 |  |
| &nbsp;&nbsp;└ images/products/streetbondsr | 11 | 12.4 |  |
| &nbsp;&nbsp;└ images/products/streetprint | 91 | 150.4 |  |
| &nbsp;&nbsp;└ images/products/traffic-patterns | 86 | 123.1 |  |
| &nbsp;&nbsp;└ images/products/traffic-patterns-xd | 143 | 245.6 |  |
| images/projects | 2 | 0.0 | Map + project entries (lib/map-projects.ts) |
| images/textures | 1 | 0.1 | Section background textures |
| docs/AirMark | 0 | 0.0 |  |
| docs/DuraShield | 2 | 1.0 |  |
| docs/MMAX | 5 | 2.8 |  |
| docs/PreMark | 2 | 0.7 |  |
| docs/StreetBond | 0 | 0.0 |  |
| docs/StreetBondSR | 4 | 2.2 |  |
| docs/TrafficPatterns | 7 | 7.0 |  |
| docs/TrafficPatternsXD | 8 | 8.8 |  |
| docs/decomark | 5 | 2.3 |  |
| docs/duratherm | 5 | 11.4 |  |
| docs/streetprint | 4 | 4.3 |  |

_Top-level loose files in /public/images: 6 (0.2 MB)._

Generated: 2026-08-14
