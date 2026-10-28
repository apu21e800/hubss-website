# Sources: A brick-pattern crosswalk at a Toronto parking lot entrance

/blog/parking-lot-crosswalk-toronto · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/parking-lot-crosswalk-toronto.md` · 28 Oct 2026

Map job 31, `toronto-lot-crossing`. The slug is the one the map is pointed at. Each statement, then the line it rests on. Line numbers are lib/ and docs/ on branch feat/map-posts as read on 28 Oct 2026. The book's pages were read on the renders in public/catalogue/2026-27/ (p088, p078, p013, p016).

## What the record holds

- lib/map-projects.ts:1517–1518 (comment): "Product Book p.88: 'Toronto, Ontario | TrafficPatternsXD'. The site is not identified: approximate."
- lib/map-projects.ts:1519–1533: title "Parking lot crossing" (:1520), Toronto, ON (:1521–1522), product TrafficPatternsXD (:1525), application Parking Lots (:1526), `approximate: true` (:1527), photo cdn("0e688868164667090ff2ef5a09ccb57bf0770b12-2400x1800.jpg"), the applications/crosswalks gallery copy of the p.88 photograph (:1529), ideaBookPage 88 (:1531), excerpt "A brick-pattern TrafficPatternsXD crossing at a busy parking lot entrance in Toronto." (:1533).
- lib/idea-book-edition.ts:300–301: page 88 is a leaf of its own, a full-bleed photograph with the caption { place: "Toronto, Ontario", system: "TrafficPatternsXD" } and no eyebrow, headline or body. The printed page says the same: the photograph and "Toronto, Ontario | TrafficPatternsXD".
- The photograph (the cover, downloaded and read): one pedestrian with a green plastic shopping bag in one hand and a white bag in the other, on a pale red brick-pattern crosswalk between two white edge lines, across a drive from curb to curb; a silver SUV at the far line; a lot full of parked cars behind; stop signs; a grassy bank and towers beyond.

## What I left out, and why

- The site, its owner and its address: not identified (`approximate: true`), so the piece names Toronto only.
- Install year, installer, client, size, cost: no record gives one.
- Page 89, which faces page 88 in the book (Multiseal, "HUB master installer · Ontario"): no record says Multiseal installed this crosswalk, so the facing page is not mentioned.
- "busy" (the map's excerpt): the piece says what the photograph shows instead, a lot full of parked cars.
- The Parking lots spread's headline ("First impressions. Solutions for any budget.") and body ("adding aesthetic value"): words on the lint's filler list (lib/style-lint.ts:206, :213). Its pull line, "Parking lots need to be tough.", is quoted in the e-blast guide content/drafts/parking-lot-design-year-after-year.md with the same SPECIFY note, so this piece gives the SPECIFY note alone.
- "Proven in high traffic with concentrated wheel loads." (p.13): four other map posts quote it (Bramalea, Granville Island, Railway Lands and the BRT guide), so this piece gives p.13's figures instead.
- The Heat step's words ("fuses the panels to the pavement, creating a permanent, skid-resistant surface", lib/idea-book-edition.ts:177): docs/GLOSSARY.md:28 and :82 ("fuses", "permanent"), so the piece says "heated".
- "crossing" (the map's title and excerpt, the book's "high-traffic bays and crossings"): written as "crosswalk" (docs/GLOSSARY.md:51; the brief).
- Who the pedestrian is, and whether the SUV is stopping: the photograph does not say.

## First paragraph

- "A pedestrian with a bag in each hand walks across a brick-pattern crosswalk": the photograph. "brick-pattern": lib/map-projects.ts:1533.
- "at a parking lot entrance in Toronto, Ontario": lib/map-projects.ts:1533 ("at a busy parking lot entrance in Toronto"), :1521–1522; book p.88 caption. Province spelled out: docs/STYLE.md:71–73.
- "The pattern is TrafficPatternsXD": book p.88 caption; lib/map-projects.ts:1525.
- "in HUB Surface Systems' Product Portfolio Book · Volume 5 the photograph has a page to itself, with nothing printed on it but the city and the system's name": lib/idea-book-edition.ts:300–301 (one-page leaf, full bleed, caption only); the printed page. The book's full name at first mention: lib/catalogue.ts:77.

## A brick pattern from curb to curb

- The joints, the pale red bricks in offset rows, the two white edge lines, curb to curb across the drive, the silver SUV at the far line, the rows of parked cars: the photograph. The edge lines are described, not credited to any system.

## The template that made the brick lines

- "TrafficPatternsXD goes down on asphalt only, in sheets of aggregate-reinforced preformed thermoplastic 150 mil thick": lib/products.ts:98–99, :103 ("Surfaces: Asphalt"); book p.13 (lib/idea-book-print.ts:80, :83); docs/GLOSSARY.md:30 ("Asphalt only").
- "The lines in this crosswalk were made by a template vibrated 'into the melted surface, while keying into the asphalt below,'": the Stamp step, lib/idea-book-edition.ts:178 ("Place the desired template on the surface and vibrate the template into the melted surface, while keying into the asphalt below."). The crosswalk is TrafficPatternsXD (p.88), so it went in this way; docs/GLOSSARY.md:30.
- "in the words of the book's step pages": pp.16–17, "Place. Heat. Stamp." (lib/idea-book-edition.ts:172–182); the link opens page 16, where the steps are printed.
- "once the panels were in place on the prepared asphalt and heated": the Place step, :176 ("panels are positioned precisely on the prepared surface"), and the Heat step, :177.
- Cut on 28 Oct 2026: "HUB's product page credits that keying for the way the sheet holds up to plow blades and road salt" (lib/products.ts:96). The Kleinburg draft makes the same point from the same line and keeps it.

## Where the book puts it in a parking lot

- "On the Parking lots spread, page 78, the book's list of systems to specify names TrafficPatternsXD, 150 mil and aggregate-reinforced, for a lot's high-traffic bays and its crosswalks": lib/idea-book-print.ts:385 ("150 mil, aggregate-reinforced: high-traffic bays and crossings"), printed on p.78 under SPECIFY; "crossings" written as crosswalks.
- "8–9 Mohs aggregate, 60 BPN of skid resistance on the ASTM E303 test, and 10+ years of service life": book p.13 (lib/idea-book-print.ts:84–86).
- "HUB's parking lots page places it at the crosswalks between the stalls and the doors, where it holds under turning traffic": lib/applications.ts:90 ("For the crossings between the stalls and the doors, TrafficPatternsXD holds under turning traffic"); the same in Sanity (application-parking-lots, read 28 Oct 2026).

## The close

- "The Toronto photograph is page 88 of the book": lib/map-projects.ts:1531; lib/idea-book-edition.ts:301.
- "The guide to parking lot markings in preformed thermoplastic sets this crosswalk beside the system's other parking lot jobs in Ontario, and covers the arrows and stop bars a lot needs as well": /blog/parking-lot-line-painting-vs-thermoplastic (published; title "Which parking lot markings to put in preformed thermoplastic"), its sentences "Fairview Park in Kitchener, Ontario, has TrafficPatternsXD crosswalks ... and a busy parking lot entrance in Toronto has a brick-pattern crosswalk in the same material" and "The Product Portfolio Book prints a crosswalk at a grocery store in Oakville, Ontario", with Toronto Premium Outlets in Halton Hills; its section "The markings that carry legal weight" covers PreMark arrows and stop bars.
- No Lunch & Learn close: this piece ends on the book's page and the related guide.

## Links (each checked)

/products/traffic-patterns-xd (first mention), /product-book/16, /product-book/78, /product-book/13, /applications/parking-lots, /product-book/88, /blog/parking-lot-line-painting-vs-thermoplastic (in the published index; it is about the same subject and names this job, and its figures are the book's: 150 mil, 8–9 Mohs, 60 BPN, 10+ years). No link to any guide on the brief's do-not-link list, no outside link, no page linked twice in a paragraph.

## Photo

image-0e688868164667090ff2ef5a09ccb57bf0770b12-2400x1800-jpg, the map entry's photo (lib/map-projects.ts:1529), already in Studio (the dry run found it at 2400x1800). Alt: what the photo shows; the system and the city from p.88's caption, "parking lot entrance" from the map's excerpt. Hotspot x 0.5 y 0.45 w 0.9 h 0.85, on the walker and the crosswalk.

## Checked against the other map posts

Compared sentence by sentence with every draft in content/drafts on 28 Oct 2026: no shared sentence. The step-page paraphrase, the TrafficPatternsXD sheet sentence and the figures were reworded after the first check, where they ran close to the Kleinburg, Audi and Bramalea drafts.

## Length

About 314 words in the dry run's count (headings included). The record is a caption and a photograph, so the piece stops at the system's facts and the book's parking lot page.
