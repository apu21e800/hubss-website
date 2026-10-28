# Sources: The observatory terrace at Mont-Mégantic in white StreetBondSR

/blog/mont-megantic-observatory-terrace · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/mont-megantic-observatory-terrace.md` · 27 Oct 2026

Map job 38 of the 40 pins with no write-up. The slug is the one the map is pointed at. Every statement below is from the map entry, the printed Product Portfolio Book (page renders p029, p100 and p102 in public/catalogue/2026-27, read as images; page 101 from its edition record), the glossary, or the photographs. Line numbers are on branch feat/map-posts. About 290 words: the record is one page.

Written beside the Toronto fleet lot post (solar-reflective-fleet-lot-toronto), which covers StreetBondSR's heat-island case, the ASTM tests and the colour-sample advice, and the earlier guide decorative-pavement-product-portfolio-book, which quotes page 102. This piece quotes page 102 in full (it is this job's own page) and takes a different line on the system: everywhere else in the book StreetBondSR is about heat, and here it is about light at night.

## What the record holds

- lib/map-projects.ts:1732–1749. Comment: "Product Book p.102: "Observatory. Lit by starlight... A white StreetBondSR surface reflects what little light there is. Mont-Mégantic, Québec | StreetBondSR". Pin at the public observatory terrace on the summit." Entry: title "Mont-Mégantic summit terrace" (:1736), city Mont-Mégantic, QC (:1737–1738), product StreetBondSR (:1741), application Public Spaces (:1742), not approximate, images `local("mont-megantic-observatory")` (:1744), ideaBookPage 102 (:1746), excerpt (:1748). No year, client, installer, designer, area or cost.
- lib/idea-book-edition.ts:355: page 102, `mapId: "mont-megantic-observatory"`, eyebrow "Observatory", title "Lit by starlight.", body (quoted below), caption "Mont-Mégantic, Québec | StreetBondSR", photo alt "The white StreetBondSR plaza between the domes of the Mont-Mégantic observatory". Checked against the p102 render: the same words. The record names this job and its photograph is this terrace.

## First paragraph

- ""Lit by starlight" is the headline HUB Surface Systems' Product Portfolio Book · Volume 5 gives the summit terrace at Mont-Mégantic, Québec": edition :355; map title (:1736); caption place.
- "The terrace lies between the observatory's domes": edition alt (:355); map comment (:1733–1734).
- "its surface is white StreetBondSR": edition body and caption (:355); map product (:1741).

## Where outdoor lighting is kept to a minimum

- The two quoted sentences: edition :355, word for word. "The world's first International Dark Sky Reserve" is the book's own claim, quoted.

## The terrace by day

- "page 102": edition :355.
- "taken under a blue sky", "the metal-clad base of an observatory dome, with a geodesic dome beyond it and evergreens along the edge of the summit": the photograph on page 102.
- "A second photograph, from further back, takes in more of the terrace: a building with a curved roof and a roll-up door, and a railing with a wooden top rail along its edge": public/images/map/mont-megantic-observatory.jpg (the cover), a different photograph from the one on p.102, taken from further back (both looked at again on 28 Oct 2026). Worded so it no longer points at the photograph "above": three map posts did.

## The same coating against the sun

- "Everywhere else in the book, StreetBondSR is about heat": every other StreetBondSR mention in the book files was read (lib/idea-book-edition.ts:130, :211, :213, :343–350; lib/idea-book-print.ts:117–129, :217, :273, :281, :284): each is about the sun, cooling or the heat-island credit. Page 102 is the one that speaks of light at night.
- "Its own page, which pictures a fleet lot in Toronto, is headed "Solar reflective coating"": edition :213 (photo p.28, "A fleet lot in a solar-reflective StreetBondSR coating, Toronto, Ontario"); idea-book-print.ts:118. The fleet lot is named as the brief asks, with no owner.
- "the park path in Osoyoos, British Columbia, on pages 100 and 101 is printed as running "cooler underfoot" three years on": edition :342–351 (subhead "Three years on, this Osoyoos park path still reads as new, and runs cooler underfoot."). The book's words about another job, attributed; the Osoyoos post is not linked (below).
- "StreetBond in colours made to reflect the sun's energy instead of absorbing it": idea-book-print.ts:120 ("StreetBond colours that are formulated to reflect rather than absorb"), paraphrased.
- "with initial solar reflectance at 0.33 or higher, a level the book says can contribute to LEED v5 heat island credits on surfaces other than roofs": idea-book-print.ts:120, :122–123. "LEED v5" per docs/STYLE.md.
- "The book prints its service life as 8+ years and its surface as asphalt": idea-book-print.ts:124–125 (printed "Life cycle"; service life per docs/GLOSSARY.md and lib/product-catalogue.ts:83). Not a claim about what lies under this terrace: no record names it.
- "Plazas are among the uses on its page, and on Mont-Mégantic the plaza is the terrace between the domes": idea-book-print.ts:127 (uses: Parking, Plazas, LEED projects, Schools); edition alt :355 ("plaza between the domes").

## Links (each checked, 200 on hubss.com, 27 Oct 2026)

/products/streetbondsr; /product-book/102. Each once. No application page in the body: /applications/public-spaces (the map's application, in relatedApplications) does not list StreetBondSR. Not linked: /blog/streetbond-leed-urban-heat-island and /blog/streetbondsr-solar-reflective-coatings (Osoyoos), the published StreetBondSR posts, because their figures disagree with the book (LEED v4, "SRI ≥ 29", "up to 17°C", StreetBondSR on concrete where the book says asphalt). No outside links. The piece ends on the system's facts, not the Lunch & Learn.

## Photo

public/images/map/mont-megantic-observatory.jpg (1600 x 739), the map entry's own photo (:1744), uploaded on the real run; it has no Sanity copy (lib/map-projects.ts:74–76). It is a wider frame than the book's photo, of the same terrace. Alt: what it shows, with StreetBondSR and the place from the record. Hotspot x 0.6 y 0.45, between the two domes, so a phone's portrait cut keeps them and the white below.

## Left out

- Which white: page 27 prints one white, "SR White" at SR 0.77, but no record says the terrace is that colour, and lib/products.ts:281 lists a "Cool White" for StreetBondSR instead. Neither name nor the 0.77 figure is used.
- The observatory's name, owner or operator, and the reserve's designation date: no record states them.
- Install year, installer, area and cost: no record states them.
- What the terrace is laid on (asphalt or concrete): no record states it.
- The count of SR colours ("Twelve"), and the ASTM test names and sample advice from pages 26–27 (used in the fleet lot post).
