# Sources: Brick-pattern TrafficPatternsXD in a new Kleinburg neighbourhood

/blog/kleinburg-crosswalk-trafficpatternsxd · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/kleinburg-crosswalk-trafficpatternsxd.md` · 28 Oct 2026

The write-up for the homepage map's pin `kleinburg-crosswalk` (job 25 of the 40 without one). Each statement about HUB, a system, the place or the photograph, then the line it rests on. Line numbers are on feat/map-posts at fede3fd. The printed pages were read from their renders (public/catalogue/2026-27/p012, p013, p016, p017 and p111), and the photo was downloaded from Sanity's CDN and looked at.

## What the record holds

- lib/map-projects.ts:1280–1281, the comment: "Product Book p.12, the TrafficPatternsXD page: "Kleinburg, Ontario". The street is a new subdivision, not identified: pin at the village."
- :1282–1297, the entry: title "Kleinburg crosswalk", Kleinburg, ON, product TrafficPatternsXD, application Crosswalks, approximate: true (:1290), one photo, cdn 45923d5f…-2400x1800 (:1292, "applications/crosswalks (Product Book p.12)"), ideaBookPage 12 (:1294), excerpt "Red brick-pattern TrafficPatternsXD holding its pattern through the first snow in a new Kleinburg neighbourhood." (:1296). Approximate, so the post names the town and "a new neighbourhood", never a street.
- The book: pp.12–13, the TrafficPatternsXD system spread. lib/idea-book-edition.ts:166 (a "system" leaf): the photograph is p.12, alt "A brick-pattern TrafficPatternsXD crosswalk in Kleinburg, Ontario", caption "Kleinburg, Ontario". The words are p.13, lib/idea-book-print.ts:78–90: headline "For the toughest environments." (:79), subhead "Aggregate-reinforced, preformed thermoplastic. Traffic tough, proven coast to coast." (:80), body (:81), specs 150 mil, 8–9 Mohs, 60 BPN (ASTM E303), 10+ years (:83–86), uses Crosswalks, Entrances, Transit, Streetscapes (:88).
- How p.12 is tied to this job: a system leaf has no `mapId` field (the Leaf type, lib/idea-book-edition.ts:75), so the edition cannot name the job's id. The tie rests on the printed caption (Kleinburg, Ontario), the map entry's ideaBookPage 12 and its comment, the edition's alt (Kleinburg), and the photograph: the p.12 render and the CDN photo are the same frame (the CDN copy is wider). Flagged in the report. The drafts for Saint John (p.24), the Toronto fleet lot (p.28), DuraTherm in Toronto (p.34) and Delta (p.38) tie their system pages the same way; the Kelowna draft (p.85, a partner page) does not.

## Opening

- "The camera sits almost on the pavement. Red brick units run away from it in staggered courses between two white lines, and snow covers the ground to the left while the road on both sides is wet.": the photograph, by eye (cdn 45923d5f… and the p.12 render); "Red brick-pattern" is also the record's (map :1296).
- "This is a TrafficPatternsXD crosswalk in a new neighbourhood in Kleinburg, Ontario.": map :1281 ("a new subdivision"), :1284–1285, :1288, :1296.
- "HUB Surface Systems gives TrafficPatternsXD a spread of its own, pages 12 and 13, in the Product Portfolio Book · Volume 5, and the spread opens with this photograph: a full page captioned Kleinburg, Ontario, opposite the system's figures.": lib/idea-book-edition.ts:166; the p.12 and p.13 renders. First mention of HUB and of the book, both in full.
- "Behind the crosswalk, new houses with snow on their roofs line the street, and a dark flat-roofed shade structure rises behind a stone wall.": the photograph, by eye.

## Brick joints pressed into the asphalt

- "The book's installation spread takes TrafficPatternsXD in order. The panels are positioned on the prepared asphalt and heated, and then a template is vibrated into the hot material, so it locks into the asphalt below.": pp.16–17, lib/idea-book-edition.ts:173–181 (Place :176, "positioned precisely on the prepared surface"; Stamp :178, "vibrate the template into the melted surface, while keying into the asphalt below"), in plain words; "prepared asphalt" is lib/products.ts:96. The Heat step's "fuses ... creating a permanent ... surface" (:177) and "melted" are not used (docs/GLOSSARY.md).
- "The joints between the Kleinburg bricks are the lines that template left.": the Stamp step; docs/GLOSSARY.md ("presses a pattern through the material into the top of the asphalt").
- "Being stamped into the top of the asphalt is what the site's product page credits for the way the system holds "under plow blades, road salt and the freeze-thaw that follows".": lib/products.ts:96 ("It is heated on prepared asphalt and stamped through into the top of the asphalt, which is what makes it hold under plow blades, road salt and the freeze-thaw that follows."); Studio's description says the same (public API, read 28 Oct 2026). The post does not say a plow has been over this crosswalk.
- "It is an asphalt system, and concrete is outside its range.": lib/products.ts:103 (Surfaces: Asphalt); docs/GLOSSARY.md.

## The figures on page 13

- "The page facing the photograph is the system's own. Under its headline the book prints "Aggregate-reinforced, preformed thermoplastic. Traffic tough, proven coast to coast."": p.13 render; lib/idea-book-print.ts:80.
- "The figures on the page are a thickness of 150 mil, aggregate rated 8–9 on the Mohs scale, skid resistance of 60 BPN under ASTM E303, and a service life of 10+ years.": lib/idea-book-print.ts:83–86.
- p.13's uses strip (lib/idea-book-print.ts:88, Crosswalks first): no longer cited. Nine of the map posts from Ontario east cited a uses strip; two keep it (the Toronto fleet lot and Mont-Mégantic).

## Links (each checked)

/products/traffic-patterns-xd, /product-book/12 and /product-book/16, each once. snowplow-safe-decorative-pavement is not linked: nothing in the record says a plow has been over this crosswalk, and the book's plow page (p.111, read) shows a different job.

## Photo

image-45923d5f5766871a7d252b0415f656d9850642c6-2400x1800-jpg, already in Studio (the map entry's only photo; the dry run found it, 2400x1800). Hotspot x 0.5 y 0.62 w 0.95 h 0.75, on the crosswalk, which fills the lower two-thirds of the frame. The alt names TrafficPatternsXD and Kleinburg, which the records prove.

## Left out

- The street: a street sign stands in the photograph, but the record says the street is not identified and the pin is approximate.
- "the first snow": the excerpt's reading of the photograph; the post says what the photograph shows (snow beside the crosswalk), not which snow it was.
- The green strip on the road at the right of the photograph: what it is is not plain.
- An install year, builder, installer or municipality: no record names them.
- The p.13 headline "For the toughest environments." and "Proven in high traffic with concentrated wheel loads.": other drafts quote both; the subhead, which none of them uses, is quoted instead.
- Length: about 271 words by the script's count, under the brief's 300. The record is a town, a photograph and the system's pages.
