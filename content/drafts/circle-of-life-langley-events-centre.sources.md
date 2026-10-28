# Sources: Circle of Life in StreetBond at the Langley Events Centre

/blog/circle-of-life-langley-events-centre · new draft, map job 12 (`langley-events-centre`), loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/circle-of-life-langley-events-centre.md` · 27 Oct 2026

Vern, 27 Oct 2026: "if it's on the map it should have it's own landing page (blog), if it's missing a landing page, create one." Each statement about HUB, a system, a number, a place or the book, then the line it rests on. Line numbers are on feat/map-posts at fede3fd. "Book p.N" is the printed Product Portfolio Book · Volume 5: the renders of pages 25, 66 and 133 (public/catalogue/2026-27/pNNN-1400.webp) were opened and read; the words are in lib/idea-book-print.ts and lib/idea-book-edition.ts.

## What the record holds

- lib/map-projects.ts:719–737. Comment: "Product Book p.133 (Square One Paving, HUB Master Installer, British Columbia). Square One's project page: "Circle of Life" in StreetBond, custom-mixed colours, on the plaza by the stadium, 7888 200 St." Entry: title "Circle of Life, Langley Events Centre", city Langley, province BC, product StreetBond, application Public Art, no year, not approximate, image local("langley-events-centre") ("Product Book p.133"), ideaBookPage 133, excerpt "Circle of Life by Drew and Elinor Atkins of Spring Salmon Studio, a StreetBond medallion on the plaza at the Langley Events Centre."
- Book p.133 (lib/idea-book-edition.ts:459–464) is Square One Paving's installer page: "HUB master installer · British Columbia", "From city streets to community landmarks.", a body line, the company's phone and web address, and the photograph (alt "A circular Indigenous design in colour on a plaza, with a running track behind"). The page prints no caption for the photograph, and the edition's record for it names no mapId.

## Left out, and why

- The book page. The brief's rule: tie a book page to a job only where the edition's record for that page names the job's mapId and its photo is the job. The record for p.133 names no mapId, so the post never says the book shows this job, never links /product-book/133, and calls the cover "the photograph", not "the book's photograph". The map entry's ideaBookPage 133 rests on the photograph alone.
- The artists, Drew and Elinor Atkins of Spring Salmon Studio: only in the map's excerpt (:736), with no source given; the comment's source (Square One's project page) is cited for the name, the system, the colours and the plaza, not for the artists, and no other file in the repository names them. One place, so left out. Doug or Vern to confirm the credit; a public art piece should carry its artists' names once a record states them. Put to Doug in the note he reads in Studio (below).
- The installer, Square One Paving: no record says it installed this piece. The comment cites Square One's project page and the book's Square One page carries the photograph, but neither says so in words. Left out.
- "Custom-mixed colours": the comment's summary of Square One's page, one place. Left out; the post gives the book's general fact instead (custom colour matching), not a claim about this job's colours.
- 7888 200 St (the comment): a street address. Never printed.
- No year, client, designer, quantity or cost: no record gives one. What the forms depict: no record says, so the piece describes them and does not interpret them.

## Note for Doug (`forDoug`, printed in Studio as "To confirm before Publish: ...")

- "The post names no artist for Circle of Life. Who should be credited for the artwork? HUB's project map names Drew and Elinor Atkins of Spring Salmon Studio, and the post can name them once you confirm.": the post as written (no artist named); lib/map-projects.ts:736, the map's excerpt ("Circle of Life by Drew and Elinor Atkins of Spring Salmon Studio"). The names stay out of the post until Doug confirms them.

## First paragraph

- "A grandstand and a tall light standard rise behind the plaza at the Langley Events Centre in Langley, British Columbia, and on the plaza lies a wide circle of colour": the photograph (public/images/map/langley-events-centre.jpg); the place from lib/map-projects.ts:724–726, :736 ("on the plaza at the Langley Events Centre") and the comment's "on the plaza by the stadium" (:722).
- "It is Circle of Life, a piece of public art made in StreetBond": lib/map-projects.ts:724 (title), :729 (product StreetBond), :730 (application Public Art), :721 (Square One's page: "Circle of Life" in StreetBond).
- "the HUB Surface Systems coating that puts colour on asphalt and concrete": book p.25 (lib/idea-book-print.ts:105, title "The colour."; :110, Surfaces "Asphalt and concrete"); lib/products.ts:161 ("StreetBond is the colour: a ... pavement coating for asphalt and concrete").

## Forms on a sand-coloured ground

- The sand-coloured ground, the long orange form, the blue shapes at the top, the deep blue crescent along the lower edge, the green leaf shapes on one side and the teal forms on the other, the crisp edges, the covered pavilion and the flagpole, the white pickup trucks at the far edge: the photograph, read in full.

## Large fields of colour

- "heads its public art spread, on page 66, "Public art, at the scale of the street."": book p.66 (lib/idea-book-print.ts:314, title). The book's full name: lib/catalogue.ts:77. The spread is the application's page, not a page about this job.
- "Its note for StreetBond reads "large-scale colour fields"": the spread's SPECIFY note (:319), word for word. "gives artwork and graphics to DecoMark and large interconnected sheets to TrafficPatterns": the same list (:318, "Artwork / graphics"; :320, "Large-scale interconnected thermoplastic").
- "flexes with the pavement, and the book counts that flexibility as what spares it the cracking and early wear of rigid coatings": book p.25 (:107, "Designed to move with the pavement, avoiding the three failures of rigid coatings: cracking, premature wear, and being slippery in wet conditions"); lib/products.ts:166 (Flexibility, "Moves with the pavement: no cracking, no peeling").
- "Its service life, as the book has it, is 8+ years": book p.25 (:112, printed "Life cycle"; "service life" per docs/GLOSSARY.md).
- "an installed piece lasts as long as the system it is made from": lib/applications.ts:283 (the public art page, /applications/public-art: "the installed piece has the service life of the system it is made from").

## The close

- "the 63 standard StreetBond colours on pages 26 and 27 of the book, and the book offers custom Pantone matching for anything outside them": lib/idea-book-edition.ts:207–212 (the colours leaf, pages 26 and 27: "Sixty-three colours", "The complete StreetBond colour range. Custom Pantone matching available."); book p.25 (:111, "63 standard + custom colours").

## Links (each checked)

/products/streetbond (lib/products.ts:136), /products/decomark (:218), /products/traffic-patterns (:113), /product-book/66 and /product-book/26 (app/product-book/[page]/page.tsx), /applications/public-art (lib/applications.ts:277). Each once; no paragraph links one page twice. No published post is linked: none is about this piece. No outside links.

## Against the other map posts

Checked against the other drafts in content/drafts on 27 Oct 2026 with a script comparing six-word runs: none shared outside names and fixed terms. Two other posts open "In the photograph", so this one opens on the grandstand behind the plaza.

## Photo

public/images/map/langley-events-centre.jpg (1184x864), the map entry's own photo (lib/map-projects.ts:732), uploaded on the real run. It is under the 1600px the map asks for; it is the only photograph of the job in the records. Alt: "Circle of Life in StreetBond, blue, orange, green and teal forms on a sand-coloured circle, on the plaza at the Langley Events Centre, Langley, British Columbia". Hotspot x 0.5 y 0.6 w 0.95 h 0.45, on the circle, which spans the frame's width in its lower half.

## Length

About 320 words. The record gives the piece's name, the place and the system; the artists and the installer are not yet supported by a record, so the piece is short.
