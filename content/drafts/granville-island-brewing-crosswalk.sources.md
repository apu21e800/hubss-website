# Sources: A TrafficPatternsXD crosswalk outside Granville Island Brewing

/blog/granville-island-brewing-crosswalk · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/granville-island-brewing-crosswalk.md` · 28 Oct 2026

Map job 5 of the 40 pins with no write-up (BRIEF.md, 27 Oct 2026). The slug is the one the map is pointed at. Each statement about HUB, the system, a number, the place or the book, then the line it rests on. Files and line numbers are on feat/map-posts at fede3fd. The book page is the printed Product Portfolio Book · Volume 5, p.130: the render public/catalogue/2026-27/p130-1400.webp was read, and its words checked against lib/idea-book-edition.ts. A thin record: about 319 words by the script's count.

The e-blast draft parking-lot-design-year-after-year (content/drafts, not yet published) describes this page and photograph in one paragraph, and several map drafts describe TrafficPatternsXD's install. Checked against every draft in content/drafts on 28 Oct 2026: no sentence or heading in common, and the bicycles the e-blast mentions are left out here.

## What the record holds

- lib/map-projects.ts:334–352, id vancouver-granville-island. Comment (:335–337): "Product Book p.130: "The first thing a customer walks on. Granville Island, Vancouver | TrafficPatternsXD". Square One published the same photo of its crossing at Granville Island Brewing, 1441 Cartwright St." Title "Granville Island Brewing crosswalk" (:339), Vancouver, BC (:340–341), product TrafficPatternsXD (:344), application Commercial Spaces (:345), not approximate, no year, one photo (:347, cdn fd5b0461…-2400x1800.jpg, products/traffic-patterns-xd/traffic-patterns-xd-45, book p.130), ideaBookPage 130 (:349), excerpt (:350–351): "A TrafficPatternsXD crosswalk outside Granville Island Brewing: the first thing its customers walk on."
- The book, p.130 (lib/idea-book-edition.ts:450, mapId vancouver-granville-island, badge "7 years old"; its photo is this job's photo, the same frame as the cdn file without the printed label): eyebrow "Commercial spaces", headline "The first thing a customer walks on.", caption "Granville Island, Vancouver | TrafficPatternsXD", and "7 YEARS OLD" printed on the photograph. No body text.
- The system: book p.13 (lib/idea-book-print.ts:78–90) and the install steps, pp.16–17 (lib/idea-book-edition.ts:172–182); lib/products.ts:87–110. The application: book p.72 (lib/idea-book-print.ts:349–356); lib/applications.ts:176–191.

## First paragraph

- "On Granville Island in Vancouver, British Columbia, the street in front of Granville Island Brewing has a crosswalk in a red brick pattern": caption "Granville Island, Vancouver" (lib/idea-book-edition.ts:450); map title and excerpt (:339, :350–351); the photograph (the brewery's sign over the entrance; the red brick pattern). Not approximate, so the site is named; the street address is not (see Left out).
- "it ends at the sidewalk outside the taproom door": the photograph ("TAPROOM" over the entrance, straight ahead of the crosswalk).
- "The crosswalk is TrafficPatternsXD": caption (:450); map product (:344).
- "HUB Surface Systems prints it in the Product Portfolio Book · Volume 5 under the headline 'The first thing a customer walks on.'": p.130 headline, word for word (:450). First mention of HUB and of the book, in full.

## Seven years old in the photograph

- "a red brick pattern in running bond between two white edge lines, with the 'Granville Island Brewing' sign high on the wall above the taproom's glass canopy": the photograph (the sign reads "Granville Island Brewing"; a glass canopy over the entrance). The white lines are not given a material: no record says what they are.
- "The cab and front wheels of a concrete truck fill the left of the frame, beside the crosswalk": the photograph. The truck's company name on the door is not used (third-party branding; not about the job).
- "The book labels the photograph on page 130 '7 years old,' in white letters in its corner": badge "7 years old" (:450); the render shows "7 YEARS OLD" in white at the lower right of the photograph. The post states the label and draws no result from it (BRIEF.md: no claim about how a job has held up unless a record says so).

## How TrafficPatternsXD goes in

- "The book introduces TrafficPatternsXD as 'The toughest material in the product range'": p.13 description, its opening words (lib/idea-book-print.ts:81).
- "aggregate-reinforced preformed thermoplastic, 150 mil thick": p.13 subhead, "Aggregate-reinforced, preformed thermoplastic." (:80); thickness (:83); lib/products.ts:96, :98–99.
- "The sheets are heated where they lie on the prepared asphalt; then a template, vibrated into the soft material, carries the brick pattern down into the top of the asphalt": the book's install steps, "Place" ("panels are positioned precisely on the prepared surface", lib/idea-book-edition.ts:176) and "Stamp" ("Place the desired template on the surface and vibrate the template into the melted surface, while keying into the asphalt below", :178); docs/GLOSSARY.md:30 ("heated on prepared asphalt and a wire-rope grid presses a pattern through the material into the top of the asphalt"). "The brick pattern": the pattern this job carries, in the photograph. The book's "Heat" step (:177: "fuses the panels ... creating a permanent ... surface") is not used: "fuses" and "permanent" are words the brief and the glossary keep out.
- "which is the only surface the system goes on": docs/GLOSSARY.md:30 ("Asphalt only"); lib/products.ts:103 (Surfaces: Asphalt).
- "The aggregate is rated 8–9 on the Mohs scale and runs through the full thickness": p.13 (lib/idea-book-print.ts:84); lib/products.ts:100 ("8–9 Mohs, through the full cross-section").
- "its skid resistance is 60 BPN under ASTM E303": p.13 (lib/idea-book-print.ts:85).
- "For service life the book gives 10+ years": p.13 (:86). "its description of the material includes 'Proven in high traffic with concentrated wheel loads.'": p.13 description, word for word in the quoted part (:81).

## A crosswalk at a customer's door

- "The book's commercial spaces spread lists TrafficPatternsXD as its only specified system, with the note 'Pedestrian channelization; the look of pavers, stones and cobbles.'": p.72 SPECIFY, a single line, word for word (lib/idea-book-print.ts:353). p.130's own label is "Commercial spaces" (lib/idea-book-edition.ts:450), and the map files the job there too (:345). The link goes to the site's commercial spaces page, which shows the spread.
- Toronto Premium Outlets (p.86, 14 years): cut, as the Oakville post makes the same comparison.

## The close

- Lunch & Learn: "for design and engineering teams" (docs/GLOSSARY.md:71: "HUB's ... session for a design or engineering team"; the word "free" is not used); 60 minutes (CLAUDE.md, "Lunch & Learn page", Doug 26 Oct 2026; lib/lunch-learn-content.ts:30); at your office or online (:42); lunch on HUB and a $25 voucher for an online session (components/sections/LunchLearnV2.tsx:55); no invoice (lib/lunch-learn-content.ts:34). Link /lunch-learn?topic=TrafficPatternsXD#book (lib/lunch-learn.ts). The second of the two of these five pieces that end on the Lunch & Learn (the other is north-cowichan-roundabout-apron); the two closing paragraphs share no sentence.

## Links (each checked)

/products/traffic-patterns-xd (first mention of the system), /product-book/130, /applications/commercial-spaces, /lunch-learn?topic=TrafficPatternsXD#book. No outside links. None of the seven guides the brief bars.

## Photo

image-fd5b0461832d32634e8ee7ca5d7bfa9c7779b10c-2400x1800-jpg, already in Studio (original file traffic-patterns-xd-45.jpg; the dry run found it, 2400x1800): the map's own photo (lib/map-projects.ts:347) and the photograph on p.130, without the book's printed label. Alt: "A red brick-pattern TrafficPatternsXD crosswalk between white edge lines, in front of the Granville Island Brewing taproom in Vancouver": system from the caption and the map, place from the caption, the map and the sign in the frame. Hotspot x 0.5 y 0.62 w 0.9 h 0.72, on the crosswalk and the entrance behind it.

## Left out, and why

- The installer: the comment says Square One "published the same photo of its crossing" (:336–337). That is one weak place, and "its" could mean the crossing's photo or Square One's job; no record says who installed it. Flagged in the report.
- The street address (1441 Cartwright St, in the comment, :337): no street addresses in a post (lib/field-note-drafter.ts:72; the contact rule in lib/style-lint.ts).
- The install year: no record gives one. The book's "7 years old" is printed with no date for the photograph or the install, so no year is worked out from it.
- The client, the brewery's part in the job, the size: no record gives them.
