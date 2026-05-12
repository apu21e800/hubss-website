# Map Project Image Audit — CURATED

Last updated: 2026-05-12 (pre-launch)

**Status: closed.** Per Vernon, the map was curated down from 47 entries with mostly-placeholder photography to a smaller defensible set — only projects where we have a verified blog post + featured image authoritatively tied to the project location.

The map now shows **14 projects**, each with the project's own dedicated `/content/blog/<slug>.mdx` post and a featured image at `/public/images/blog/<slug>/featured.{jpg,png,jpeg}` known to depict the named install.

## Current map entries (14)

| Project | Location | Image source (blog post) |
|---|---|---|
| York Region Hwy 7 VIVA BRT Corridor | Markham, ON | `imprinted-asphalt-york-transit/featured.jpg` |
| Kitchener Veterans Memorial Crosswalk | Kitchener, ON | `veterans-crosswalk-kitchener/featured.jpeg` |
| Collingwood Rainbow Crosswalk | Collingwood, ON | `simcoe-rainbow-crosswalk/featured.jpg` |
| Commercial Drive Decorative Crosswalk | Vancouver, BC | `decorative-crosswalk-commercial-drive/featured.jpg` |
| UBC Musqueam Campus Crosswalk | Vancouver, BC | `ubc-musqueam-crosswalk/featured.jpg` |
| More Awesome Now Laneway Revitalization | Vancouver, BC | `laneway-project/featured.png` |
| Richmond Brighouse Station Crosswalk | Richmond, BC | `richmond-brighouse-crosswalk/featured.jpeg` |
| New Westminster Complete Streets | New Westminster, BC | `complete-streets-new-westminster/featured.jpg` |
| White Rock Pier Crosswalk | White Rock, BC | `white-rock-pier-crosswalk/featured.png` |
| Tsain-Ko Cultural Crosswalk, Sechelt | Sechelt, BC | `tsain-ko-crosswalk-sechelt/featured.jpg` |
| Spirit Trail Waterfront Wayfinding | North Vancouver, BC | `spirit-trail-wayfinding-vancouver/featured.jpg` |
| Terry Fox Plaza, Coquitlam | Coquitlam, BC | `terry-fox-plaza-coquitlam/featured.jpg` |
| Bowen Island Foreshore Path | Bowen Island, BC | `bowen-island-asphalt-path/featured.jpg` |
| BC Children's Hospital Labyrinth | Vancouver, BC | `bc-childrens-hospital-labyrinth/featured.jpg` |

## Removed entries (33)

The following entries from the original `lib/map-projects.ts` have been removed because we could not verify an image-to-install correlation. They can be restored individually as authoritative photography becomes available:

- **Ontario:** York Region (TPxD), Toronto Bus Lanes, London BRT, Ottawa Every Child Matters, Mississauga Civic Centre, Hamilton James Street, Waterloo University Ave, Barrie Downtown, Kingston Heritage, Windsor Ambassador Bridge
- **British Columbia:** Burnaby Active Transport, Victoria Chinatown, Kelowna Downtown, Nanaimo Harbour, Kamloops Active Transport
- **Alberta:** Calgary MAX BRT, Calgary Reconciliation, Calgary Peace Bridge, Edmonton Whyte Ave, Edmonton Valley Line LRT, Lethbridge Cultural District
- **Saskatchewan:** Saskatoon Bridge City, Regina Wascana
- **Manitoba:** Winnipeg Exchange District, Winnipeg Indigenous Cultural Garden
- **Québec:** Montréal Plateau Ruelle Verte, Montréal Rosemont Vision Zéro, Québec City St-Roch, Laval Carrefour
- **Atlantic:** Halifax Waterfront, Moncton Main Street, Charlottetown Confederation Landing, St. John's Jellybean Row

These were valid HUBSS installation locations but lacked correlated imagery in the repo. When project photography is added to `/public/images/blog/<slug>/featured.jpg` (or a new `/public/images/projects/<slug>/` directory is established), the corresponding map entries can be reinstated.

## Curation rules going forward

A project belongs on the map only if **all three** are true:

1. The project's name/location uniquely identifies a real HUBSS install we can attest to.
2. There is at least one image file in the repo that depicts that specific install (not a generic stock photo of the product category).
3. There is a `/content/blog/<slug>.mdx` post (or equivalent project page) that backs up the map entry — so a visitor clicking through gets more context, not less.

When adding new projects, follow the existing schema in `lib/map-projects.ts` and place the image at `/public/images/blog/<slug>/featured.{jpg,png,jpeg}` (or another canonical path) and reference that path in `images[]`.
