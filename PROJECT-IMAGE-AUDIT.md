# Map Project Image Correlation Audit

Last updated: 2026-05-10 (for 2026-05-11 client meeting)

**Purpose.** Each entry in `lib/map-projects.ts` carries a `images: string[]` array that drives the marker popup card image and the case-study modal image gallery. Vernon flagged that several of these images may not correspond to the actual installation at the named location.

This audit walks every project, lists the image filenames currently in use, and assigns a confidence rating so Vernon can correlate offline. **No images were swapped in this pass** — that's a content task requiring access to the photo archive and Vernon's authoritative knowledge of each install.

**Status legend**
- **✅ Likely correct** — image folder/slug matches the project's product or application; reasonable presumption that the photo is from this install or a representative install of the same product
- **❓ Questionable** — image is from a generic product/application folder, not project-specific; could be the right installation or could be a stand-in
- **🚩 Probably wrong** — image is clearly from a different product family or unrelated location

---

## Ontario (13 projects)

| Project | Location | Current images | Status |
|---|---|---|---|
| York Region High-Visibility Crosswalks | York Region, ON | `products/traffic-patterns-xd/traffic-patterns-xd-03.jpg`, `applications/crosswalks/crosswalks-03.jpg`, `applications/crosswalks/crosswalks-07.jpg` | ❓ Generic TPxD + crosswalks stock. Vernon to confirm if any of these are from a York Region install. |
| Toronto Priority Bus Lane Network | Toronto, ON | `products/mmax/mmax-01.jpg`, `applications/bus-lanes/bus-lanes-01.jpg`, `applications/bus-lanes/bus-lanes-03.jpg` | ❓ Generic MMAX + bus-lanes stock. |
| York Region Hwy 7 VIVA BRT Corridor | Markham, ON | `applications/bus-lanes/bus-lanes-01.jpg`, `products/mmax/mmax-01.jpg`, `applications/bus-lanes/bus-lanes-02.jpg` | ❓ Same generic stock as Toronto entry. |
| Kitchener Veterans Memorial Crosswalk | Kitchener, ON | `applications/community-branding/community-branding-01.jpg`, `products/decomark/decomark-04.jpg`, `applications/community-branding/community-branding-05.jpg` | ❓ Generic DecoMark + community-branding stock. |
| London East Link BRT | London, ON | `applications/bus-lanes/bus-lanes-03.jpg`, `products/streetbond/streetbond-09.jpg`, `applications/bus-lanes/bus-lanes-05.jpg` | ❓ Generic bus-lanes + StreetBond stock. |
| Collingwood Rainbow Crosswalk | Collingwood, ON | `applications/community-branding/community-branding-06.jpg`, `products/streetbond/streetbond-01.png`, `applications/community-branding/community-branding-08.jpg` | ❓ Generic. `streetbond-01.png` is a product render — confirm. |
| Every Child Matters Crosswalk | Ottawa, ON | `products/decomark/decomark-01.jpg`, `applications/community-branding/community-branding-03.jpg`, `products/decomark/decomark-06.jpg` | ❓ Generic DecoMark/community-branding stock. |
| Mississauga Civic Centre Crosswalks | Mississauga, ON | `applications/crosswalks/crosswalks-02.jpg`, `products/traffic-patterns-xd/traffic-patterns-xd-03.jpg`, `applications/crosswalks/crosswalks-08.jpg` | ❓ Generic TPxD/crosswalks. Doug flagged that `traffic-patterns-xd-03.jpg` shows stamping → confirm whether the displayed image is actually TPxD. |
| Hamilton James Street North Cultural Corridor | Hamilton, ON | `products/streetprint/streetprint-40.jpg`, `applications/community-branding/community-branding-04.jpg`, `products/streetprint/streetprint-05.jpg` | ❓ Generic StreetPrint. |
| Waterloo University Avenue Active Transportation | Waterloo, ON | `applications/bike-lanes/bike-lanes-01.jpg`, `products/traffic-patterns-xd/traffic-patterns-xd-03.jpg`, `applications/bike-lanes/bike-lanes-04.jpg` | 🚩 Doug flagged: TPxD is not used in bike-lane installations. This entry should likely show TrafficPatterns (not TPxD) imagery or be re-classified. |
| Barrie Downtown Revitalization Crosswalks | Barrie, ON | `products/streetbond/streetbond-04.png`, `applications/crosswalks/crosswalks-05.jpg`, `products/streetbond/streetbond-10.jpg` | ❓ Generic StreetBond stock. |
| Kingston Heritage District Streetscape | Kingston, ON | `products/streetprint/streetprint-04.jpg`, `applications/parks-paths/parks-paths-01.jpg`, `products/streetprint/streetprint-08.jpg` | ❓ Generic StreetPrint stock. |
| Windsor Ambassador Bridge Approach Corridor | Windsor, ON | `products/mmax/mmax-01.jpg`, `applications/bus-lanes/bus-lanes-05.jpg`, `applications/bus-lanes/bus-lanes-01.jpg` | ❓ Same generic MMAX/bus-lanes stock as Toronto + VIVA entries. |

