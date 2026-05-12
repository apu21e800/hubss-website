# Map Project Image Audit — EXPANDED

Last updated: 2026-05-12

**Status: open.** Map expanded from 14 → 23 entries. 20 have confirmed blog-correlated images.
3 entries use `_placeholder.svg` — Vernon's worklist for locating real photography is at the bottom.

---

## Current map entries (23)

### Ontario (7)

| Project | Location | Image source |
|---|---|---|
| York Region Hwy 7 VIVA BRT Corridor | Markham, ON | `imprinted-asphalt-york-transit/featured.jpg` ✓ |
| Kitchener Veterans Memorial Crosswalk | Kitchener, ON | `veterans-crosswalk-kitchener/featured.jpeg` ✓ |
| Collingwood Rainbow Crosswalk | Collingwood, ON | `simcoe-rainbow-crosswalk/featured.jpg` ✓ |
| Every Child Matters Crosswalk | Georgina (York Region), ON | `every-child-matters-crosswalk/featured.png` ✓ |
| Humberwest Parkway Crosswalk & Median | Toronto (Etobicoke), ON | `decorative-crosswalk-meridian/featured.jpg` ✓ |
| East London Link BRT | London, ON | **PLACEHOLDER** — see worklist |
| City of Vaughan Complete Streets | Vaughan, ON | **PLACEHOLDER** — see worklist |

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
| Bowen Island Foreshore Path | Bowen Island, BC | `bowen-island-asphalt-path/featured.jpg` ✓ |
| White Rock Pier Crosswalk | White Rock, BC | `white-rock-pier-crosswalk/featured.png` ✓ |
| White Rock Seaside Stroll (Johnston Rd) | White Rock, BC | `white-rock-langley-trafficpatterns/featured.jpg` ✓ |
| Tsain-Ko Cultural Crosswalk | Sechelt, BC | `tsain-ko-crosswalk-sechelt/featured.jpg` ✓ |
| Pictograph Crosswalk — Cowrie St & Trail Ave | Sechelt, BC | `pictograph-crosswalk-sechelt/featured.jpg` ✓ |
| Nature's Walk Roadway Accents | Pitt Meadows, BC | `roadway-accents-natures-walk/featured.jpg` ✓ |
| Reunion Housing Complex Sidewalks | Langley (Murrayville), BC | `murrayville-schoolhouse-sidewalk/featured.jpg` ✓ |
| Langley Railroad Heritage Crosswalk | Langley City, BC | **PLACEHOLDER** — see worklist |

---

## Vernon's image worklist (3 placeholders)

These entries are on the live map with a dark placeholder card. The map popup shows "Project photo coming soon."
Pull the real photo, drop it in `/public/images/blog/<slug>/featured.jpg`, update the `images[]` path in `lib/map-projects.ts`, and remove the TODO comment and placeholder.

| Entry ID | What to find |
|---|---|
| `london-east-brt` | Any HUBSS photo from the East London Link BRT corridor (Dundas St E, London ON). Check the project archive or ask Doug. |
| `vaughan-complete-streets` | Any HUBSS crosswalk photo from Vaughan's arterials. Check Doug's files — Vaughan is mentioned in the keeping-pedestrians-safe blog post. |
| `langley-railroad-heritage` | Photo of the Linwood Park railroad heritage crosswalk (March 2025 install, Langley City). Square One Paving may have it. |

---

## Curation rules

A project belongs on the map only if **all three** are true:

1. The project's name/location uniquely identifies a real HUBSS install we can attest to.
2. There is at least one image file in the repo that depicts that specific install (not generic stock).
3. There is a `/content/blog/<slug>.mdx` post (or equivalent) backing up the map entry — so a visitor clicking through gets more context.

Placeholder entries relax rule 2 temporarily — they must still satisfy rules 1 and 3.
When adding new projects, follow the existing schema in `lib/map-projects.ts` and place the image
at `/public/images/blog/<slug>/featured.{jpg,png,jpeg}` and reference that path in `images[]`.

---

## Previously removed entries (33)

The following were removed in an earlier curation pass (2026-05-12) for lack of image-to-location
correlation. They can be reinstated when authoritative photography is available.

- **Ontario:** Toronto Bus Lanes, Ottawa Every Child Matters, Mississauga Civic Centre, Hamilton James Street, Waterloo University Ave, Barrie Downtown, Kingston Heritage, Windsor Ambassador Bridge
- **British Columbia:** Burnaby Active Transport, Victoria Chinatown, Kelowna Downtown, Nanaimo Harbour, Kamloops Active Transport
- **Alberta:** Calgary MAX BRT, Calgary Reconciliation, Calgary Peace Bridge, Edmonton Whyte Ave, Edmonton Valley Line LRT, Lethbridge Cultural District
- **Saskatchewan:** Saskatoon Bridge City, Regina Wascana
- **Manitoba:** Winnipeg Exchange District, Winnipeg Indigenous Cultural Garden
- **Québec:** Montréal Plateau Ruelle Verte, Montréal Rosemont Vision Zéro, Québec City St-Roch, Laval Carrefour
- **Atlantic:** Halifax Waterfront, Moncton Main Street, Charlottetown Confederation Landing, St. John's Jellybean Row
