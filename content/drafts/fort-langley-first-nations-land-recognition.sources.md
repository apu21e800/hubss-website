# Sources: Fort Langley's First Nations land recognition in DecoMark

/blog/fort-langley-first-nations-land-recognition · new draft, map job 14 (`fort-langley-land-recognition`), loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/fort-langley-first-nations-land-recognition.md` · 27 Oct 2026

Vern, 27 Oct 2026: "if it's on the map it should have it's own landing page (blog), if it's missing a landing page, create one." Each statement about HUB, a system, a number, a place or the book, then the line it rests on. Line numbers are on feat/map-posts at fede3fd. "Book p.N" is the printed Product Portfolio Book · Volume 5: the renders of pages 31 and 114 (public/catalogue/2026-27/pNNN-1400.webp) were opened and read; the words are in lib/idea-book-print.ts and lib/idea-book-edition.ts.

## What the record holds

- lib/map-projects.ts:807–826. Comment: "Product Book p.114: "First Nations Land Recognition... Fort Langley, British Columbia | DecoMark". Matched from the photo, not a source, to the steps by salishan Place: approximate." Entry: title "First Nations land recognition", city Fort Langley, province BC, product DecoMark, application Community Branding, `approximate: true`, image cdn("1b2cb6050840a10057e1585cf83bf07013c07e0f-1800x2400.jpg") (the TrafficPatterns gallery's traffic-patterns-42, "Product Book p.114"), ideaBookPage 114, excerpt "A First Nations land recognition, cast in DecoMark and set into the ground in Fort Langley."
- lib/idea-book-edition.ts:394–399: p.114, eyebrow "Community branding", title "First Nations Land Recognition.", body the acknowledgement in quotation marks, caption place "Fort Langley, British Columbia", system "DecoMark", mapId "fort-langley-land-recognition". The record names this job's mapId and its photograph is the job, so p.114 is tied to it. The printed page carries the same words and caption.

## Left out, and why

- The site. The pin is `approximate`: the comment matched the photograph, not a source, to a site. The piece names only the town, describes the photograph without naming any site, and never names a street.
- Whose words. The page prints the acknowledgement in quotation marks with no name beside it, so the piece gives it as the page's and says the page gives no name. No Nation is named: no record names one.
- The middle sentence of the acknowledgement ("We recognize and honour their enduring stewardship of these lands, waters, and communities, and ..."): the house style check flags "enduring" (lib/style-lint.ts:215), and a quote cannot be reworded. The piece quotes the first sentence whole and the closing words of the second, each word for word, and says nothing about the middle.
- The system. The book's caption says DecoMark, and so does the map entry. The photo's gallery copy is filed in the TrafficPatterns folder, and lib/image-facts.ts:1006 prints its gallery line as "TrafficPatterns preformed thermoplastic" with the source marked "CHECK (a record names DecoMark for this TrafficPatterns folder photo)"; the caption sheet's eye note (docs/site-audits/gallery-captions-2026-10-26.csv, traffic-patterns-42) reads the tan circle as a StreetBond field. The book wins over everything (the brief), so the piece says DecoMark and goes no further: it does not say which part of the circle is which material. Flagged for Doug: the gallery line and the book disagree.
- The map excerpt's "cast in DecoMark and set into the ground": DecoMark is heat-applied and bonds to the surface (docs/GLOSSARY.md); it is not set into the ground. Not used.
- No year, client, designer, installer, quantity, cost or service life: no record gives one, and the book prints no service life for DecoMark.

## First paragraph

- "A First Nations land recognition lies on the asphalt in Fort Langley, British Columbia": book p.114 (title and caption); lib/map-projects.ts:812–814.
- "a sand-coloured circle holding four rounded forms in green, yellow, blue and red around a white disc with a four-pointed star": the photograph, read in full.
- "It is DecoMark": book p.114 caption (lib/idea-book-edition.ts:396, system "DecoMark"); lib/map-projects.ts:815. "fabricated to the design's artwork in HUB Surface Systems' colour palette": book p.31 (lib/idea-book-print.ts:133, "Factory fabricated to your vector artwork using our colour palette").
- "page 114 of the Product Portfolio Book · Volume 5 is given over to it": p.114 shows this job alone (lib/idea-book-edition.ts:396); the book's full name, lib/catalogue.ts:77.

## The words on page 114

- "heads the job "First Nations Land Recognition."" and "sets a land acknowledgement beneath the heading, in quotation marks": printed p.114; lib/idea-book-edition.ts:396 (title and body).
- "We acknowledge those lands that are the traditional, ancestral, and unceded territories of Canada's First Nations, Inuit, and Métis peoples.": p.114, the first sentence, word for word.
- "to walking forward together in the spirit of truth and reconciliation.": p.114, the end of the second sentence ("and we commit to walking forward together in the spirit of truth and reconciliation."), word for word.
- "The page gives no name beside the words": printed p.114, read from the render.
- "It sits among the book's community branding projects": the page's eyebrow, "Community branding" (lib/idea-book-edition.ts:396). "its last line gives the town and the system: "Fort Langley, British Columbia | DecoMark"": printed p.114.

## A circle on the asphalt

- "The full photograph looks across the circle to a broad flight of steps between grass terraces": the cover, the map's full 1800x2400 frame. The crop printed on p.114 shows only the foot of the steps (render looked at, 28 Oct 2026), so the view is not called the book's.
- The white crescents and three-armed shapes in each form, the red form nearest the camera and largest, the plain dark asphalt around it: the photograph (the cover, and the same photograph cropped on p.114). Nothing in it is named.

## Heat-applied to the asphalt

- "factory-made sheets of preformed thermoplastic, cut to the design's vector artwork in standard and premium colours": book p.31 (lib/idea-book-print.ts:133, :135–137: "Preformed thermoplastic", "Standard and premium options", "Vector artwork").
- "the pieces are set out where the design goes, then heated, and they bond to the pavement beneath": docs/GLOSSARY.md ("preformed thermoplastic ... laid on the pavement and heated until they bond to it"; DecoMark is heat-applied and bonds to the surface); lib/products.ts:227, :232 ("Heat-applied, bonds to the surface"). The book's spec says "Heat-fused" (:138), written here in the glossary's words.
- "125 mil, about 3 mm": book p.56, the creative design spread's SPECIFY note for DecoMark (lib/idea-book-print.ts:261, "125 mil preformed custom graphics"); 125 mil is 3.2 mm (docs/GLOSSARY.md, "mil").
- "The anti-skid aggregate, a hard grit, runs through the sheet itself, so it still grips as it wears down, and the pavement below is left uncut": lib/products.ts:227 ("Anti-skid aggregate runs through the material, so the grip lasts as the surface wears, and it does not alter the pavement underneath"); docs/GLOSSARY.md ("anti-skid aggregate: hard grit mixed right through the thermoplastic"; for the surface-applied systems, "The pavement is not cut or stamped").
- "Identity is the first of the uses its page in the book lists, before wayfinding, public art and memorial": book p.31 (lib/idea-book-print.ts:140).
- "The site's community branding page names DecoMark as the system for work like this": lib/applications.ts:130 ("DecoMark is the system: custom graphics factory-cut in preformed thermoplastic to the community's artwork").
- "horizontal wayfinding and community/BIA branding": book p.68, the community branding spread's SPECIFY note for DecoMark (lib/idea-book-print.ts:330), word for word.

## Links (each checked)

/products/decomark (lib/products.ts:218), /product-book/114 (app/product-book/[page]/page.tsx), /applications/community-branding (lib/applications.ts:124). Each once; no paragraph links one page twice. No published post is linked: the land acknowledgement posts in posts-index-published.json (the UBC Musqueam crosswalk) are TrafficPatterns crosswalks, a different system and a different kind of job. No outside links.

## Against the other map posts

Checked against the other drafts in content/drafts on 27 Oct 2026 with a script comparing six-word runs: none shared outside names and fixed terms. The Burnaby post opens "Burnaby, British Columbia, has ...", and the Whitehorse acknowledgement post describes the install as "On site the sheets are laid ...", so this piece uses neither shape.

## Photo

image-1b2cb6050840a10057e1585cf83bf07013c07e0f-1800x2400-jpg, already in Studio (the map entry's own photo, lib/map-projects.ts:821; the photograph on p.114). The dry run found it (1800x2400). Alt: "A First Nations land recognition in DecoMark, four coloured forms around a white star on a sand-coloured circle, Fort Langley, British Columbia" (the system and the town from the book's caption; no site). The photo is portrait and the circle fills its lower half, so the hotspot is x 0.5 y 0.77 w 0.92 h 0.42, on the circle, leaving the sky out of a wide crop.

## Length

About 355 words. The record is the book's page, its words and one photograph; the piece stops there.
