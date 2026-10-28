# Sources: A TrafficPatternsXD crosswalk at Brampton's Bramalea Terminal

/blog/bramalea-terminal-crosswalk-brampton · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/bramalea-terminal-crosswalk-brampton.md` · 28 Oct 2026

The write-up for the homepage map's pin `brampton-bramalea-terminal` (job 24 of the 40 without one). Each statement about HUB, a system, the place or the photograph, then the line it rests on. Line numbers are on feat/map-posts at fede3fd. The printed pages were read from their renders (public/catalogue/2026-27/p046, p047 and p013, 1400 px), and the photo was downloaded from Sanity's CDN and looked at.

## What the record holds

- lib/map-projects.ts:1237–1238, the comment: "Product Book p.47: "Brampton, Ontario". The canopy sign behind reads Brampton Transit, Bramalea T[erminal]. Pin at Peel Centre Dr and Central Park Dr."
- :1239–1253, the entry: title "Bramalea Terminal crosswalk", Brampton, ON, product TrafficPatternsXD, application Crosswalks, not approximate, one photo, cdn 36497374…-2400x1800 (:1248, "products/traffic-patterns-xd/traffic-patterns-xd-70 (Product Book p.47)"), ideaBookPage 47 (:1250), excerpt "A red and white TrafficPatternsXD crosswalk in front of Brampton Transit's Bramalea Terminal." (:1252).
- The book: pp.46–47, the Crosswalks spread, Application 01. lib/idea-book-edition.ts:236 names this job's mapId ("brampton-bramalea-terminal"), alt "A TrafficPatternsXD crosswalk at Bramalea Terminal, Brampton, Ontario"; the photograph is p.47 (applicationLeaf, :524), the same frame as the CDN photo (the CDN copy is wider). The applications divider is pp.44–45 (:231), so this is the first application spread. The words are p.46, lib/idea-book-print.ts:199–210: headline "Crosswalks that hold their colour and their grip." (:200), statement (:201), body (:202), SPECIFY TrafficPatternsXD "150 mil, aggregate-reinforced", TrafficPatterns "125 mil, aggregate-reinforced", DecoMark (:204–206), caption "Brampton, Ontario" (:208).

## Opening

- "The crosswalk in front of Brampton Transit's Bramalea Terminal in Brampton, Ontario": map :1252; comment :1237–1238.
- "is laid in bands of red and off-white squares between white edge lines": the photograph, by eye. The map says "red and white" (:1252); the pale squares in the photo are a cream white, so "off-white".
- "and it is TrafficPatternsXD": map :1245; lib/idea-book-edition.ts:236.
- "In the photograph the terminal's canopy and glass front stand behind it, with buses lined up along the building and one of them lettered Brampton Transit. A pedestrian waits at the far corner.": the photograph, by eye.

## What the red and off-white bands are made of

- "The material is a 150 mil sheet of aggregate-reinforced preformed thermoplastic.": lib/idea-book-print.ts:80, :83 (p.13); lib/products.ts:96.
- "Heated on prepared asphalt, the sheet is then stamped, and the stamp presses the square pattern through it into the top of the asphalt": lib/products.ts:96 ("heated on prepared asphalt and stamped through into the top of the asphalt"); docs/GLOSSARY.md ("presses a pattern through the material into the top of the asphalt").
- "TrafficPatternsXD is made for asphalt alone.": lib/products.ts:103 (Surfaces: Asphalt).
- "On its own page the Product Portfolio Book · Volume 5 sets the system's service life at 10+ years and credits its high colour contrast with increased safety.": lib/idea-book-print.ts:86 and :81 ("High colour contrast for increased safety."). First mention of the book, in full.
- "The same page says it is "specified by Canadian transit authorities, municipalities and commercial stakeholders across Canada"": lib/idea-book-print.ts:81, quoted with its first letter lower-cased.
- p.13's uses strip (lib/idea-book-print.ts:88, Transit among them): no longer cited. Nine of the map posts from Ontario east cited a uses strip; two keep it (the Toronto fleet lot and Mont-Mégantic).

## The first spread in the book's applications

- "The book opens its applications with crosswalks, numbered Application 01, and this crosswalk is the photograph on page 47.": p.46 render ("APPLICATION 01"); lib/idea-book-edition.ts:231, :236, :524; p.47 render (caption "Brampton, Ontario").
- "The paragraph on the facing page says preformed thermoplastic holds its skid resistance and its "high-contrast colour through snowplow cycles and de-icing seasons".": lib/idea-book-print.ts:202. The book's "ASTM-rated" is left out of the paraphrase: the lint flags it, and the site's WEB_EDITS cut it from the same line.
- "Under SPECIFY it puts TrafficPatternsXD first, at "150 mil, aggregate-reinforced", ahead of TrafficPatterns at 125 mil.": lib/idea-book-print.ts:204–205.
- "The site's crosswalks page draws the line between the two. TrafficPatterns is heat-applied to asphalt or concrete and bonds to the surface, while the thicker TrafficPatternsXD is stamped into asphalt for intersections where traffic is heavy and turning.": lib/applications.ts:52 ("TrafficPatterns is heat-applied to asphalt or concrete and bonds to the surface; TrafficPatternsXD, the thicker, aggregate-reinforced sheet, is heated on prepared asphalt and stamped into it, for intersections with heavy, turning traffic."), in its own words; Studio holds the same text (public API, read 28 Oct 2026). The post does not say this crosswalk is at such an intersection.
- The Lunch & Learn: 60 minutes (Doug, 26 Oct 2026, in CLAUDE.md), in the office or online, lunch on HUB, a $25 voucher online, no invoice (components/sections/LunchLearnV2.tsx:55, :443, :489, :636); the link is lunchLearnHref's form, /lunch-learn?topic=TrafficPatternsXD#book (lib/lunch-learn.ts). First mention of HUB, in full. The only one of the five to end on a Lunch & Learn.

## Links (each checked)

/products/traffic-patterns-xd, /products/traffic-patterns, /product-book/47, /applications/crosswalks and the Lunch & Learn, each once. decorative-crosswalk-meridian (the Humberwest Parkway job, also Brampton) is not linked: a different job, and its post names the parkway but not the city.

## Photo

image-36497374754a6f6c1668e66b8f8c143c0411fd67-2400x1800-jpg, already in Studio (the map entry's only photo; the dry run found it, 2400x1800). Hotspot x 0.5 y 0.6 w 0.95 h 0.78, on the crosswalk with the terminal above it. The alt names TrafficPatternsXD, Bramalea Terminal and Brampton, which the records prove.

## Left out

- The streets: the comment's "Pin at Peel Centre Dr and Central Park Dr" places the pin, and no record says the crosswalk is at that corner.
- The red bus's brand: its lettering is partly hidden; only "Brampton Transit" is plain in the photograph.
- An install year, installer, client or the number of crosswalks: no record gives them. The photo's camera date (10 Jul 2012, the EXIF of public/images/products/traffic-patterns-xd/traffic-patterns-xd-70.jpg) is not a record of when the crosswalk went in.
- The p.46 headline and its line "Providing increased visibility and safety for pedestrians.": quoted in health-and-active-living-plaza-east-gwillimbury and railway-lands-crosswalks-toronto. "Proven in high traffic with concentrated wheel loads" (p.13): four other drafts quote it.
- Length: about 312 words by the script's count.
