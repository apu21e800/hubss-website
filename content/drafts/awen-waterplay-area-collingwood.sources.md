# Sources: StreetBond circles on the Awen' Waterplay Area in Collingwood

/blog/awen-waterplay-area-collingwood · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/awen-waterplay-area-collingwood.md` · 28 Oct 2026

The write-up for the homepage map's pin `collingwood-awen-waterplay` (job 21 of the 40 without one). Each statement about HUB, a system, the place or the photograph, then the line it rests on. Line numbers are on feat/map-posts at fede3fd. The printed pages were read from their renders (public/catalogue/2026-27/p084, p085, p025 and p060, 1400 px), and the photo was downloaded from Sanity's CDN and looked at.

## What the record holds

- lib/map-projects.ts:1126–1127, the comment: "Product Book p.84 ("Collingwood, ON", on the StreetBond by GAF page). The Town lists Awen' Waterplay at Harbourview Park, 1 Cedar St, opened August 2023."
- :1128–1143, the entry: title "Awen' Waterplay Area" (:1129), Collingwood, ON (:1130–1131), product StreetBond (:1134), application Splash Pads (:1135), year "2023" (:1136), one photo, cdn 431881e1…-2400x1800 (:1138, "applications/splash-pads/splash-pads-25 (Product Book p.84)"), ideaBookPage 84 (:1140), excerpt "StreetBond circles in blue and green on the Awen' Waterplay Area at Harbourview Park, which opened in 2023." (:1142). Not approximate: the park is named.
- The book: pp.84–85 are the StreetBond by GAF spread (lib/idea-book-edition.ts:284–292, a "partner" leaf). Page 84 prints this job's photograph, captioned "Collingwood, ON" on the page; the edition's alt is "Children on a green and blue StreetBond splash pad in Collingwood, Ontario" (:286). Headline on p.84: "Preserving and protecting surfaces. Built for feet." (:289). Page 85: heading "The chemistry under the colour." (:290) and the line "StreetBond by GAF. The coating chemistry under every StreetBond and StreetPrint surface in this book." (:291).
- How p.84 is tied to this job: a partner leaf has no `mapId` field (the Leaf type, lib/idea-book-edition.ts:84), so the edition cannot name the job's id. The tie rests on the printed caption (Collingwood), the map entry's ideaBookPage 84 and its comment, the edition's alt (Collingwood), and the photograph: the p.84 render and the CDN photo are the same frame (the CDN copy is wider). Flagged in the report. The Kelowna write-up (green-square-courtyard-kelowna, p.85 of the same spread) left its page untied on the same grounds, so the two need to be made to match.

## Opening

- "A girl stands in a jet of water at the centre of a lime-green circle while a boy runs barefoot across the light-blue ring around it.": the photograph, by eye (cdn 431881e1…, and the p.84 render).
- "the Awen' Waterplay Area at Harbourview Park in Collingwood, Ontario": map :1129, :1130–1131, :1142; comment :1126–1127. The name is spelled as the record spells it.
- "the colour under their feet is StreetBond pavement coating": map :1134, :1142; "pavement coating" is docs/GLOSSARY.md's term for StreetBond.
- "The waterplay area opened in 2023.": map :1136 and :1142 ("which opened in 2023"); the comment's "opened August 2023" (:1127). Written as the opening, not as the year the coating went down: no record gives an install date.
- "HUB Surface Systems prints the same photograph on page 84 of the Product Portfolio Book · Volume 5.": see the tie above. First mention of HUB and of the book, both in full.
- "bands of a deeper blue and a green follow the curved edges of the planting beds, and more jets are running where other children play further back": the photograph, by eye.

## Built for feet

- "Under the photograph the book prints "Preserving and protecting surfaces. Built for feet."": p.84 render; lib/idea-book-edition.ts:289.
- "On a waterplay area the feet are bare, and the surface is wet whenever the jets are on.": what the photograph shows (bare feet, running jets); no claim about the coating.
- "The book's spread on splash pads asks for "a slip-resistant texture built for constant water, chemical treatment and bare feet"": lib/idea-book-print.ts:281, the p.60 body (render read), quoted with its first letter lower-cased. That spread's photograph is another job (Saint-Antoine-sur-Richelieu), so the post quotes its words only and neither links it nor ties it to Collingwood.
- "and StreetBond is the first system it specifies": lib/idea-book-print.ts:283 (SPECIFY: StreetBond, then StreetBondSR).
- "The site's splash pads page covers how the coating goes onto a pad.": lib/applications.ts:158 ("StreetBond pavement coating is applied to the prepared concrete in a textured, slip-resistant build"); Studio holds the same text (public API, read 28 Oct 2026).
- "StreetBond is a two-part, water-based, epoxy-modified acrylic pavement coating for asphalt and concrete.": the book's StreetBond page, lib/idea-book-print.ts:109–110 ("Water-based, epoxy-modified acrylic"; "Asphalt and concrete"); "two-part": lib/applications.ts:147 and docs/GLOSSARY.md (pavement coating). It now closes the paragraph above it.
- p.25's "Designed to move with the pavement, avoiding the three failures of rigid coatings" (lib/idea-book-print.ts:107): no longer used here. The Saint-Lin-Laurentides, Burnaby and Green Square drafts carry it.

## The chemistry under the colour

- "The facing page, page 85, is headed "The chemistry under the colour" and names the maker: "StreetBond by GAF. The coating chemistry under every StreetBond and StreetPrint surface in this book."": p.85 render; lib/idea-book-edition.ts:290–291. The page's own photograph (Kelowna) is not mentioned.
- "The book gives StreetBond a service life of 8+ years.": p.25, lib/idea-book-print.ts:112 (the page labels it "Life cycle"; the site's term is service life, lib/products.ts:167; docs/GLOSSARY.md).
- "Page 84 of the Product Portfolio Book shows the waterplay area as printed.": /product-book/84 opens that page.

## Links (each checked)

/products/streetbond, /applications/splash-pads and /product-book/84, each once. No published post is on this subject: durable-coatings-waterparks and playgrounds-recreation carry figures and claims the book does not make, so neither is linked.

## Photo

image-431881e193da37224dcdcb86ef09ed674922389e-2400x1800-jpg, already in Studio (the map entry's only photo, the gallery copy of the p.84 photograph; the dry run found it, 2400x1800). Hotspot x 0.48 y 0.62 w 0.9 h 0.6, on the two children and the circles. The alt names StreetBond and Collingwood, which the records prove.

## Left out

- The street address in the map's comment: the contact rule, and the park's name places it.
- The month of opening: the comment's "August" is the only place it appears; the entry and its excerpt say 2023.
- An install year, installer, client, designer, area or colour names: no record gives them. What "Awen'" means: no record says.
- StreetBondSR: the splash pad spread specifies it, but this job's record names StreetBond only, and three other splash pad drafts already make that point.
- The splash pad spread's line "Splash pad surfaces are uniquely demanding: constant water exposure, chemical treatments, bare feet." and its note "skid resistant, UV stable": saint-antoine-sur-richelieu-splash-pad quotes the first word for word, and two more drafts quote the note, so neither is repeated. Likewise "a worn pad is recoated between seasons" (saint-antoine-sur-richelieu-splash-pad).
- Length: about 256 words by the script's count, under the brief's 300 for a thin record. The record stops at the place, the opening year, the photograph and the book's spread.