---

## British Columbia (16 projects)

| Project | Location | Current images | Status |
|---|---|---|---|
| Commercial Drive Decorative Crosswalk | Vancouver, BC | `products/streetprint/streetprint-40.jpg`, `applications/crosswalks/crosswalks-04.jpg`, `products/streetprint/streetprint-05.jpg` | ❓ Generic StreetPrint. |
| UBC Musqueam Campus Crosswalk | Vancouver, BC | `applications/parks-paths/parks-paths-01.jpg`, `products/streetprint/streetprint-03.jpg`, `applications/community-branding/community-branding-02.jpg` | ❓ Description says crosswalk; images are parks-paths/streetprint/community-branding generic stock. **High-profile project** — would benefit from authoritative photos. |
| More Awesome Now Laneway Revitalization | Vancouver, BC | `products/streetbond/streetbond-02.png`, `applications/community-branding/community-branding-09.jpg`, `products/streetbond/streetbond-05.png` | ❓ `.png` files are likely product renders, not laneway photos. |
| Richmond Brighouse Station Crosswalk | Richmond, BC | `products/decomark/decomark-03.jpg`, `applications/community-branding/community-branding-11.jpg`, `products/decomark/decomark-08.jpg` | ❓ Generic DecoMark stock. |
| New Westminster Complete Streets | New Westminster, BC | `products/streetbond/streetbond-04.png`, `applications/crosswalks/crosswalks-05.jpg`, `products/streetbond/streetbond-10.jpg` | ❓ Generic StreetBond stock — identical filenames as Barrie entry. |
| White Rock Pier Crosswalk | White Rock, BC | `applications/crosswalks/crosswalks-06.jpg`, `products/traffic-patterns-xd/traffic-patterns-xd-03.jpg`, `applications/crosswalks/crosswalks-09.jpg` | ❓ Listed as TrafficPatterns product but image is TPxD. Verify product → image alignment. |
| Tsain-Ko Cultural Crosswalk, Sechelt | Sechelt, BC | `products/decomark/decomark-05.jpg`, `applications/community-branding/community-branding-12.jpg`, `products/decomark/decomark-09.jpg` | ❓ Generic DecoMark stock. |
| Spirit Trail Waterfront Wayfinding | North Vancouver, BC | `products/streetbond/streetbond-06.png`, `applications/parks-paths/parks-paths-03.jpg`, `applications/bike-lanes/bike-lanes-03.jpg` | ❓ Mixed StreetBond render + parks-paths/bike-lanes stock. |
| Terry Fox Plaza, Coquitlam | Coquitlam, BC | `products/streetprint/streetprint-04.jpg`, `applications/community-branding/community-branding-04.jpg`, `products/streetprint/streetprint-08.jpg` | ❓ Same generic StreetPrint stock as Kingston entry. |
| Bowen Island Foreshore Path | Bowen Island, BC | `applications/parks-paths/parks-paths-04.jpg`, `products/streetbond/streetbond-07.png`, `applications/parks-paths/parks-paths-07.jpg` | ❓ Generic parks-paths stock. |
| BC Children's Hospital Labyrinth | Vancouver, BC | `products/streetbond/streetbond-03.png`, `applications/parks-paths/parks-paths-02.jpg`, `applications/community-branding/community-branding-07.jpg` | ❓ Notable installation — would benefit from real labyrinth photos. |
| Burnaby Active Transportation Network | Burnaby, BC | `applications/bike-lanes/bike-lanes-01.jpg`, `products/streetbond/streetbond-08.png`, `applications/bike-lanes/bike-lanes-04.jpg` | ❓ Generic bike-lanes stock. |
| Victoria Chinatown Gateway Streetscape | Victoria, BC | `products/streetprint/streetprint-03.jpg`, `applications/community-branding/community-branding-02.jpg`, `products/streetprint/streetprint-40.jpg` | ❓ Generic StreetPrint stock. Notable heritage site — worth real photos. |
| Kelowna Downtown Waterfront Crosswalks | Kelowna, BC | `products/streetbond/streetbond-01.png`, `applications/community-branding/community-branding-06.jpg`, `products/streetbond/streetbond-05.png` | ❓ StreetBond renders, not Kelowna photos. |
| Nanaimo Harbour City Crosswalks | Nanaimo, BC | `applications/crosswalks/crosswalks-03.jpg`, `products/traffic-patterns-xd/traffic-patterns-xd-03.jpg`, `applications/crosswalks/crosswalks-07.jpg` | ❓ Identical filenames to York Region entry. |
| Kamloops Active Transportation Corridors | Kamloops, BC | `applications/bike-lanes/bike-lanes-03.jpg`, `products/streetbond/streetbond-06.png`, `applications/bike-lanes/bike-lanes-01.jpg` | ❓ Generic bike-lanes + StreetBond render. |

