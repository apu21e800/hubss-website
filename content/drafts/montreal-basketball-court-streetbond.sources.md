# Sources: A Montréal basketball court laid out in StreetBond colour

/blog/montreal-basketball-court-streetbond · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/montreal-basketball-court-streetbond.md` · 27 Oct 2026

Map job 36 of the 40 pins with no write-up (Vern, 27 Oct 2026: "if it's on the map it should have it's own landing page"). The slug is the one the map is pointed at. Every statement below is from the map entry, the printed Product Portfolio Book (page renders p048, p049 and p025 in public/catalogue/2026-27, read as images), the site's product and application files, or the photograph. Line numbers are on branch feat/map-posts. About 330 words: the record is a caption and a spread.

Written beside the other map posts: the Burnaby court (burnaby-basketball-court-streetbond) quotes the spread's "hardest colour environments" line and StreetBond's "designed to move with the pavement" line, so this piece uses neither and leans on what only this court has (its layout in colour, the spread's own headline, the StreetBondSR line).

## What the record holds

- lib/map-projects.ts:1694–1711. Comment: "Product Book p.49, the Sport Courts spread: "Montréal, Québec". The site is not identified: approximate." Entry: title "Basketball court" (:1697), city Montréal, province QC (:1698–1699), product StreetBond (:1702), application Sport Courts (:1703), `approximate: true` (:1704), images `local("montreal-basketball-court")` (:1706), ideaBookPage 49 (:1708), excerpt "A basketball court in StreetBond blue and yellow in Montréal." (:1710). No year, client, installer, designer, size or cost.
- lib/idea-book-edition.ts:237: the Sport courts application leaf, pages 48–49, `mapId: "montreal-basketball-court"`, photo page 49 (applicationLeaf, :512–526, takes the photo from page + 1), alt "A blue and yellow StreetBond basketball court in Montréal, Québec". The leaf names this job's mapId and its photograph is this court, so the spread is tied to the job.
- lib/idea-book-print.ts:211–221, the printed Sport courts spread (page 48): title "Court colours expanded." (:212), statement (:213), body (:214), SPECIFY StreetBond "Court colour on asphalt or concrete" and StreetBondSR "Solar reflective: cooler underfoot" (:215–218), caption "Montréal, Québec" (:219). Checked against the renders: the same words; the caption on p.49 prints the city only, no system.

Because the pin is approximate (placed by the town only), the piece names Montréal and no street, school or site. The building in the photograph is described, not named.

## First paragraph

- "A basketball court in Montréal, Québec, is coated in two blues and yellow StreetBond": map :1697–1699, :1702, :1710; edition alt :237; the printed caption (:219). The two blues are what the photograph shows. The caption names no system; the spread specifies StreetBond.
- "the colour on a surface players stop on and push off from all game long": general context for a court, no figure; lib/applications.ts:147 ("Lateral movement, constant foot traffic").
- "the court on the Sport courts spread of HUB Surface Systems' Product Portfolio Book · Volume 5, opposite the headline "Court colours expanded."": edition :237 (photo on p.49 facing p.48); idea-book-print.ts:212.

## A court laid out in blocks of colour

- "The spread's caption names the city and no more": idea-book-print.ts:219; map comment :1694–1695. Linked to /product-book/48.
- The photograph (public/images/map/montreal-basketball-court.jpg, the map's photo, and the book's p.49 photo, a tighter frame of the same court; both read as images): fields of a lighter and a darker blue with no white lines; the darker blue marks out the key in front of the nearer basket; yellow circles of several sizes, the largest around the post of that basket; yellow carried past the blue onto the black asphalt that frames the court (the large circle straddles the edge, two more sit on the bare asphalt); a pale brick building with a row of high windows along one side, young shrubs staked along its wall.

## Court with its border and markings in one coating

- The heading: lib/applications.ts:147 ("The playing surface, the border and the lines go down in the same material"). Written without a comma (no comma in a heading); it replaced "The coating under the game" on 28 Oct 2026, one of six "The X under the Y" headings in the forty.

- "StreetBond is a pavement coating": docs/GLOSSARY.md:37.
- "on a court the playing surface, the border and the markings all go down in it, with a texture for grip in the wet": lib/applications.ts:147 ("The playing surface, the border and the lines go down in the same material, with a texture that gives grip in the wet"). "every shape is a field of the one coating": the record names a StreetBond court (:1710) and the photograph shows no other surface on it.
- "custom colour matching, so a court can carry a school's or a club's own colours": lib/applications.ts:147 ("custom matching for a school's or a club's colours"). A general line, not a claim about who owns this court.
- "StreetBond carries a service life of 8+ years in the book, and it is refreshed by recoating": idea-book-print.ts:112 ("8+ years / easily refreshed", printed "Life cycle", written as service life per docs/GLOSSARY.md and lib/product-catalogue.ts:79); lib/products.ts:161 ("a worn surface is recoated").
- "the spread pairs it with StreetBondSR, its reflective counterpart, noted there as "cooler underfoot"": idea-book-print.ts:217; "For a court in full sun": lib/applications.ts:147 ("a court in full summer sun stays cooler underfoot"). The piece does not say this court is StreetBondSR.

## Close

- Lunch & Learn: "60 minutes": lib/lunch-learn-content.ts:30 ("Sixty minutes"); Doug, 26 Oct 2026 ("60 mins, across the board", CLAUDE.md). "in person with lunch provided or online with a $25 voucher in place of the meal": components/sections/LunchLearnV2.tsx:52, :55. "never invoiced": lib/lunch-learn-content.ts:34 ("No invoice"). Link /lunch-learn?topic=StreetBond#book. The only one of these five posts that ends on the Lunch & Learn (no sport court post has one; four StreetPrint map posts already do).

## Links (each checked, 200 on hubss.com, 27 Oct 2026)

/products/streetbond, /products/streetbondsr; /product-book/48 (the spread's first page); /applications/sport-courts; /lunch-learn?topic=StreetBond#book. Each once. No published post is the same subject, so none is linked. No outside links.

## Photo

public/images/map/montreal-basketball-court.jpg (1600 x 739), the map entry's own photo (:1706), uploaded on the real run; it has no Sanity copy (lib/map-projects.ts:74–76). Alt: what the photograph shows, with StreetBond (map :1702) and Montréal, Québec (caption). Hotspot x 0.6 y 0.55, on the key and the large yellow circle, so a phone's portrait cut keeps the court.

## Left out

- The site, the building and any street: the pin is approximate (:1704) and no record names them. The building may be a school; nothing says so.
- Install year, owner, installer, designer, area and cost: no record states them.
- The spread's body ("StreetBond can transform an asphalt playground into a vibrant, coloured surface. Non-slip, UV-stable ..."): it carries words docs/STYLE.md and the brief rule out ("transform", "vibrant", "non-slip" as a promise).
- StreetBond's colour count (63): a count used as a selling point (docs/STYLE.md).
