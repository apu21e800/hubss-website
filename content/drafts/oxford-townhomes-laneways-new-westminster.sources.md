# Sources: Stamped asphalt laneways at Oxford Townhomes in New Westminster

/blog/oxford-townhomes-laneways-new-westminster · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/oxford-townhomes-laneways-new-westminster.md` · 28 Oct 2026

Map job 9 of the 40 with no write-up. The slug is the one the map is pointed at. Line numbers are on branch feat/map-posts as it stood on 28 Oct 2026. A thin record: the post stops at about 293 words (the dry run's count).

## What the record holds

- lib/map-projects.ts:526–545, `new-westminster-oxford`. Comment (:527–529): "Product Book p.80: "New Westminster, British Columbia" (file: Oxford townhomes). Oxford Townhomes, 728 Ewen Ave, Queensborough; Square One records StreetPrint and StreetBond on its laneways." Title "Oxford Townhomes laneways" (:531), New Westminster, BC (:532–533), product StreetPrint (:536), systems ["StreetBond"] (:537), application Townhomes (:538), no year, not `approximate`, one photo, cdn("9cb38dd6928271deee36b97e05901703b5e1dfdb-1800x2400.jpg"), "applications/townhomes/townhomes-21 (Product Book p.80)" (:540), ideaBookPage 80 (:542), excerpt "Charcoal StreetPrint on the strata laneways of Oxford Townhomes in Queensborough." (:544).
- lib/idea-book-edition.ts:273–277: the Projects divider leaf, pages 80–81, title "Projects", photo "StreetPrint laneways at the Oxford Townhomes, New Westminster, British Columbia", caption "New Westminster, British Columbia". A divider leaf has no `mapId` field (the type, :74), so the tie of p.80 to this job rests on the map's ideaBookPage (:542) and photo note (:540), the leaf's alt, and the photograph: the p.80 render and the map's photo are the same frame (the book crops it square). Flagged in the report.
- The printed pages, read as images: p.80 (public/catalogue/2026-27/p080-1400.webp), the photograph full bleed with the caption "New Westminster, British Columbia"; p.81, the word "Projects" over a different photograph (a paver-pattern crossing, not this job, so not described).
- lib/idea-book-print.ts:91–103 (StreetPrint as printed, book p.19) and :357–368 (the townhomes spread, book p.74), both renders read; lib/products.ts:184–213; lib/applications.ts:192–202; docs/GLOSSARY.md:32 and :74.
- The photo: the cdn file above, downloaded and read (1800x2400), the buildings checked at full size.

## Left out, and why

- "728 Ewen Ave": a street address; none on the site.
- Square One: the comment says Square One "records" StreetPrint and StreetBond on the laneways, which is evidence for the systems; it does not say who installed them, so no installer is named.
- Install year, developer, strata, quantity, cost: no record gives one. Whether the asphalt was new or existing when it was stamped: no record says; the post gives the book's "new or existing asphalt".
- The stamping template's name: no record names it (the gallery sheet's eye note is not a record), so the pattern is described from the photograph only.
- The white line across the lane: what kind of marking it is (a stop bar or another) is not plain, so it is only "a white line".
- DuraShield, the third system on the townhomes spread: not on this job. The spread's pull line ("Townhome and strata developments need to have a positive first impression.") and its "the look of clay pavers or stone cobble": not quoted, because other drafts quote them; the second is paraphrased.
- The book's "no slip, no trip" on StreetPrint's page: a promise (docs/GLOSSARY.md:34, "non-slip" as a promise), so not used. The plow blade from the same line: true, but less to the point on a strata laneway, and the post keeps it short.

## First paragraph

- "Residents of Oxford Townhomes, a strata development in Queensborough, New Westminster, British Columbia, have garages that open onto its laneways": the photograph (garage doors facing the lane on both sides); "strata" is the map's word (:544, "the strata laneways"); the place, :528, :532–533, :544. Not approximate, so the development is named.
- "the lanes themselves are charcoal StreetPrint stamped asphalt, coloured with StreetBond": :536–537, :544 ("Charcoal StreetPrint"); lib/idea-book-print.ts:94 ("then coloured with StreetBond coatings"). The link text says "stamped asphalt" (docs/GLOSSARY.md:74).
- "HUB Surface Systems' Product Portfolio Book · Volume 5 begins its Projects section with a photograph of them, on page 80": lib/idea-book-edition.ts:274–276 (section "projects", pages 80–81, title "Projects"); the p.80 and p.81 renders. The book is HUB's (lib/catalogue.ts:77). HUB's only mention was in the Lunch & Learn close, cut on 28 Oct 2026, so the company is named here, in full.

## A field of stone and a band along the curb

- All of it is what the photograph plainly shows: a wet laneway; past a white line across it, a field of stamped stones of different sizes; in the foreground, a band of larger stamped stones along the curb beside plain asphalt; grey three-storey townhomes with white garage doors on both sides; a curbed planting bed at the corner on the right.

## A pattern pressed into the lane

- "StreetPrint, a Canadian invention, has been installed since 1992, and the book calls it the original stamped asphalt": lib/idea-book-print.ts:92–93 ("Stamped asphalt." "The original. Since 1992. A Canadian invention, eh?"); lib/products.ts:195 ("a Canadian invention, installed since 1992").
- "The pattern goes in with a steel wire-rope template pressed into heated asphalt, and then StreetBond coatings colour it": docs/GLOSSARY.md:32; lib/idea-book-print.ts:94, :96 ("Stamping + StreetBond coating").
- "so the stones in the photograph are impressions in the lane itself": what StreetPrint is (stamped asphalt, :92, :94), on the stamped field in the photograph.
- "With no joints or pavers in it, the lane has nothing to weed and nothing to settle, and the finished surface stays flush": :94 ("The surface stays flush ... no joints to weed, no pavers to settle"), reworded.
- "The book gives the system 10–20 years of service on new or existing asphalt": :98 ("Service life", "10–20 years"), :99 ("Base", "New or existing asphalt").
- "The process on site is set out in the stamped asphalt install guide": the published guide how-stamped-asphalt-is-installed (read in full through the public API on 28 Oct 2026: reheat, stamp, coat; 10 to 20 years, as the book). The same subject, so linked once.

## Shared drives with the look of stone

- "The book's townhomes spread is headed “Cohesive hardscape for strata developments.”": lib/idea-book-print.ts:358; book p.74. The job's application is Townhomes (lib/map-projects.ts:538).
- "It writes of entry courts and shared drives made to look like clay pavers or stone cobble": :360 ("Entry courts and shared drives with the look of clay pavers or stone cobble."), paraphrased.
- "its next sentence is “Almost no maintenance and easy to refresh.”": :360.
- "On that spread StreetPrint does the stamping and StreetBond the colour and sealing": :362 ("stamped entry courts and driveways"), :363 ("colour and sealing").

## The close

- The piece ends on the townhomes spread. The Lunch & Learn close was taken out on 28 Oct 2026: thirteen of the forty map posts ended on one.

## Links (each checked)

/products/streetprint (first mention, "stamped asphalt" in the text), /products/streetbond (first mention), /product-book/80, /blog/how-stamped-asphalt-is-installed (published, Guide), /applications/townhomes. Each once. No outside links.

## Photo

image-9cb38dd6928271deee36b97e05901703b5e1dfdb-1800x2400-jpg, already in Studio (applications/townhomes/townhomes-21, the map's photo). The dry run found it at 1800x2400. Alt: "Charcoal StreetPrint stamped asphalt on a laneway at Oxford Townhomes, New Westminster, British Columbia" (the system and the place from the map). Hotspot x 0.5 y 0.55 w 0.95 h 0.42: a portrait photo, so a landscape cut keeps the garage doors and the stamped field below them.
