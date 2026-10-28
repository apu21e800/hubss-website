# Sources: A Toronto fleet lot in StreetBondSR solar reflective coating

/blog/solar-reflective-fleet-lot-toronto · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/solar-reflective-fleet-lot-toronto.md` · 28 Oct 2026

A Project post for map job 29 (`toronto-fleet-lot`), one of the 40 pins whose card said "More projects" (Vern, 27 Oct 2026). The map points at this slug. Line numbers are on branch feat/map-posts.

## What the record holds

- lib/map-projects.ts:1455–1473. Title "Solar-reflective fleet lot" (:1459), Toronto, ON (:1460–1461), StreetBondSR (:1464), Parking Lots (:1465), `approximate: true` (:1466), photo `cdn("8730cab0…-1280x960.jpg")`, "applications/commercial-spaces (Product Book p.28)" (:1468), ideaBookPage 28 (:1470), excerpt "StreetBondSR across a fleet parking lot in Toronto, reflecting sunlight so the surface stays cooler" (:1471–1472).
- The comment above it (:1456–1457): "Product Book p.28, the StreetBondSR page: "Toronto, Ontario". The site is not identified: pin near city hall, approximate."
- The printed page: p.28 is the photograph of the StreetBondSR spread, pp.28–29 (lib/idea-book-edition.ts:213, the system leaf: its photo is p.28, caption "Toronto, Ontario"; render p028-1400.webp, read). The words are p.29 (lib/idea-book-print.ts:117–129; render read).
- How the page is tied to this job: a system leaf in the edition has no `mapId` field (lib/idea-book-edition.ts:75), so the tie is the map entry's own `ideaBookPage: 28` and its photo, which is the p.28 photograph (the same frame, checked by eye), and the brief's line "The Toronto fleet lot (book p.28)".

## Left out, and why

- The owner. The vehicles in the photograph carry an owner's livery, but no record names the owner, and the brief says it is "a fleet lot in Toronto". The post and the alt text say red trucks and white vans, and no more.
- The site. The pin is `approximate` (placed near city hall); the post names only Toronto.
- The colour. No record says which StreetBondSR colour is on the lot, so the post names none. (The surface reads dark in the photograph; nothing is said about that either way.)
- A temperature result. The map excerpt says the lot reflects sunlight "so the surface stays cooler", but no record measures this lot. The post says what the coating is formulated to do, in the book's words, and claims no result here.
- Install year, installer, area, cost, a LEED project or certification: no record gives them. The post says the colours "can contribute" to the credit, as the book does; it does not say this lot earned one.
- SRI and LEED v4: docs/GLOSSARY.md:40 (SR with LEED v5). The two published StreetBondSR posts were not linked: one gives LEED v4 and SRI ≥ 29 (streetbond-leed-urban-heat-island), the other "asphalt or concrete" and high SRI (streetbondsr-solar-reflective-coatings), and both disagree with the book.

## First two paragraphs

- "A fleet lot is a wide field of pavement.": general, about lots, not a claim about this one. The first draft opened "Dark asphalt absorbs most of the sun's energy, and a fleet lot is a wide field of it."; cut on 28 Oct 2026, since no record says it of this lot, and the lot in the photograph is dark grey too.
- "in Toronto, Ontario, coated in StreetBondSR": the p.28 caption; the p.28–29 spread is StreetBondSR's; the map entry (:1464, :1471–1472).
- "a solar reflective coating": p.29 headline "Solar reflective coating." (lib/idea-book-print.ts:118). "a", because DuraShield also has "Solar-reflective options" (p.37, :172).
- "the picture on the system's own page": p.28, the spread's photograph.
- The photograph, taken from low on the lot: the surface running to a long row of red trucks and white vans parked side by side along a low white building, hydro towers beyond. Nothing else is read into it.

## StreetBond in colours that reflect the sun

- "the StreetBond epoxy-modified acrylic coating": lib/products.ts:272 ("StreetBond formulated to reflect rather than absorb: the same flexible chemistry"), :274 (Type "Solar reflective epoxy-modified acrylic"); p.25 StreetBond Type "Water-based, epoxy-modified acrylic" (lib/idea-book-print.ts:109).
- "“formulated to reflect rather than absorb”": p.29 description (:120), quoted.
- "It goes on asphalt": p.29 Surfaces "Asphalt" (:124). "a service life of 8+ years": p.29 prints "Life cycle 8+ years" (:125); docs/GLOSSARY.md:42 makes the term "service life".
- "Solar reflectance is measured on a scale from 0 to 1": docs/GLOSSARY.md:40.
- "The SR colours carry 0.33 or higher when new, which the system's page prints as “≥ 0.33 initial”": p.29 spec (:122). The twelve SR-named colours on pp.26–27 read 0.33 to 0.77 (renders read).
- "The book's StreetBond colour pages set an SR figure under every swatch and name the tests, ASTM C1549 for reflectance and ASTM C1371 for emittance": pp.26–27 (lib/idea-book-edition.ts:207–212; renders read: every swatch carries "SR 0.xx"; p.27 "Reflectance ASTM C1549 · Emittance ASTM C1371 · SRI ASTM E1980").
- "“specify by name and request a physical sample for colour approval”": p.27 (lib/idea-book-edition.ts:211), quoted.

## Parking first on the system's page

- "Parking leads the list of uses at the foot of the StreetBondSR page": p.29 uses strip (lib/idea-book-print.ts:127).
- "on the site this job sits with parking lots": the map's application (:1465); lib/applications.ts:92 lists streetbondsr on Parking Lots. (The book's Parking lots spread, p.78, does not name StreetBondSR, so none of its words are used.)
- "“Mitigating the urban heat island effect.”": p.29 subhead (:119), quoted.
- "the measurable difference in temperature between a city and the country around it, and dark pavement is one cause of it": docs/GLOSSARY.md:41.
- "can contribute to the LEED v5 Sustainable Sites credit for urban heat island reduction (non-roof)": p.29 ("can contribute to LEED V5 urban heat-island credits (non-roof)", :120; LEED "V5 SS Credit: Urban Heat Island", :123); lib/products.ts:272 for the credit's name. "v5" in lower case: docs/STYLE.md ("LEED is v5").

## The close

- The piece ends on the LEED and urban heat island page. The Lunch & Learn close was taken out on 28 Oct 2026: thirteen of the forty map posts ended on one.

## Links (each checked)

/products/streetbondsr, /product-book/28 (the photograph's page; the reader opens it beside p.29, the words), /applications/parking-lots, /applications/leed-urban-heat-island. Each once. No outside links.

## Photo

image-8730cab06de5688b6e6828e45f433ccbabb6b3c7-1280x960-jpg, already in Studio (the map's photo, the p.28 photograph, filed in Studio under commercial spaces). Alt: "Red trucks and white vans parked along a fleet lot coated in StreetBondSR, Toronto, Ontario" (the system from the spread, the town from its caption; no owner). 1280 px wide, under 1600: no larger copy is on the map entry. Hotspot x 0.5 y 0.38 w 1 h 0.7: the vehicles along the top third and the surface below them.
