# Sources: Red StreetBond along Harbour Passage in Saint John

/blog/harbour-passage-saint-john · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/harbour-passage-saint-john.md` · 27 Oct 2026

Map job 39 of the 40 pins with no write-up. The slug is the one the map is pointed at. Every statement below is from the map entry, the printed Product Portfolio Book (page renders p024 and p025 in public/catalogue/2026-27, read as images), the site's application file, or the photographs. Line numbers are on branch feat/map-posts. The record is thin (a caption and the system page), so the piece is about 187 words and stops there rather than padding.

Written beside the other StreetBond path posts: Saint-Lin-Laurentides uses the parks and paths page's "a route can double as wayfinding" and the book's "designed to move with the pavement", and Sheffield Park uses "bikes, strollers and plow blades as well as feet". This piece uses none of them.

## What the record holds

- lib/map-projects.ts:1753–1770. Comment: "Product Book p.24, the StreetBond page: "Saint John, New Brunswick | Harbour Passage". The poles across the water are the new Fundy Quay extension; the building is the Hilton at Market Square." Entry: title "Harbour Passage" (:1757), city Saint John, NB (:1758–1759), product StreetBond (:1762), application Parks & Paths (:1763), not approximate, images `cdn("a5ab22bbcc6abda065bd71f2f3052193847353d9-1215x911.jpg")` (:1765, a Studio gallery copy of the book's p.24 photo), ideaBookPage 24 (:1767), excerpt "Red StreetBond on Harbour Passage, Saint John's waterfront walkway, at Market Slip beside Market Square." (:1769). No year, client, installer, designer, length or cost.
- lib/idea-book-edition.ts:206: the StreetBond system leaf, pages 24–25, photo page 24, alt "The red StreetBond walkway of Harbour Passage, Saint John, New Brunswick", caption place "Saint John, New Brunswick", system slot "Harbour Passage". Checked against the p024 render: the caption prints "Saint John, New Brunswick | Harbour Passage".
- The tie between page 24 and this job: a system leaf has no `mapId` field (the Leaf type, idea-book-edition.ts:75), so the edition cannot name the job's id there. The page is tied to the job because its printed caption names the city and Harbour Passage, the map entry gives ideaBookPage 24, and the map's photo is the same view as the page's photograph (the page's is a tighter frame of it). Flagged in the report.
- The StreetBond page as printed: lib/idea-book-print.ts:104–116 (page 25, render checked).

## First paragraph

- "Harbour Passage is the waterfront walkway in Saint John, New Brunswick": map excerpt (:1769), "Saint John's waterfront walkway"; the caption.
- "where it passes Market Slip, beside Market Square, it is coated in red StreetBond": map excerpt (:1769) and comment (:1754–1755, the building in the photograph is at Market Square); map product (:1762); edition alt (:206). The red is what the photograph shows. Said of that stretch only: no record says how much of the walkway is coated.
- "The photograph of that stretch faces StreetBond's own page in HUB Surface Systems' Product Portfolio Book · Volume 5, captioned with the city and the walkway's name": edition :206 (pages 24–25); p024 caption.

## Red along the harbour railing

- The book's p.24 photograph: the red walkway beside the railing at the water's edge, a row of dark grey pavers between them; a wooden top rail over horizontal cables; lamp posts crowned with spoked wheels; ahead, the red's inner edge curving around a planting bed beside concrete steps; blue cranes across the harbour; an overcast sky.
- Cut on 28 Oct 2026: "The frame above runs wider, out to a tall building of red brick and dark glass on the right" (the cover photo). Three map posts pointed at the photograph "above"; Verdun's flush medians keeps it.

## The page it faces

- "pages 24 and 25": edition :206; idea-book-print.ts:115.
- "headed "The colour."": idea-book-print.ts:105.
- The four specification lines: idea-book-print.ts:109–112 (Type "Water-based, epoxy-modified acrylic"; Surfaces "Asphalt and concrete"; Colours "63 standard + custom colours", with the description's "full custom colour matching", :107; "8+ years / easily refreshed", printed "Life cycle", written as service life per docs/GLOSSARY.md and lib/product-catalogue.ts:79). The colour count is left out (docs/STYLE.md, no counts as a selling point).
- Cut on 28 Oct 2026: the closing line "Coloured walks and paths are filed on the site under parks and paths, with the other HUB systems used on them" (the map's application, :1763): filler, and the same filing sentence ran in most of the forty map posts. The application, parks-paths, stays in relatedApplications.

## Links (each checked, 200 on hubss.com, 27 Oct 2026)

/products/streetbond; /product-book/24. Each once. No published post is the same subject. No outside links. The piece ends on StreetBond's page in the book, not the Lunch & Learn.

## Photo

image-a5ab22bbcc6abda065bd71f2f3052193847353d9-1215x911-jpg, already in Studio, the map entry's own photo (:1765), downloaded and read. Alt: what it shows, with StreetBond and the place from the record. Hotspot x 0.62 y 0.6, on the red walkway beside the railing, so a phone's portrait cut keeps the walkway and the rail.

## Left out

- The client and owner: no record says who commissioned the job. The book's closing page lists the City of Saint John among "a few of the communities we work with" (lib/idea-book-edition.ts:487), but nothing ties the city to this job, so it is not mentioned.
- The hotel's name and the "new Fundy Quay extension" (map comment): identifications from research in one place, not needed to describe the job.
- Install year, installer, length, area and cost: no record states them.
- What the coating is laid on (asphalt or concrete): no record states it.
- Salt or marine performance: no record makes a claim for StreetBond at a harbour, so none is made.
