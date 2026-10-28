# Sources: A paver-pattern parking lane on a Verdun street

/blog/verdun-paver-pattern-parking-lane · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/verdun-paver-pattern-parking-lane.md` · 28 Oct 2026

Map job 33, `verdun-parking-lanes`. The slug is the one the map is pointed at. Each statement, then the line it rests on. Line numbers are lib/ and docs/ on branch feat/map-posts as read on 28 Oct 2026. The book's pages were read on the renders in public/catalogue/2026-27/ (p131, p013, p054).

## What the record holds

- lib/map-projects.ts:1612–1613 (comment): "Product Book p.131: 'Long lasting parking lanes... Verdun, Québec | TrafficPatternsXD'. The street is not identified: pin at the borough hall, approximate."
- lib/map-projects.ts:1614–1628: title "Paver-pattern parking lane" (:1615), Verdun, QC (:1616–1617), product TrafficPatternsXD (:1620), application Traffic Calming (:1621), `approximate: true` (:1622), photo cdn("02ae81c199eb25441a4f4786353255f2c47cb1d5-1184x864.jpg"), the products/traffic-patterns-xd gallery copy of the p.131 photograph (:1624), ideaBookPage 131 (:1626), excerpt "A paver-pattern parking lane in TrafficPatternsXD that takes turning tires, delivery trucks and plow blades without shifting like real pavers." (:1628).
- lib/idea-book-edition.ts:451, the printed page 131: eyebrow "Parking"; headline "Long lasting parking lanes."; body "A paver-pattern parking lane in TrafficPatternsXD, heat-fused onto the asphalt so it takes turning tires, delivery trucks and plow blades without the shifting and shoving of real pavers. The pattern also defines the lane visually, narrowing the roadway and calming roadway traffic."; caption "Verdun, Québec | TrafficPatternsXD".
- The photograph (the cover, downloaded and read): taken low, from the lane; grey bricks in offset rows with a visible speckle, along a curb; a paler border on the traffic side; parked cars further down; a delivery truck in the travel lane; trees, a boulevard with an orange post and a cone.

## What I left out, and why

- The street: not identified (`approximate: true`), so the piece names Verdun, Québec only.
- Install year, installer, client, length: no record gives one.
- The book's "heat-fused onto the asphalt": docs/GLOSSARY.md:28 and the brief ("never heat-fused"); the piece says how TrafficPatternsXD goes in, in the glossary's words (docs/GLOSSARY.md:30).
- The headline's words "Long lasting": on the lint's list as a claim with no figure (lib/style-lint.ts:215), so the piece paraphrases the headline and gives the figure, 10+ years.
- The delivery company on the truck: not named.
- Whether this lane and the flush medians on p.116 (also Verdun, also TrafficPatternsXD in grey with a pale border) are one project: no record says so, and the two pieces keep them apart.
- Page 130, which faces page 131 (Granville Island): another job.

## Excerpt

- "In Verdun, Québec, a parking lane in TrafficPatternsXD has the look of pavers.": p.131's caption (lib/idea-book-edition.ts:451) and its body ("A paver-pattern parking lane in TrafficPatternsXD"); lib/map-projects.ts:1615.

## First paragraph

- "What this parking lane in Verdun, Québec, takes is listed in HUB Surface Systems' Product Portfolio Book · Volume 5: 'turning tires, delivery trucks and plow blades.'": lib/idea-book-edition.ts:451 (the body; the caption's place). The book's full name at first mention: lib/catalogue.ts:77.
- "The lane is TrafficPatternsXD": p.131 caption; lib/map-projects.ts:1620.
- "laid along the curb to look like grey pavers": the photograph; "paver-pattern": lib/idea-book-edition.ts:451, lib/map-projects.ts:1615.
- "the book says it takes all of that 'without the shifting and shoving of real pavers.'": lib/idea-book-edition.ts:451.

## Along the curb in the photograph

- "The photograph on page 131": lib/map-projects.ts:1626; lib/idea-book-edition.ts:451.
- "taken from the lane itself, low enough to show the speckle of aggregate in every grey brick": the photograph; the aggregate is the system's ("Aggregate-reinforced", p.13, lib/idea-book-print.ts:80).
- "The bricks run in offset rows down the curb as far as the parked cars, with a paler border on the traffic side, and a delivery truck is in the travel lane beside them.": the photograph.

## One sheet with no units to shift

- The heading: what the stamping below makes (one sheet, no separate units), against the book's "without the shifting and shoving of real pavers" (lib/idea-book-edition.ts:451). Written without a comma: no comma in a heading. It replaced "Stamped into the asphalt" on 28 Oct 2026, a near-twin of the Mission draft's heading.

- "Each sheet of TrafficPatternsXD is 150 mil thick, with its 8–9 Mohs aggregate running through the full cross-section": p.13 (lib/idea-book-print.ts:83–84); lib/products.ts:99–100 ("8–9 Mohs, through the full cross-section").
- "asphalt is the only surface it goes on": lib/products.ts:103; docs/GLOSSARY.md:30 ("Asphalt only").
- "The sheet is heated on the prepared asphalt and stamped, which presses the brick pattern through the material and into the top of the asphalt": docs/GLOSSARY.md:30 ("The sheets are heated on prepared asphalt and a wire-rope grid presses a pattern through the material into the top of the asphalt"); lib/products.ts:96, :102.
- "so the bricks are one sheet, not separate units": what that method makes (the pattern is pressed into one sheet and the asphalt under it); the book's "without the shifting and shoving of real pavers" (lib/idea-book-edition.ts:451).
- "The page's headline is about how long a parking lane like this lasts": p.131, "Long lasting parking lanes." (lib/idea-book-edition.ts:451), paraphrased.
- "a service life of 10+ years, with a skid resistance of 60 BPN (ASTM E303)": p.13 (lib/idea-book-print.ts:85–86).
- "What pavers do on a plow route, and what a surface without units does instead, is the subject of the guide to snowplow-safe decorative pavement.": /blog/snowplow-safe-decorative-pavement (published): "Pavers are a unit system with joints and a raised edge profile. In a climate that plows and salts, that geometry means units that shift and heave, joints that weed, and edges a blade can catch." and "A stamped or bonded surface has none of those features, because it has no units." Its TrafficPatternsXD figures are the book's (150 mil, 8–9 Mohs, 60 BPN, 10+ years).

## A lane that narrows the road

- "The pattern also defines the lane visually, narrowing the roadway and calming roadway traffic.": lib/idea-book-edition.ts:451, word for word.
- "The traffic calming spread, page 54, opens with 'Drivers slow down with visual cues,'": p.54 headline (lib/idea-book-print.ts:244). The link on "traffic calming" opens /applications/traffic-calming. The map files the job under Traffic Calming (lib/map-projects.ts:1621); the post no longer says so (cut on 28 Oct 2026: the same filing sentence ran in most of the forty map posts).
- "then names TrafficPatternsXD for 'durable road surface treatments.'": p.54 SPECIFY (lib/idea-book-print.ts:250; printed in lower case on the page).
- No Lunch & Learn close: the piece ends on the book's spread.

## Links (each checked)

/products/traffic-patterns-xd (first mention), /product-book/131, /product-book/13, /blog/snowplow-safe-decorative-pavement (in the published index, the same subject: decorative pavement against pavers on a plow route; not on the do-not-link list), /applications/traffic-calming, /product-book/54. The published guide traffic-calming-surface-design was not linked: it gives TrafficPatternsXD "BPN 65+" (the book says 60) and outside speed figures. No outside link.

## Photo

image-02ae81c199eb25441a4f4786353255f2c47cb1d5-1184x864-jpg, the map entry's photo (lib/map-projects.ts:1624), already in Studio (the dry run found it at 1184x864; it is the only copy the map has, under the 1600 the map's local files run to). Alt: what the photo shows, with the system and the town from p.131's caption. Hotspot x 0.5 y 0.6 w 1 h 0.8, on the lane.

## Checked against the other map posts

Compared sentence by sentence with every draft in content/drafts on 28 Oct 2026: no shared sentence. The opening (which began with the book's name, as the Cambie and Sheffield Park drafts do) and the traffic calming sentence (close to the DuraTherm Toronto draft) were rewritten after the first check.

## Length

About 303 words in the dry run's count (headings included). The record is the book's two sentences, a caption and a photograph, so the piece stops there.
