# Sources: A StreetBond basketball court in Burnaby with a flower at its centre

/blog/burnaby-basketball-court-streetbond · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/burnaby-basketball-court-streetbond.md` · 28 Oct 2026

Map job 8 of the 40 with no write-up. The slug is the one the map is pointed at. Line numbers are on branch feat/map-posts as it stood on 28 Oct 2026. The thinnest of my five records: the book's page carries no words but the caption, and the site is not identified, so the post stops at about 215 words (the dry run's count), under the 300 the brief suggests, because the facts stop there.

## What the record holds

- lib/map-projects.ts:507–525, `burnaby-basketball-court`. Comment (:508–509): "Product Book p.118: "Burnaby, British Columbia | StreetBond". The park is not identified: pin at city hall, approximate." Title "Basketball court" (:511), Burnaby, BC (:512–513), product StreetBond (:516), application Sport Courts (:517), `approximate: true` (:518), one photo, local("burnaby-basketball-court") (:520), ideaBookPage 118 (:522), excerpt "A basketball court in StreetBond with a flower at centre court, in Burnaby." (:524).
- lib/idea-book-edition.ts:406–410, leaf `burnaby-court`: `project({ page: 118, caption: { place: "Burnaby, British Columbia", system: "StreetBond" }, mapId: "burnaby-basketball-court", fullBleed: true })`. No eyebrow, headline or body. The record names this job's mapId and its photo is this job, so the page is tied to it.
- The printed page, public/catalogue/2026-27/p118-1400.webp, read as an image: the photograph full bleed, with the caption "Burnaby, British Columbia | StreetBond" and nothing else.
- lib/idea-book-print.ts:104–116 (StreetBond, book p.25) and :211–221 (the sport courts spread, book p.48), both renders read; lib/products.ts:134–183; lib/applications.ts:139–149.
- The photo: public/images/map/burnaby-basketball-court.jpg (864x1184), read. The same scene the book prints on p.118 (the book's cut is square, the map's is portrait).

## Left out, and why

- `approximate: true`: the post names only the town. No park, street, neighbourhood or site, and not "a park" either (the comment's "The park is not identified" is the only hint that it is one). The towers on the skyline are not identified.
- Install year, client, installer, designer, size, cost: no record gives one. Whether the court is on asphalt or concrete: no record says; the post quotes the book's "court colour on asphalt or concrete".
- What the white lines inside the petals are for: not plain from the photograph, so not described. The number of petals and backboards: not counted.
- StreetBondSR, the spread's second system (lib/idea-book-print.ts:217): the caption names StreetBond, and the post keeps to it.
- The sport courts spread's body ("transform", "vibrant", "Non-slip"): not quoted (docs/STYLE.md, docs/GLOSSARY.md). Only its "UV-stable" is used.
- No published post linked: none is about a sport court (the StreetBond150 playground case study is school playgrounds, with outside figures).

## First paragraph

- "Burnaby, British Columbia, has a basketball court with a flower at centre court": lib/map-projects.ts:511–513, :524.
- "orange petals outlined in white on a green ground": the photograph.
- "coated in StreetBond": :516; the p.118 caption.
- "HUB Surface Systems prints it across a full page of the Product Portfolio Book · Volume 5, page 118, with no headline and no text: only the photograph, and a caption naming the city and the coating": lib/idea-book-edition.ts:408 (fullBleed, no eyebrow, title or body); the p.118 render.

## Petals around a white tree

- All of it is what the photograph plainly shows: the petals spreading from a blue star at the middle of the court; a white post that branches like a tree, with the backboards mounted on its branches; young trees, lamp posts, a row of parked cars and high-rise towers beyond.

## A hard place for colour

- "On its sport courts spread, the book says: “A court is one of the hardest colour environments in outdoor pavement.”": lib/idea-book-print.ts:213; book p.48. The job's application is Sport Courts (lib/map-projects.ts:517).
- "It specifies StreetBond for “court colour on asphalt or concrete”": lib/idea-book-print.ts:216 (lowercase on the printed page, as quoted).
- "and calls it UV-stable": :214 ("Non-slip, UV-stable and tough enough ...").
- "The coating moves as the asphalt or concrete beneath it moves, and the book credits that with avoiding what goes wrong with rigid coatings: cracking, premature wear and slipperiness when wet": :107 ("Designed to move with the pavement, avoiding the three failures of rigid coatings: cracking, premature wear, and being slippery in wet conditions."), paraphrased; book p.25.
- "Worn lines on a court are recoated": lib/applications.ts:147 ("When the lines wear, the court is recoated."), reworded.
- "the book calls StreetBond easily refreshed and puts its service life at 8+ years": lib/idea-book-print.ts:112 (printed label "Life cycle", value "8+ years / easily refreshed"; written as service life per docs/GLOSSARY.md:42); lib/products.ts:167. The close is the system's facts.

## Links (each checked)

/products/streetbond (first mention), /product-book/118, /applications/sport-courts. Each once. No outside links.

## Photo

public/images/map/burnaby-basketball-court.jpg, the map's own photo of the job, uploaded on the real run. It is a local file because no gallery copy exists in Studio (lib/map-projects.ts:74–76). At 864x1184 it is small for a cover: no larger copy is in the repo (the page render carries the printed caption, so it is not a photo to use). Alt: "Orange petals and a blue star on a green StreetBond basketball court in Burnaby, British Columbia" (StreetBond from the caption, the town only, as the pin is approximate). Hotspot x 0.5 y 0.56 w 0.95 h 0.4: a portrait photo with the court and the post in a band below centre, so a landscape cut keeps the top of the post and most of the petals.
