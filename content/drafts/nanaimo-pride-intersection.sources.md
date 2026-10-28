# Sources: A Progress Pride intersection in downtown Nanaimo

/blog/nanaimo-pride-intersection · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/nanaimo-pride-intersection.md` · 28 Oct 2026

Map job 2 of the 40 pins with no write-up (BRIEF.md, 27 Oct 2026). The slug is the one the map is pointed at. Each statement about HUB, the system, a number, the place, a year or the book, then the line it rests on. Files and line numbers are on feat/map-posts at fede3fd. The book page is the printed Product Portfolio Book · Volume 5, p.126: the render public/catalogue/2026-27/p126-1400.webp was read, and its words checked against lib/idea-book-edition.ts. A thin record: about 271 words by the script's count, and nothing added to reach a length.

Checked against the other drafts in content/drafts on 28 Oct 2026: no sentence or heading in common. The opening leads with the people who cross the intersection; the Green Square draft opens on a photograph "taken from above", so this one does not.

## What the record holds

- lib/map-projects.ts:99–119, id nanaimo-pride-intersection. Comment (:100–103): "Product Book p.126: "Community colours. Nanaimo, British Columbia | TrafficPatterns". The Nanaimo Bulletin places it at Commercial and Bastion (June 2025). Square One lists it as TrafficPatternsXD: the book is followed, and the difference is flagged for Doug." Title "Pride intersection, Commercial and Bastion" (:105), Nanaimo, BC (:106–107), product TrafficPatterns (:110), application Community Branding (:111), year "2025" (:112), not approximate, one photo (:114, local nanaimo-pride-intersection, book p.126), ideaBookPage 126 (:116), excerpt (:117–118): "A Progress Pride intersection at Commercial and Bastion Streets in downtown Nanaimo, finished in June 2025."
- The book, p.126 (lib/idea-book-edition.ts:438, mapId nanaimo-pride-intersection; its photo is this job's photo, the same frame as public/images/map/nanaimo-pride-intersection.jpg): eyebrow "Pride", headline "Community colours.", caption "Nanaimo, British Columbia | TrafficPatterns". No body text.
- The system: book p.11 (lib/idea-book-print.ts:65–77), the thermoplastic colour pages, pp.14–15 (lib/idea-book-edition.ts:167–171); lib/products.ts:111–133. The application: book p.68 (lib/idea-book-print.ts:325–336).

## First paragraph

- "People crossing at Commercial and Bastion Streets in downtown Nanaimo, British Columbia, walk over the colours of the Progress Pride flag, which fill the intersection from curb to curb": the map's excerpt (:117–118: "A Progress Pride intersection at Commercial and Bastion Streets in downtown Nanaimo") and title (:105); the photograph (the colour fills the intersection to the curb lines, crosswalks included). The pin is not approximate, so the streets are named. Province spelled out (docs/STYLE.md:71–73).
- "The intersection is TrafficPatterns preformed thermoplastic": the book's caption (lib/idea-book-edition.ts:438) and the map (:110). See "Left out" for Square One's listing.
- "finished in June 2025": the excerpt (:117–118); the year field "2025" (:112).
- "its photograph has page 126 to itself in HUB Surface Systems' Product Portfolio Book · Volume 5": lib/idea-book-edition.ts:438 (p.126 is one job's page; p.127 facing it is another job); ideaBookPage 126 (:116). First mention of HUB and of the book, in full.

## Rainbow bands and a chevron

- All of it is what the photograph plainly shows: the view from high on one corner; curved bands of red, orange, yellow, green, blue and purple across most of the intersection; a chevron cutting in from one side in black, brown, light blue and pink; white lines marking a crosswalk on each of the four sides, with the colour carried through them to the curbs; storefronts at the corners. No business in the frame is named. The white lines are not given a material: no record says what they are.

## The book's page for Nanaimo

- "The page's label is Pride, and its headline is 'Community colours.'": p.126's eyebrow and headline (lib/idea-book-edition.ts:438), as on the render.
- "The book's community branding spread ends on 'The street can tell the story.'": p.68 body, its last sentence, word for word (lib/idea-book-print.ts:328). The map files the job under Community Branding (:111); the post no longer says so, and the book's page itself is not called a community branding page: its label is Pride.

## What the colours are made of

- "TrafficPatterns is cut to the design in the factory, at 125 mil, so what arrives on site is the design itself, ready to be heated onto the road until it bonds": lib/products.ts:119 ("factory-made to your design at 125 mil and heat-applied to asphalt or concrete, where it bonds to the surface"); docs/GLOSSARY.md:27–29 ("made in a factory, cut to shape, laid on the pavement and heated until they bond to it"). "The road", not "the asphalt": no record names the pavement under the colour.
- "Its page in the book closes on 'Custom designs to fit with the community.'": p.11 description, its last sentence, word for word (lib/idea-book-print.ts:68).
- "The colour is the thermoplastic's own": preformed thermoplastic is made coloured in the factory (docs/GLOSSARY.md:27; p.11, "so the grip lasts as long as the colour", lib/idea-book-print.ts:68).
- "the book's thermoplastic colour pages describe the range as 'Formulated for UV stability,' with physical samples on request": pp.14–15, eyebrow "TrafficPatternsXD, TrafficPatterns and DecoMark", subtitle "Formulated for UV stability." (lib/idea-book-edition.ts:169), and "Physical samples available by request." (:170). The page's colour count is left out (no counts as a selling point).
- "Anti-skid aggregate runs through the material as well, and the book puts the skid resistance at 60 BPN under ASTM E303": p.11 (lib/idea-book-print.ts:68, :71); docs/GLOSSARY.md:33.
- "An installation opens to traffic within hours of going down": p.11 "Open to traffic: Hours" (:72). "the book gives TrafficPatterns a service life of 8+ years": p.11 (:73).

## Links (each checked)

/products/traffic-patterns (first mention of the system), /applications/community-branding. No outside links. None of the seven guides the brief bars. The piece ends on the system's facts; no Lunch & Learn and no book link at the close (BRIEF.md: vary the close).

## Photo

public/images/map/nanaimo-pride-intersection.jpg (1184x864, with its -sm twin), the map's own photo of this job (lib/map-projects.ts:114) and the photograph on p.126; uploaded on the real run. coverAlt: "The intersection of Commercial and Bastion Streets in Nanaimo, British Columbia, seen from above in the bands of the Progress Pride flag, in TrafficPatterns": place from the map, system from the caption. coverHotspot x 0.52 y 0.55 w 0.85 h 0.8, on the coloured field.

## Note for Doug (`forDoug`, printed in Studio as "To confirm before Publish: ...")

- "The book prints this Nanaimo intersection as TrafficPatterns, but Square One's project page lists it as TrafficPatternsXD. Which is right? The post follows the book until you say.": the p.126 caption (lib/idea-book-edition.ts:438); the map's comment, "Square One lists it as TrafficPatternsXD: the book is followed, and the difference is flagged for Doug" (lib/map-projects.ts:102–103).

## Left out, and why

- TrafficPatternsXD: the comment says Square One lists the job as TrafficPatternsXD (:102–103). The book's caption says TrafficPatterns and the book wins (BRIEF.md), as the map does; the post says TrafficPatterns and never mentions the other listing. Put to Doug in the note he reads in Studio (`forDoug`): which system it is.
- Simcoe's Pride crosswalk in TrafficPatternsXD (simcoe-rainbow-crosswalk): cut from the book's-page section. It was off that section's subject and leaned on the TrafficPatterns/TrafficPatternsXD question that is still open.
- The Nanaimo Bulletin: the comment's source for the corner (:101). No outside links, and the map's own excerpt places the job.
- Who commissioned or designed the intersection, the installer, the area, the colours by name: no record gives them.
- The book's closing page lists "City of Nanaimo" among the communities HUB works with (lib/idea-book-edition.ts:492); not tied to this job, so not used.