---

## Alberta (6 projects)

| Project | Location | Current images | Status |
|---|---|---|---|
| Calgary MAX BRT Red Corridor | Calgary, AB | `products/mmax/mmax-01.jpg`, `applications/bus-lanes/bus-lanes-01.jpg`, `applications/bus-lanes/bus-lanes-03.jpg` | ❓ Same generic MMAX/bus-lanes stock as 3 other entries. |
| Calgary Reconciliation Crosswalk | Calgary, AB | `products/decomark/decomark-01.jpg`, `applications/community-branding/community-branding-03.jpg`, `products/decomark/decomark-06.jpg` | ❓ Identical filenames to Ottawa Every Child Matters entry. |
| Calgary Peace Bridge Plaza | Calgary, AB | `products/streetprint/streetprint-04.jpg`, `applications/parks-paths/parks-paths-01.jpg`, `products/streetprint/streetprint-08.jpg` | ❓ Identical filenames to Kingston + Terry Fox entries. |
| Edmonton Whyte Avenue Arts District | Edmonton, AB | `products/streetbond/streetbond-02.png`, `applications/community-branding/community-branding-09.jpg`, `products/streetbond/streetbond-05.png` | ❓ Same generic stock as Vancouver Laneways entry. |
| Edmonton Valley Line LRT Station Crosswalks | Edmonton, AB | `applications/crosswalks/crosswalks-02.jpg`, `products/traffic-patterns-xd/traffic-patterns-xd-03.jpg`, `applications/crosswalks/crosswalks-08.jpg` | ❓ Same filenames as Mississauga Civic Centre entry. |
| Lethbridge Cultural District Crosswalk | Lethbridge, AB | `products/decomark/decomark-05.jpg`, `applications/community-branding/community-branding-12.jpg`, `products/decomark/decomark-09.jpg` | ❓ Same filenames as Sechelt Tsain-Ko entry. |

---

## Saskatchewan (2 projects)

| Project | Location | Current images | Status |
|---|---|---|---|
| Saskatoon Bridge City Crosswalk Network | Saskatoon, SK | `applications/crosswalks/crosswalks-06.jpg`, `products/traffic-patterns-xd/traffic-patterns-xd-03.jpg`, `applications/crosswalks/crosswalks-09.jpg` | ❓ Same filenames as White Rock Pier entry. |
| Regina Wascana Pathway Wayfinding | Regina, SK | `products/streetbond/streetbond-06.png`, `applications/parks-paths/parks-paths-03.jpg`, `applications/parks-paths/parks-paths-07.jpg` | ❓ Generic parks-paths stock. |

---

## Manitoba (2 projects)

| Project | Location | Current images | Status |
|---|---|---|---|
| Winnipeg Exchange District Heritage Streetscape | Winnipeg, MB | `products/streetprint/streetprint-40.jpg`, `applications/community-branding/community-branding-04.jpg`, `products/streetprint/streetprint-05.jpg` | ❓ Same filenames as Hamilton James Street entry. |
| Winnipeg Urban Indigenous Cultural Garden | Winnipeg, MB | `products/decomark/decomark-03.jpg`, `applications/community-branding/community-branding-11.jpg`, `products/decomark/decomark-08.jpg` | ❓ Same filenames as Richmond Brighouse entry. |

