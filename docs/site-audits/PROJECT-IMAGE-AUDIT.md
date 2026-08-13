# Map Project Image Audit — EXPANDED

Last updated: 2026-05-12

**Status: open.** Map expanded to 36 entries across BC, AB, ON, QC.
33 have confirmed blog-correlated images. 3 use `_placeholder.svg` (Vernon worklist below).

---

## Current map entries (36)

### Ontario (15)

| Project | Location | Image source |
|---|---|---|
| York Region Hwy 7 VIVA BRT Corridor | Markham, ON | `imprinted-asphalt-york-transit/featured.jpg` ✓ |
| Kitchener Veterans Memorial Crosswalk | Kitchener, ON | `veterans-crosswalk-kitchener/featured.jpeg` ✓ |
| Cadillac Fairview Parking Lot | Kitchener, ON | `stamped-asphalt-parking-lot/featured.jpg` ✓ |
| Collingwood Rainbow Crosswalk | Collingwood, ON | `simcoe-rainbow-crosswalk/featured.jpg` ✓ |
| Every Child Matters Crosswalk | Georgina (York Region), ON | `every-child-matters-crosswalk/featured.png` ✓ |
| Humberwest Parkway Crosswalk & Median | Toronto (Etobicoke), ON | `decorative-crosswalk-meridian/featured.jpg` ✓ |
| Leslieville Laneway Revitalization | Toronto (Leslieville), ON | `municipalities-case-study/featured.jpg` ✓ |
| Emery Village BIA Crosswalk Restoration | Toronto (Emery Village), ON | `decorative-asphalt-high-traffic/featured.jpg` ✓ |
| TTC Bus Priority Corridors | Toronto, ON | `extending-transit-lane-lifespan/featured.jpg` ✓ |
| Spencer Smith Park Lakeshore Promenade | Burlington, ON | `pedestrian-channelization-public-spaces/featured.jpg` ✓ |
| GrandLinq ION LRT Platform Crossings | Waterloo, ON | `safety-durability-transit-stations/featured.jpg` ✓ |
| Woodbridge Avenue Heritage Crosswalks | Vaughan (Woodbridge), ON | `trafficpatternsxd-urban-design/featured.jpg` ✓ |
| City of Vaughan Complete Streets | Vaughan, ON | **PLACEHOLDER** — see worklist |
| East London Link BRT | London, ON | **PLACEHOLDER** — see worklist |
| East London Link BRT (cycle integration) | London, ON | `cycling-transit-integration-surface-solutions/featured.jpeg` ✓ |

> Note: London has two entries from different blog posts. Vernon may want to merge these into one.

### British Columbia (16)

| Project | Location | Image source |
|---|---|---|
| Commercial Drive Decorative Crosswalk | Vancouver, BC | `decorative-crosswalk-commercial-drive/featured.jpg` ✓ |
| UBC Musqueam Campus Crosswalk | Vancouver, BC | `ubc-musqueam-crosswalk/featured.jpg` ✓ |
| More Awesome Now Laneway Revitalization | Vancouver, BC | `laneway-project/featured.png` ✓ |
| BC Children's Hospital Labyrinth | Vancouver, BC | `bc-childrens-hospital-labyrinth/featured.jpg` ✓ |
| Richmond Brighouse Station Crosswalk | Richmond, BC | `richmond-brighouse-crosswalk/featured.jpeg` ✓ |
| New Westminster Complete Streets | New Westminster, BC | `complete-streets-new-westminster/featured.jpg` ✓ |
| Spirit Trail Waterfront Wayfinding | North Vancouver, BC | `spirit-trail-wayfinding-vancouver/featured.jpg` ✓ |
| Terry Fox Plaza | Coquitlam, BC | `terry-fox-plaza-coquitlam/featured.jpg` ✓ |
| Windsor Gate Masterplanned Community | Coquitlam, BC | `community-branding-case-study/featured.jpg` ✓ |
| Bowen Island Foreshore Path | Bowen Island, BC | `bowen-island-asphalt-path/featured.jpg` ✓ |
| White Rock Pier Crosswalk | White Rock, BC | `white-rock-pier-crosswalk/featured.png` ✓ |
| White Rock Seaside Stroll (Johnston Rd) | White Rock, BC | `white-rock-langley-trafficpatterns/featured.jpg` ✓ |
| Tsain-Ko Cultural Crosswalk | Sechelt, BC | `tsain-ko-crosswalk-sechelt/featured.jpg` ✓ |
| Pictograph Crosswalk — Cowrie St & Trail Ave | Sechelt, BC | `pictograph-crosswalk-sechelt/featured.jpg` ✓ |
| Nature's Walk Roadway Accents | Pitt Meadows, BC | `roadway-accents-natures-walk/featured.jpg` ✓ |
| City of Kelowna Crosswalk Network | Kelowna, BC | `performance-crosswalks-asphalt-concrete/featured.jpg` ✓ |
| David Foster Harbour Pathway | Victoria, BC | `pedestrian-channelization-public-spaces/featured.jpg` ✓ |
| Reunion Housing Complex Sidewalks | Langley (Murrayville), BC | `murrayville-schoolhouse-sidewalk/featured.jpg` ✓ |
| Langley Railroad Heritage Crosswalk | Langley City, BC | **PLACEHOLDER** — see worklist |

### Québec (1)

| Project | Location | Image source |
|---|---|---|
| Parc Guido-Nincheri Promenade | Montréal, QC | `pedestrian-channelization-public-spaces/featured.jpg` ✓ |

### Alberta (2)

| Project | Location | Image source |
|---|---|---|
| Calgary MAX BRT Corridor | Calgary, AB | **PLACEHOLDER** — see worklist |
| Edmonton Valley Line LRT Crossings | Edmonton, AB | **PLACEHOLDER** — see worklist |

---

## Vernon's image worklist (3 placeholders)

Pull the real photo, drop it in `/public/images/blog/<slug>/featured.jpg`,
update `images[]` in `lib/map-projects.ts`, and remove the TODO comment.

| Entry ID | What to find |
|---|---|
| `london-east-brt` | Any HUBSS photo from East London Link BRT (Dundas St E, London ON). Check Doug. |
| `vaughan-complete-streets` | Any HUBSS crosswalk photo from Vaughan arterials. Check Doug's files. |
| `langley-railroad-heritage` | Photo of the Linwood Park railroad heritage crosswalk (March 2025). Square One Paving may have it. |

Alberta entries (`calgary-max-brt`, `edmonton-valley-line-lrt`) also use placeholders.
Ask Doug for Calgary/Edmonton project photography when available.

---

## Provinces still needing coverage

- **Saskatchewan** — Saskatoon, Regina
- **Manitoba** — Winnipeg Exchange District, Winnipeg Indigenous Cultural Garden
- **Atlantic** — Halifax Waterfront, Moncton, Charlottetown, St. John's

These are real HUBSS installation locations. Add when Doug can provide project photography.

---

## Curation rules

1. Project name/location uniquely identifies a real HUBSS install.
2. At least one image file depicts that specific install (not generic stock) — OR a placeholder is used with a TODO comment.
3. A `/content/blog/<slug>.mdx` post backs up the entry where possible.
