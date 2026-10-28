# Sources: A herringbone walkway at the Charlottetown cruise terminal

/blog/charlottetown-cruise-terminal-walkway · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/charlottetown-cruise-terminal-walkway.md` · 27 Oct 2026

Map job 40 of the 40 pins with no write-up. The slug is the one the map is pointed at. Every statement below is from the map entry, the printed Product Portfolio Book (page renders p019, p020, p134 and p135 in public/catalogue/2026-27, read as images), the site's application files, a published post, or the photographs. Line numbers are on branch feat/map-posts. About 260 words: the record is one spread.

Written beside the other StreetPrint map posts (Mission, Kanaka Springs, Woodstock, Oxford Townhomes, North Cowichan), which set out the reheat, stamp and coat method, the herringbone templates and the "nothing for a plow blade to catch" line, and four of which close on a StreetPrint Lunch & Learn. This piece keeps the method to two sentences, links the install guide for the rest, and ends there.

## What the record holds

- lib/map-projects.ts:1774–1792. Comment: "Product Book pp.134–135: "Charlottetown, PEI: the cruise ship terminal walkway, stamped in a herringbone basket-weave and sealed with StreetBond". Pin on the boardwalk between the cruise berth and the marina." Entry: title "Cruise terminal and marina walkway" (:1778), city Charlottetown, PE (:1779–1780), product StreetPrint (:1783), systems StreetBond (:1784), application Public Spaces (:1785), not approximate, images `cdn("ad11a0a01590f3d3c37ace7e2c30bc4bc1b66b30-1280x349.jpg")` (:1787), ideaBookPage 134 (:1789), excerpt (:1791). No year, client, installer, designer, length or cost.
- lib/idea-book-edition.ts:466–470: the statement leaf, pages 134–135, eyebrow "Waterfront", title "Where the ships come in.", body "Charlottetown, PEI: the cruise ship terminal walkway, stamped in a herringbone basket-weave and sealed with StreetBond. Pedestrians, rolling luggage, salt air. Built for all of it.", photo page 135, alt "The StreetPrint herringbone walkway along the Charlottetown waterfront, Prince Edward Island", caption "Charlottetown, Prince Edward Island" / "Cruise Ship Terminal & Marina Walkway", `mapId: "charlottetown-cruise-terminal"`. Checked against the p134 and p135 renders: the same words (the print has em dashes where the edition writes a colon and a full stop; nothing is quoted across them).
- The system: the printed page names the method (stamped, sealed with StreetBond) but not the word StreetPrint. StreetPrint is the map's product (:1783) and the edition's alt (:469), and the method is StreetPrint's as the book prints it (lib/idea-book-print.ts:94, "Patterns are stamped into existing asphalt, then coloured with StreetBond coatings"; lib/idea-book-edition.ts:190, "StreetBond creates the colour, and seals the asphalt"). No record disagrees.

## First paragraph

- "The cruise ship terminal walkway in Charlottetown, Prince Edward Island": edition :468; caption :469.
- "carries pedestrians and their rolling luggage in the salt air, and HUB Surface Systems' Product Portfolio Book · Volume 5 says it was built for all of it": edition :468 ("Pedestrians, rolling luggage, salt air. Built for all of it."). Restated, not quoted, so the book's three-part fragment is not repeated.
- "The walkway is StreetPrint stamped asphalt": map :1783; edition alt :469; see the note above. Link text per docs/GLOSSARY.md:74.
- ""stamped in a herringbone basket-weave and sealed with StreetBond,"": edition :468, word for word.

## Between the cruise berth and the marina

- The heading: map comment :1775–1776 ("Pin on the boardwalk between the cruise berth and the marina").
- "a spread to itself, pages 134 and 135, headed "Where the ships come in"": edition :466–467.
- "its caption names the Cruise Ship Terminal & Marina Walkway": edition :469; p135 render.
- "The spread's one panorama follows the walkway past a cruise ship at the pier and on to the marina, where it curves around a basin of moored boats": pp.134–135 print one panorama across the spread (the cover is the same panorama): its left half, p134, the walkway and a cruise ship at the pier; its right half, p135, the marina and the curved curb (renders looked at again on 28 Oct 2026). The ship is not named.
- "At the berth, light standards stand along the pier and a yellow bollard stands near the edge. A rope rail strung between timber posts runs along a yellow timber curb at the water's edge. The pattern reads as small bricks in a dark red-brown, crossed by the shadows of the rope": the panorama (p134, p135 and the cover). The tall poles stand on the concrete pier at the berth, not along the walk.

## The asphalt under the herringbone

- "StreetPrint is a pattern stamped into asphalt, then coloured and sealed with StreetBond, as the book describes it": lib/idea-book-print.ts:94 (page 19); lib/idea-book-edition.ts:190 (page 20, "StreetBond creates the colour, and seals the asphalt"). StreetBond is linked here, at its first mention outside a quotation.
- "With no pavers laid in it, the walk has nothing to settle or heave": lib/idea-book-print.ts:94 ("no pavers to settle"); lib/applications.ts:211 ("nothing settles, nothing heaves", said of StreetPrint driveways).
- "the book gives StreetPrint a service life of 10–20 years on new or existing asphalt": lib/idea-book-print.ts:98–99. No record says whether this walkway was new or existing asphalt.
- "The public spaces page makes the same case for plazas and transit forecourts: the look of stone paving, with the asphalt's own flexibility": lib/applications.ts:173 ("Plazas, transit forecourts, campuses and civic squares ... StreetPrint stamps a pattern into the asphalt itself, so a plaza gets the look of stone paving with the asphalt's own flexibility").
- "Each stage of the method is in how stamped asphalt is installed": the published guide (posts-index-published.json), the same system and method; it agrees with the book (reheat, stamp, coat; 10 to 20 years).

## Links (each checked, 200 on hubss.com, 27 Oct 2026)

/products/streetprint ("StreetPrint stamped asphalt"), /products/streetbond; /product-book/134 (the spread's first page); /applications/public-spaces; /blog/how-stamped-asphalt-is-installed. Each once; no paragraph links one page twice. No outside links. The piece ends on the install guide, not the Lunch & Learn.

## Photo

image-ad11a0a01590f3d3c37ace7e2c30bc4bc1b66b30-1280x349-jpg, already in Studio, the map entry's only photo (:1787), downloaded and read: a panorama of the walkway curving around the marina, a cruise ship at the pier on the left. 1280 px wide, so the hero is full-bleed; at 1280 x 349 the frame is a strip and both cuts crop hard. Hotspot x 0.42 y 0.6, between the walkway's curve and the boats, so a laptop's cut keeps the ship's bow and a phone's keeps the rope rail and the stamped surface. Alt: what it shows, with the stamped herringbone and the place from the record.

## Left out

- The cruise ship's name (partly legible on p.134) and the terminal's operator: not the job.
- Which template made the pattern: "herringbone basket-weave" is the book's phrase and not a name on its templates list (lib/idea-book-edition.ts:195–205), so no template is named.
- Install year, owner, installer, designer, length and cost: no record states them.
- Any claim about salt resistance beyond the book's "Built for all of it": no system sheet in the record makes one.
- The StreetPrint page's subhead ("The original. Since 1992. A Canadian invention, eh?": stacked fragments and a question) and the Public spaces spread's lines ("aesthetics", "imprinted", "Vibrant"): not quoted.
