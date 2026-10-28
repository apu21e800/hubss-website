# Sources: TrafficPatternsXD at the entrance to the Audi dealership in Vaughan

/blog/audi-vaughan-entrance · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/audi-vaughan-entrance.md` · 28 Oct 2026

A Project post for map job 26 (`vaughan-audi`), one of the 40 pins whose card said "More projects" (Vern, 27 Oct 2026: "if it's on the map it should have it's own landing page"). The map points at this slug. Line numbers are on branch feat/map-posts.

## What the record holds

- lib/map-projects.ts:1324–1343. Title "Audi Vaughan entrance" (:1330), Vaughan, ON (:1331–1332), TrafficPatternsXD (:1335), Commercial Spaces (:1336), photo `local("vaughan-audi")`, "Product Book p.109" (:1338), ideaBookPage 109 (:1340), excerpt "Crisp TrafficPatternsXD lines at the entrance to the Audi dealership in Vaughan, accenting the building as customers arrive" (:1341–1342). Not `approximate`.
- The comment above it (:1325–1328) quotes p.109 and adds "Audi Vaughan's new store is at 131 Four Valley Dr (the photo shows a new building; not matched against imagery)".
- The printed page, p.109 (lib/idea-book-edition.ts:379, the edition's record with `mapId: "vaughan-audi"`; the render public/catalogue/2026-27/p109-1400.webp, read): eyebrow "Retail", headline "First impressions.", body "Like the Audi brand, crisp, clean lines provide the perfect solution as you arrive at the dealership. Accenting the building in a unique way.", caption "Vaughan, Ontario | TrafficPatternsXD".
- The system's page, p.13 (lib/idea-book-print.ts:78–90, render read), and the steps spread, pp.16–17 (lib/idea-book-edition.ts:172–182).

## Left out, and why

- The street address in the map comment: one weak source ("not matched against imagery"), and the house rule keeps street addresses off the site.
- That the building is new: the comment's reading of the photo, nowhere else.
- Install year, installer, quantity, colour names, cost: no record gives them.
- The book's words "the perfect solution" (the lint flags "solution"): the post quotes the two parts of the page's text around them, word for word.
- Who the client was: the book names the dealership and the brand, not who ordered the work, so the post says "at the Audi dealership", never "for Audi".

## First three paragraphs

- "The Product Portfolio Book · Volume 5 files the Audi dealership in Vaughan, Ontario, under Retail, with the headline “First impressions.”": p.109, lib/idea-book-edition.ts:379 (eyebrow "Retail", title "First impressions.", caption "Vaughan, Ontario"). "Retail" is the book's own label for the page, not one of the site's applications. The link opens /product-book/109 (lib/map-projects.ts:1340). First mention of the book, in full. The opening was rewritten on 28 Oct 2026: it had the same shape as the Mont-Mégantic post's.
- "The surface at the entrance is TrafficPatternsXD": p.109 caption; the map excerpt's "at the entrance to the Audi dealership" (lib/map-projects.ts:1342).
- "aggregate-reinforced preformed thermoplastic": p.13 subhead (lib/idea-book-print.ts:80). "“the toughest material in the product range”": p.13 description (:81), quoted.
- The photograph (the map's copy, public/images/map/vaughan-audi.jpg, is the same frame as p.109, taller): a grey building, the four rings and red "Audi" lettering high on the wall, overhead glass doors, a grid of light grey squares with a border of darker grey, a straight edge where it meets dark asphalt. Nothing else is read into it.
- "The words on the page compare the lines to the brand on the wall ... and end on what the surface does for the architecture": p.109 body, its two sentences. Both quotes are copied from it: "Like the Audi brand, crisp, clean lines" and "Accenting the building in a unique way." "the brand on the wall": the rings and lettering in the photograph.

## How the grid gets its lines

- "goes in on asphalt only": lib/products.ts:103 ("Surfaces: Asphalt"); docs/GLOSSARY.md:30 ("Asphalt only").
- "the three steps the book prints as Place, Heat and Stamp": pp.16–17, lib/idea-book-edition.ts:174–178.
- "The lines of a grid like this one are the stamping template's impressions, pressed through the material into the top of the asphalt": the Stamp step, p.17 ("Place the desired template on the surface and vibrate the template into the melted surface, while keying into the asphalt below", lib/idea-book-edition.ts:178); docs/GLOSSARY.md:30 ("a wire-rope grid presses a pattern through the material into the top of the asphalt"); lib/products.ts:96 ("stamped through into the top of the asphalt").
- Cut on 28 Oct 2026: the sentence paraphrasing the Place and Stamp steps ("The 150 mil panels are positioned on the prepared asphalt and heated, then a template is vibrated into the softened material, “keying into the asphalt below”"). The Kleinburg and Toronto parking lot drafts paraphrased p.16 the same way; Kleinburg keeps it.
- "Anti-skid aggregate rated 8–9 on the Mohs scale runs through the full cross-section, so the grip lasts as the surface wears": p.13 Aggregate 8–9 Mohs (lib/idea-book-print.ts:84); lib/products.ts:96, :100.
- "60 BPN under ASTM E303 ... 10+ years": p.13 (lib/idea-book-print.ts:85–86).

## Where a dealership entrance sits in the book

- "The book's spread on commercial spaces names one system, TrafficPatternsXD, for “pedestrian channelization; the look of pavers, stones and cobbles”": p.72 (lib/idea-book-print.ts:349–356; render read; eyebrow "Commercial spaces", the only SPECIFY line). The spread's photograph is Oakville (p.73, `oakville-ten-years`), so nothing from it is said about this job.
- "Page 13, the system's own, gives skid resistance ... and the service life": the figures above.
- Cut on 28 Oct 2026: p.13's uses strip ("page 13 lists entrances among the system's uses"; nine map posts cited a uses strip), the Toronto Premium Outlets paragraph (p.86, 14 years; the Oakville post keeps that comparison) and the closing line "The Audi dealership is page 109" (six of the forty ended on a book page; the page is linked in the first paragraph now). The piece ends on the commercial spaces spread.

## Links (each checked)

/product-book/109 (first paragraph), /products/traffic-patterns-xd, /applications/commercial-spaces. Each once. No outside links.

## Photo

public/images/map/vaughan-audi.jpg (864 x 1184, the map's own copy of the p.109 photograph; uploaded on the real run). Alt: "A grey TrafficPatternsXD grid along the front of the Audi dealership in Vaughan, Ontario" (the system from the p.109 caption, the place from the caption and the page's text). Hotspot x 0.55 y 0.66 w 0.9 h 0.5, on the grid and the doors: the photo is portrait and the pattern fills its lower half. It is under 1600 px; the map keeps a local copy because this photo has no gallery copy in Studio (the note above the list in lib/map-projects.ts: the twelve without one are in /public/images/map).
