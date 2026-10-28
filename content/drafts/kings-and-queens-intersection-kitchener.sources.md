# Sources: Kings and Queens in TrafficPatterns at a Kitchener intersection

/blog/kings-and-queens-intersection-kitchener · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/kings-and-queens-intersection-kitchener.md` · 27 Oct 2026

The write-up for the homepage map's pin `kitchener-kings-queens` (map job 20 of the 40 without one). Each statement about HUB, a system, a place or the photograph, then the line it rests on. Line numbers are on feat/map-posts at fede3fd. The printed pages were read from their renders (public/catalogue/2026-27/p106, p107, p066, p011) and the PDF's text layer.

## What the record holds

- lib/map-projects.ts:1033–1051. Comment (:1034–1036): "Product Book p.107: "Intersection art. Kings and Queens... Kitchener, Ontario | TrafficPatterns". CTV (2019) describes crowns for King and Queen Streets at this intersection." Entry: title "Kings and Queens intersection" (:1038), city Kitchener, ON (:1039–1040), product TrafficPatterns (:1043), application Public Art (:1044), photo local("kitchener-kings-queens") (:1046, public/images/map/kitchener-kings-queens.jpg), ideaBookPage 107 (:1048), excerpt "Public art in TrafficPatterns at King and Queen Streets, making a historic downtown intersection a place for people on foot." (:1050). Not approximate. No year.
- The book: lib/idea-book-edition.ts:373, p.107, mapId "kitchener-kings-queens": eyebrow "Intersection art", title "Kings and Queens.", body "Public art transforming a historic downtown intersection for a pedestrian-friendly space.", caption "Kitchener, Ontario | TrafficPatterns". The render of p.107 was looked at: its photograph is the map's photo, cropped square.
- Another draft in this folder, decorative-pavement-landscape-architects, also mentions this job; no sentence here repeats one of its sentences.

## First paragraph

- "King Street and Queen Street meet in downtown Kitchener, Ontario, over a work of public art in TrafficPatterns preformed thermoplastic.": lib/map-projects.ts:1050 ("at King and Queen Streets", "a historic downtown intersection"), :1043; p.107's caption.
- "The Product Portfolio Book · Volume 5 names it "Kings and Queens" and gives it page 107.": lib/idea-book-edition.ts:373 (the record names this job's mapId, and its photograph is this job). The book's full name at its first mention: lib/catalogue.ts:77. Link /product-book/107.

## Inside the four crosswalks

- "The book's photograph looks straight down on the intersection. The art fills the middle, with a crosswalk of white bars on each side. A pink circle with a teal crown sits near the centre. Around it are a large sand-coloured circle crossed by wavy bands of yellow, coral and pale blue, purple panels drawn with gold lines, teal wedges and stripes of orange and violet. Red-brick buildings stand on two of the corners.": the photograph (the map's 1600 px file and p.107), looked at, with a close crop of the centre. The crown is described because the photograph plainly shows one; the CTV report the map's comment cites (:1035) is not used. Nothing is said about who made the crosswalks' white bars.
- "The page carries a single sentence of text, and it is about the people on foot: the art turns "a historic downtown intersection" into "a pedestrian-friendly space".": p.107's body (lib/idea-book-edition.ts:373), its two phrases quoted word for word; its verb, "transforming", is on docs/STYLE.md's list, so the sentence is not quoted whole.
- "The caption names the city and the system": p.107's caption, "Kitchener, Ontario | TrafficPatterns".
- "the facing page, 106, is another TrafficPatterns job, the Musqueam Nation land acknowledgement at UBC": lib/idea-book-edition.ts:371–372 (the spread, pp.106–107; p.106's title "Musqueam Nation land acknowledgement, UBC." and caption "UBC, British Columbia | TrafficPatterns"); the render of p.106.
- Cut on 28 Oct 2026: "HUB Surface Systems shows Kings and Queens as a public art job." (the map's application, lib/map-projects.ts:1044; the same filing sentence ran in most of the forty map posts). The job's application, public-art, stays in relatedApplications.

## Thermoplastic at the scale of an intersection

- "For public art, the book's page 66 specifies TrafficPatterns as "large-scale interconnected thermoplastic", beside DecoMark for artwork and graphics and StreetBond for large-scale colour fields.": p.66's SPECIFY list (lib/idea-book-print.ts:317–321; the render prints the notes in lower case, as quoted). The spread's photograph (p.67) is the Fauxreel artwork in Toronto, not this job: page 66 is cited for its words only. Its body ("vibrant", and an em dash) is not quoted. Link /product-book/66.
- "Here the design covers a whole intersection.": the photograph.
- "TrafficPatterns is made for a design like this in the factory, as sheets cut to the artwork and 125 mil thick, and the sheets are heated on the asphalt until they bond to it.": lib/products.ts:119 ("factory-made to your design at 125 mil and heat-applied to asphalt or concrete, where it bonds to the surface"); docs/GLOSSARY.md, "preformed thermoplastic" ("Sheets ... made in a factory, cut to shape, laid on the pavement and heated until they bond to it"). Written as how the system goes in; who installed this job is not said (no record names an installer).
- "The system's own page (page 11) gives a return to traffic within hours, and 8+ years as its service life. Skid resistance there is 60 BPN on the ASTM E303 test.": p.11 (lib/idea-book-print.ts:72, "Open to traffic: Hours"; :73; :71); lib/products.ts:119 ("Open to traffic within hours of installation").
- The Lunch & Learn: "is 60 minutes long" (lib/lunch-learn-content.ts:30; Doug, 26 Oct 2026, "60 mins, across the board"); "held at your office or online and built around your project" (components/sections/LunchLearnV2.tsx:52, "In your office or online, built around your projects"); "HUB Surface Systems buys lunch, or a $25 voucher stands in for it online" (LunchLearnV2.tsx:55, "Lunch on HUB, and a $25 voucher when the session's virtual"; HUB's first mention in the post now, so in full); "no invoice follows" (lib/lunch-learn-content.ts:34, "No invoice"). Link /lunch-learn?topic=TrafficPatterns#book (lib/lunch-learn.ts:20–29). No continuing-education claim. One of the two posts of the five that end on a Lunch & Learn; its words differ from the other one's (green-square-courtyard-kelowna) and from the other drafts'.

## Links (each checked)

/products/traffic-patterns, /products/decomark, /products/streetbond (first mentions), /product-book/107, /applications/public-art, /product-book/66, /lunch-learn?topic=TrafficPatterns#book. The dry run resolves the product and the application. No published post is the same subject, so none is linked (ubc-musqueam-crosswalk is the facing page's job, not this one).

## Against the other posts

A seven-word-run check against the 77 published posts and every other draft in content/drafts (27–28 Oct 2026) finds no shared run but the book's name.

## Photo

public/images/map/kitchener-kings-queens.jpg (1600x900, the map's own photo of the job, the same photograph the book prints on p.107; no copy is in Studio, so the real run uploads it). coverAlt: what it shows, with TrafficPatterns, King and Queen Streets and Kitchener, Ontario, which the book and the map prove. coverHotspot x 0.51 y 0.52 w 0.4 h 0.65, on the art in the middle of the frame.

## Left out

- A year: no record gives one (the map's comment cites a 2019 news report that describes crowns at the intersection, a single research note, and the entry has no year).
- The artist, the client, the installer, the art's size and the colours' names: no record gives them. The colours are described as the photograph shows them.
- Who designed or installed the crosswalks around the art, and what they are made of: no record says.
