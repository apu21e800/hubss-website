# Sources: An orange and sand walkway to a school in Saint-Lin-Laurentides

/blog/saint-lin-laurentides-school-walkway · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/saint-lin-laurentides-school-walkway.md` · 28 Oct 2026

Map job 32, `saint-lin-school-walkway`. The slug is the one the map is pointed at. Each statement, then the line it rests on. Line numbers are lib/ and docs/ on branch feat/map-posts as read on 28 Oct 2026. The book's pages were read on the renders in public/catalogue/2026-27/ (p120, p025).

## What the record holds

- lib/map-projects.ts:1592–1594 (comment): "Product Book p.120: 'Saint-Lin-Laurentides, Québec | StreetBond'. The building matches the new primary school on Rue Saint-Isidore (401); the address is not mapped, so the pin is approximate."
- lib/map-projects.ts:1595–1609: title "Primary school walkway" (:1596), city "Saint-Lin–Laurentides", QC (:1597–1598), product StreetBond (:1601), application Parks & Paths (:1602), `approximate: true` (:1603), photo local("saint-lin-school-walkway"), the p.120 photograph (:1605), ideaBookPage 120 (:1607), excerpt "An orange and sand StreetBond walkway leading to a new primary school in Saint-Lin–Laurentides." (:1609).
- lib/idea-book-edition.ts:418–419: page 120 is a full-bleed photograph with the caption { place: "Saint-Lin-Laurentides, Québec", system: "StreetBond" } and no eyebrow, headline or body. The printed page says the same.
- The photograph (the cover, public/images/map/saint-lin-school-walkway.jpg, 1472x704, read): long bands of orange and sand, four across, running straight to the glass entrance of a large building clad in white and pale yellow panels; young trees in planting beds edged with wooden posts; a play structure behind the posts on the left; dark asphalt alongside. The book's crop on p.120 is the same scene, narrower.

## What I left out, and why

- The street and the civic number (Rue Saint-Isidore, 401) and the school's name: the pin is approximate and the school was matched from the photograph, so the piece names the town only and calls it "a new primary school", as the map's title and excerpt do (lib/map-projects.ts:1596, :1609). The book's caption names only the town and the system: flagged in the report.
- The town's spelling: the map writes "Saint-Lin–Laurentides" with an en dash (the official form); the piece follows the book's printed caption, "Saint-Lin-Laurentides", which also keeps the en dash to ranges (docs/STYLE.md:25, :92–93).
- Install year, installer, client, size, colour names: no record gives one.
- What the walkway is laid on: the coating covers it and no record says, so the piece says only that StreetBond goes on asphalt or concrete.
- "Sixty-three standard colours" (p.25): a count, left out (docs/STYLE.md:85–86).
- StreetBond's subhead "Engineered for life in Canada" (p.25): on the lint's filler list (lib/style-lint.ts:218), not quoted.
- The whole of p.25's first sentence: several other map posts quote it whole (Awen, Burnaby, Montréal basketball, the landscape architects guide), so this piece quotes its opening words and the one failure that matters on a walk.
- The facing page 121 (the Catholic Diocese of Vancouver, DuraTherm): another job.

## First paragraph

- "Long bands of orange and sand run the length of a walkway to the glass doors": the photograph; "orange and sand": lib/map-projects.ts:1609.
- "of a new primary school in Saint-Lin-Laurentides, Québec": lib/map-projects.ts:1596 ("Primary school walkway"), :1609 ("leading to a new primary school"); the town and province from the book's caption (lib/idea-book-edition.ts:419).
- "The colour comes from StreetBond": book p.120 caption; lib/map-projects.ts:1601.
- "one of HUB Surface Systems' pavement coatings": the Coatings family, lib/product-categories.ts:54–55 and docs/STYLE.md:64–66; "pavement coating", docs/GLOSSARY.md:37.
- "laid in stripes that follow the line of the walk": the photograph.

## Stripes that lead to the school doors

- "the stripes start in the foreground and stop at the entrance: four bands across the walk, orange and sand in turn, with dark asphalt alongside": the photograph (and the p.120 crop).
- "Young trees stand in planting beds edged with rows of wooden posts, and a play structure sits behind the posts on the left. The building is clad in white and pale yellow panels.": the photograph.
- "The scene fills the whole of page 120 in the Product Portfolio Book · Volume 5": lib/idea-book-edition.ts:419 (fullBleed); lib/map-projects.ts:1607. The book's full name at first mention: lib/catalogue.ts:77.

## What StreetBond does on a walk

- "StreetBond's spec line in the book reads 'Water-based, epoxy-modified acrylic', and it goes on asphalt or concrete": book p.25, Type and Surfaces (lib/idea-book-print.ts:109–110).
- "Its page, page 25, opens its text with 'Designed to move with the pavement,' and among the failures of rigid coatings that this avoids it lists 'being slippery in wet conditions.'": book p.25 (lib/idea-book-print.ts:107, "Designed to move with the pavement, avoiding the three failures of rigid coatings: cracking, premature wear, and being slippery in wet conditions.").
- "The book's figure for its service life is 8+ years, and the note beside that figure is 'easily refreshed.'": book p.25, "Life cycle: 8+ years / easily refreshed" (lib/idea-book-print.ts:112); "service life" is the site's one term (docs/GLOSSARY.md:42; lib/product-catalogue.ts:79, the WEB_EDITS line that turns the printed "Life cycle" into "Service life").

## Colour on a path with one destination

- "HUB's parks and paths page says StreetBond puts UV-stable colour on paths and plazas so that a route can double as wayfinding": lib/applications.ts:105, the parks and paths page ("StreetBond pavement coating puts UV-stable colour on existing asphalt paths and plazas, so a route can double as wayfinding or become a destination in itself"), live in Sanity (application-parks-paths, read 28 Oct 2026). The map files the job under Parks & Paths (lib/map-projects.ts:1602); the post no longer says so (the same filing sentence ran in most of the forty map posts).
- "This route has one end, and the stripes run straight at it.": the photograph.
- Cut on 28 Oct 2026: "The book's StreetBond page names parks and playgrounds among the coating's uses." (p.25's uses strip, lib/idea-book-print.ts:114; nine map posts cited a uses strip).

## The close

- The piece ends on the walk itself. The Lunch & Learn close was taken out on 28 Oct 2026: thirteen of the forty map posts ended on one.

## Links (each checked)

/products/streetbond (first mention), /product-book/120, /product-book/25, /applications/parks-paths. No post linked: the published walkway guide (pedestrian-walkways-surface-systems) calls StreetBond "polymer-modified" and claims "10+ year track records", which the book does not, so it is not linked. No outside link.

## Photo

public/images/map/saint-lin-school-walkway.jpg, the map entry's own photo (lib/map-projects.ts:1605), uploaded on the real run (1472x704; the map's files are about 1600 wide and this one is under it). Alt: what the photo shows, with the system and the town from p.120's caption and "primary school" from the map's title. No hotspot: the walk runs up the centre of the frame.

## Checked against the other map posts

Compared sentence by sentence with every draft in content/drafts on 28 Oct 2026: no shared sentence. The StreetBond definition, the service-life line and the Lunch & Learn lines were reworded after the first check, where they ran close to the Green Square, Circle of Life, Sheffield Park, Cambie and Cascades drafts.

## Length

About 248 words in the dry run's count (headings included). The record is a caption, a photograph and the map's title, so the piece stops at the coating's facts and the application.
