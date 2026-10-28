# Sources: StreetBond on the splash pad at Saint-Antoine-sur-Richelieu

/blog/saint-antoine-sur-richelieu-splash-pad · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/saint-antoine-sur-richelieu-splash-pad.md` · 27 Oct 2026

Map job 37 of the 40 pins with no write-up. The slug is the one the map is pointed at. Every statement below is from the map entry, the printed Product Portfolio Book (page renders p026, p060 and p061 in public/catalogue/2026-27, read as images), the site's application file, or the photographs. Line numbers are on branch feat/map-posts. About 300 words: the record is a caption and a spread.

Written beside three other splash pad posts (Bear Creek Park, Awen' in Collingwood, Maple Ridge Park), which quote the spread's "uniquely demanding" line and use "grip in the wet comes first" and a "cooler option on the same spread" section. This piece quotes neither, gives StreetBondSR one sentence, and leans on what only this pad has: its design, the town's community centre, and being the book's own picture for the Splash pads application.

## What the record holds

- lib/map-projects.ts:1713–1730. Comment: "Product Book p.61: "Saint-Antoine-sur-Richelieu, Québec", on the Splash Pads spread (StreetBond, StreetBondSR). The municipality's only jeux d'eau are at the Centre communautaire, [street address]." Entry: title "Community centre splash pad" (:1717), city Saint-Antoine-sur-Richelieu, QC (:1718–1719), product StreetBond (:1722), application Splash Pads (:1723), not approximate, images `local("saint-antoine-splash-pad")` (:1725), ideaBookPage 61 (:1727), excerpt "StreetBond colour on the splash pad at the community centre in Saint-Antoine-sur-Richelieu." (:1729). No year, client, installer, designer, size or cost.
- lib/idea-book-edition.ts:249: the Splash pads application leaf, pages 60–61, number 8, `mapId: "saint-antoine-splash-pad"`, photo page 61 (applicationLeaf, :512–526), alt "A blue StreetBond splash pad in Saint-Antoine-sur-Richelieu, Québec". The leaf names this job and its photograph is this pad.
- lib/idea-book-print.ts:278–288, the printed Splash pads spread (page 60, "APPLICATION 08" on the render): title (:279), statement (:280), body (:281), SPECIFY StreetBond "Skid resistant, UV stable" and StreetBondSR "LEED compliant SR ≥ 0.33, coatings keep surfaces cooler" (:282–285), caption "Saint-Antoine-sur-Richelieu, Québec" (:286). Checked against the renders: the same words; the caption on p.61 prints the town only.

## First paragraph

- The photograph (public/images/map/saint-antoine-splash-pad.jpg, the map's photo, and the book's p.61 photo, a tighter frame of the same pad; both read as images): sand-coloured islands in a sky-blue field, each edged in a deeper blue; spray features including a palm tree with green and yellow fronds and a blue and green parasol. No theme or designer intent is claimed.
- "the colour comes from StreetBond pavement coating": map product (:1722) and excerpt (:1729); edition alt (:249). The caption names no system; the spread specifies StreetBond.
- "The pad is at the town's community centre": map title (:1717), excerpt (:1729) and comment (:1714–1715: the town's only splash pad is at the community centre). The book's caption names the town only; the pin is not approximate, so the site is named, as the map card already names it. No street address.
- "its photograph is in HUB Surface Systems' Product Portfolio Book · Volume 5, beside the book's page on splash pads": edition :249.

## A design drawn in coating

- "Every shape on the pad is a colour change in the one surface", "the islands' outlines curve and swell, the colour runs right up to the foot of each spray feature, and the pad's outer edge meets the lawn in one smooth curve", "dry in the picture, with a black pergola at its far side and a playground in view to the right": the photographs.
- "StreetBond comes in a standard range of colours, and the book's colour pages note that custom Pantone matching is available": page 26 as printed ("The complete StreetBond colour range. Custom Pantone matching available."); idea-book-print.ts:107 ("full custom colour matching"). No colour names are given for this pad: no record names them.

## What the pad asks of the coating

- The heading: the spread asks for "a slip-resistant texture" (lib/idea-book-print.ts:281), the first line below. It replaced "The surface under the spray" on 28 Oct 2026, one of six "The X under the Y" headings in the forty.

- "The book's spread asks for "a slip-resistant texture"": idea-book-print.ts:281 (page 60 body, "A slip-resistant texture built for ...").
- "that is how StreetBond goes onto a pad, in a textured build": lib/applications.ts:158 ("applied to the prepared concrete in a textured, slip-resistant build"). Said of the system on splash pads, not as a record of this pad's day; the concrete is left out because no record names this pad's base.
- "The spread specifies it as UV-stable": idea-book-print.ts:283.
- "its printed service life is 8+ years": idea-book-print.ts:112 (printed "Life cycle"; service life per docs/GLOSSARY.md and lib/product-catalogue.ts:79).
- "Wear is dealt with by recoating, between seasons": lib/applications.ts:158 ("a worn pad is recoated between seasons").
- "the spread's second system is StreetBondSR, whose colours reflect more of the sun", "For a pad that should run cooler under bare feet": idea-book-print.ts:284 ("coatings keep surfaces cooler"), :120 ("formulated to reflect rather than absorb"); lib/applications.ts:158 ("so the surface stays cooler on bare feet"). "LEED compliant" on the SPECIFY line is left out: the book's own StreetBondSR page says "can contribute". The piece does not say this pad is StreetBondSR.
- "The spread is the eighth of the book's applications, on pages 60 and 61, and this pad is the picture it uses": edition :249 (number 8; photo p.61); "APPLICATION 08" on the p060 render.
- "The site's splash pads page describes the coating's build for a pad in more detail": lib/applications.ts:152–161.

## Links (each checked, 200 on hubss.com, 27 Oct 2026)

/products/streetbond, /products/streetbondsr; /product-book/60; /applications/splash-pads. Each once. The piece ends on the book page and the application page, not the Lunch & Learn. Not linked: /blog/durable-coatings-waterparks, the one published post on the subject, because it carries figures no record supports ("Over the last 5 years", "over 25 years of history"). No outside links.

## Photo

public/images/map/saint-antoine-splash-pad.jpg (1472 x 704), the map entry's own photo (:1725), uploaded on the real run; it has no Sanity copy (lib/map-projects.ts:74–76). Alt: what the photograph shows, with StreetBond and the town. Hotspot x 0.5 y 0.55, on the islands and the arch, so a phone's portrait cut keeps the pad.

## Left out

- The community centre's street address (in the map comment): no street addresses in a post.
- The spread's headline ("Slip-resistant. Cool underfoot. Vivid colours.": three fragments) and its body's close ("Laughter for years to come!", an exclamation).
- Install year, owner, installer, designer, area and cost: no record states them.
- The base under the coating (concrete or asphalt) and the colours' names: no record names them for this pad.