---

## Québec (4 projects)

| Project | Location | Current images | Status |
|---|---|---|---|
| Montréal Plateau Ruelle Verte | Montréal, QC | `products/streetbond/streetbond-02.png`, `applications/community-branding/community-branding-09.jpg`, `products/streetbond/streetbond-03.png` | ❓ Generic StreetBond renders, not actual Plateau laneway photos. |
| Montréal Rosemont Vision Zéro Crosswalks | Montréal, QC | `applications/crosswalks/crosswalks-03.jpg`, `products/traffic-patterns-xd/traffic-patterns-xd-03.jpg`, `applications/crosswalks/crosswalks-07.jpg` | ❓ Identical filenames to York Region + Nanaimo entries. |
| Québec City St-Roch Heritage Crosswalks | Québec City, QC | `products/streetprint/streetprint-04.jpg`, `applications/crosswalks/crosswalks-04.jpg`, `products/streetprint/streetprint-08.jpg` | ❓ Generic StreetPrint stock. |
| Laval Carrefour Laval Pedestrian Network | Laval, QC | `applications/crosswalks/crosswalks-02.jpg`, `products/traffic-patterns-xd/traffic-patterns-xd-03.jpg`, `applications/crosswalks/crosswalks-08.jpg` | ❓ Same filenames as Mississauga + Edmonton Valley entries. |

---

## Atlantic Canada (4 projects)

| Project | Location | Current images | Status |
|---|---|---|---|
| Halifax Waterfront Boardwalk Crossings | Halifax, NS | `products/streetbond/streetbond-04.png`, `applications/parks-paths/parks-paths-04.jpg`, `products/streetbond/streetbond-07.png` | ❓ Generic StreetBond renders + parks-paths stock. |
| Moncton Main Street Pedestrian Priority Zone | Moncton, NB | `products/decomark/decomark-01.jpg`, `applications/community-branding/community-branding-01.jpg`, `products/decomark/decomark-04.jpg` | ❓ Generic DecoMark stock. |
| Charlottetown Confederation Landing Crosswalks | Charlottetown, PE | `products/streetprint/streetprint-03.jpg`, `applications/crosswalks/crosswalks-04.jpg`, `products/streetprint/streetprint-40.jpg` | ❓ Generic StreetPrint stock. |
| St. John's Jellybean Row Crosswalks | St. John's, NL | `applications/crosswalks/crosswalks-06.jpg`, `products/traffic-patterns-xd/traffic-patterns-xd-03.jpg`, `applications/crosswalks/crosswalks-09.jpg` | ❓ Same filenames as Saskatoon + White Rock entries. |

---

## Summary

- **47 projects total** across the map.
- **0 entries** have confirmed authoritative-of-this-install photos.
- **46 entries** are using generic product / application stock images.
- **1 entry** (Waterloo University Avenue) is flagged as a likely 🚩 product mismatch — uses TPxD imagery despite Doug's note that TPxD isn't used in bike-lane installations.
- Several filename duplicates appear across multiple projects (e.g. `traffic-patterns-xd-03.jpg` appears as the secondary image on ~7 projects).

## Recommendation for post-launch

1. **Inventory the photo archive** — Vernon's records of which photos belong to which install.
2. **Re-shoot the marquee projects** — UBC Musqueam, BC Children's Hospital, Calgary Peace Bridge, Victoria Chinatown, Sechelt Tsain-Ko, Kitchener Veterans, Every Child Matters Ottawa, Reconciliation Calgary, Spirit Trail. These are signature installations and deserve authentic imagery.
3. **Build a photo → project mapping spreadsheet** as the source of truth, then update `lib/map-projects.ts` `images[]` arrays per project.
4. **Until step 3 is complete**, the current generic stock is acceptable for launch — the map shows real geography with real product/application data, just stand-in photography.

For tomorrow's meeting: the map is launch-viable; the image-correlation work is a known follow-up. Vernon can decline to deep-dive on photo accuracy at the client meeting and instead position the map as "the geography and projects are real; photos are placeholders pending our archive review."
