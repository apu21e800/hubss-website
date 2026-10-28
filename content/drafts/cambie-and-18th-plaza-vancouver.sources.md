# Sources: Pastel StreetBond on the Cambie and 18th plaza in Vancouver

/blog/cambie-and-18th-plaza-vancouver · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/cambie-and-18th-plaza-vancouver.md` · 28 Oct 2026

Map job 6 of the 40 with no write-up (Vern, 27 Oct 2026: "if it's on the map it should have it's own landing page"). The slug is the one the map is pointed at. Line numbers are on branch feat/map-posts as it stood on 28 Oct 2026. A thin record: the post stops at about 231 words (the dry run's count) because the facts stop there.

## What the record holds

- lib/map-projects.ts:378–396, `vancouver-cambie-18th`. Comment (:379–381): "Product Book p.104: "Neighbourhood colour. Vancouver, British Columbia | StreetBond" (file: 18th and Cambie). The City's Cambie-18th plaza, W 18th Ave just west of Cambie." Title "Cambie and 18th plaza" (:383), Vancouver, BC (:384–385), product StreetBond (:388), application Public Spaces (:389), no year, not `approximate`, one photo, cdn("676b984d77cbadce24a6768cf9a44a57e8c259c7-2400x1800.jpg") (:391), ideaBookPage 104 (:393), excerpt "Pastel StreetBond rings and bands on the City of Vancouver's plaza at Cambie Street and West 18th Avenue." (:395).
- lib/idea-book-edition.ts:366, leaf `vancouver-neighbourhoods` (pages 104–105): `project({ page: 104, eyebrow: "Neighbourhood colour", title: "Where the neighbourhood starts.", caption: { place: "Vancouver, British Columbia", system: "StreetBond" }, mapId: "vancouver-cambie-18th" })`. No body. The record names this job's mapId and its photo is this job (below), so the page is tied to the job.
- The printed page, public/catalogue/2026-27/p104-1400.webp, read as an image: the photograph across the top, then "NEIGHBOURHOOD COLOUR", "Where the neighbourhood starts." and the caption "Vancouver, British Columbia | StreetBond". Nothing else.
- lib/idea-book-print.ts:104–116 (StreetBond as printed, book p.25) and :302–312 (the public spaces spread, book p.64), both renders read; lib/products.ts:134–183; lib/applications.ts:162–175.
- The photo: the cdn file above, downloaded and read (2400x1800). The same frame the book prints on p.104, wider (the book crops it).

## Left out, and why

- Install year, client, installer, designer, size, cost: no record gives one. "It belongs to the City of Vancouver" is the map's own wording ("the City of Vancouver's plaza", "The City's Cambie-18th plaza"); the post does not say the City ordered the work or who did it.
- The facing page, p.105 (Little Italy on Commercial Drive): another job, not tied to this one.
- StreetBond's colour count ("Sixty-three standard colours"): left out as a count (docs/STYLE.md, Numbers). The public spaces spread's pull line ("Dynamic surface treatments ...") and body ("aesthetics"), and the StreetBond SPECIFY note ("vibrant"): not quoted; two other drafts quote the pull line, and the other two carry words docs/STYLE.md cuts.
- StreetPrint, the spread's other system: not on this job, so not named (it would need its own link).
- The thin white lines on the asphalt, the heart-shaped sculpture and the parking meter in the photograph: what they are is not plain, so they are not described.
- No published post linked: none is the same subject (the More Awesome Now laneway post is another job, with outside figures).

## First paragraph

- "The plaza on West 18th Avenue, west of Cambie Street, in Vancouver, British Columbia": lib/map-projects.ts:380–381 ("W 18th Ave just west of Cambie"), :384–385, :395. The pin is not approximate, so the site is named.
- "belongs to the City": :380 ("The City's Cambie-18th plaza"), :395 ("the City of Vancouver's plaza").
- "and is coloured in StreetBond, a pavement coating in the HUB Surface Systems range": :388; the p.104 caption; "pavement coating" is docs/GLOSSARY.md:37; StreetBond is one of HUB's systems (lib/products.ts:135).
- "The Product Portfolio Book · Volume 5 prints it under “Where the neighbourhood starts.”": lib/idea-book-edition.ts:366 (title); the p.104 render (the headline is set under the photograph). First mention of the book, in full.

## Colour across the street and both sidewalks

- All of it is what the photograph plainly shows (the cover file): a mint ring around a pale cream disc at the centre; lilac, pink, peach and mint bands crossing the street at angles and carrying on over the sidewalks on both sides; orange barriers across the far end; people at tables and on a bench on the left-hand sidewalk. "Pastel" (the title, the excerpt, the alt) is the map's word (:395).
- "concrete sidewalks": light grey concrete panels with joints in the photograph, beside the dark asphalt road.

## One coating on the asphalt and the concrete

- "The book lists StreetBond's surfaces as asphalt and concrete": lib/idea-book-print.ts:110 ("Surfaces", "Asphalt and concrete").
- "which is what lets a design like this one carry on from the roadway across the sidewalks": the two surfaces above, and the p.104 caption, which names StreetBond for the photograph whose bands run onto the sidewalks.
- "Chemically it is a water-based, epoxy-modified acrylic": lib/idea-book-print.ts:109; lib/products.ts:161, :163.
- "the book offers custom colour matching beyond its standard colours": lib/idea-book-print.ts:107 ("Sixty-three standard colours plus full custom colour matching."), :111.
- "The service life it prints is 8+ years, and the coating can be refreshed with a new coat when it wears": lib/idea-book-print.ts:112 (printed label "Life cycle", value "8+ years / easily refreshed"; written as service life per docs/GLOSSARY.md:42, as lib/products.ts:167 does).

## Neighbourhood colour on page 104

- "The plaza's own page labels it “Neighbourhood colour”, above the headline, and captions it with the city and the coating": lib/idea-book-edition.ts:366 (eyebrow, caption); the p.104 render. "The plaza's own page" links /product-book/104, which opens the printed page.
- "StreetBond is one of the systems the book specifies for public spaces, on a spread headed “Nobody wants boring.”": lib/idea-book-print.ts:303 (title), :306–309 (SPECIFY: StreetPrint, StreetBond); lib/applications.ts:174. The job's application is Public Spaces (lib/map-projects.ts:389). The piece ends here, with no closing book link and no Lunch & Learn.

## Links (each checked)

/products/streetbond (first mention), /applications/public-spaces, /product-book/104. Each once. No outside links.

## Photo

image-676b984d77cbadce24a6768cf9a44a57e8c259c7-2400x1800-jpg, already in Studio (the map's photo; the map comment files it under applications/parks-paths). The dry run found it at 2400x1800. Alt: "Pastel StreetBond bands and a mint ring on the plaza at Cambie Street and West 18th Avenue, Vancouver" (StreetBond from the book's caption, the place from the map). Hotspot x 0.46 y 0.55 w 0.8 h 0.55, on the ring and the bands, which fill the lower two thirds of the frame.
