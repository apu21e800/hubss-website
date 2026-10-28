# Sources: StreetBond dots and colour bands at Coquitlam's Sheffield Park

/blog/sheffield-park-coquitlam · new draft, map job 11 (`coquitlam-sheffield-park`), loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/sheffield-park-coquitlam.md` · 27 Oct 2026

Vern, 27 Oct 2026: "if it's on the map it should have it's own landing page (blog), if it's missing a landing page, create one." The map card links to /blog/sheffield-park-coquitlam once this is published. Each statement about HUB, a system, a number, a place or the book, then the line it rests on. Line numbers are on feat/map-posts at fede3fd. "Book p.N" is the printed Product Portfolio Book · Volume 5: the renders public/catalogue/2026-27/pNNN-1400.webp of pages 25, 82 and 83 were opened and read; the words are in lib/idea-book-print.ts (system pages) and lib/idea-book-edition.ts (the rest).

## What the record holds

- lib/map-projects.ts:677–694. Comment: "Product Book pp.82–83: "Sheffield Park · Coquitlam, British Columbia". 3510 Sheffield Ave." Entry: title "Sheffield Park", city Coquitlam, province BC, product StreetBond, application Parks & Paths, no year, not approximate, image local("coquitlam-sheffield-park") (public/images/map/coquitlam-sheffield-park.jpg, "Product Book p.83"), ideaBookPage 83, excerpt "StreetBond polka dots and colour waves curving around the spray pad at Sheffield Park on Burke Mountain."
- lib/idea-book-edition.ts:278–282: the statement leaf `coast-to-coast`, pages 82 and 83, eyebrow "Across Canada", title "Coast to coast. Setting design standards.", photo p.83 with alt "Sheffield Park's skate plaza and StreetBond paths from above, Coquitlam, British Columbia", caption place "Sheffield Park, Coquitlam, British Columbia", mapId "coquitlam-sheffield-park". The leaf names this job's mapId and its photo is the job, so pages 82–83 are tied to it.
- The printed pages: p.82 carries the eyebrow and the headline over a photograph of the park at a low angle, with no caption; p.83 is the park from directly above, captioned "Sheffield Park · Coquitlam, British Columbia". The printed caption names no system.

## Left out, and why

- Spray pad or skate plaza: the map's excerpt calls the concrete area a spray pad, the edition's alt calls it a skate plaza. Two records disagree, so the piece calls it "a curving concrete area" and names neither.
- Burke Mountain: only in the map's excerpt, with no source given. Left out.
- 3510 Sheffield Ave (the map's comment): a street address. Never printed.
- No year, client, designer, installer, quantity or cost: no record gives one.
- The printed caption on p.83 names the park and the city but no system. StreetBond rests on the map entry (product StreetBond, excerpt "StreetBond polka dots and colour waves") and the edition's alt ("StreetBond paths"), which agree; nothing disagrees. Put to Doug to confirm in the note he reads in Studio (below).
- New or existing asphalt: no record says. The last line reports what the parks and paths page says about existing asphalt paths in general, not about these paths.

## Note for Doug (`forDoug`, printed in Studio as "To confirm before Publish: ...")

- "The book's caption for Sheffield Park on page 83 names no system. The post says StreetBond, which comes from HUB's project map. Please confirm the paths are StreetBond.": printed p.83 (caption "Sheffield Park · Coquitlam, British Columbia", no system); lib/map-projects.ts:686 (product StreetBond).

## First paragraph

- "On the spread of the Product Portfolio Book · Volume 5 marked "Across Canada", the only job shown is Sheffield Park in Coquitlam, British Columbia": lib/idea-book-edition.ts:279–281 (eyebrow; one caption on the leaf); printed p.82 (eyebrow) and p.83 (caption). The book's full name: lib/catalogue.ts:77.
- "The headline over it reads "Coast to coast. Setting design standards."": lib/idea-book-edition.ts:280; printed p.82.
- "The park's paths carry StreetBond pavement coating from HUB Surface Systems": lib/map-projects.ts:686 (product) and :693 (excerpt); lib/idea-book-edition.ts:281 (alt "StreetBond paths"). "Pavement coating": docs/GLOSSARY.md.
- "white dots on a dark path, and curving bands of orange, grey, yellow and white on another": the photographs (p.82, p.83 and the cover); the map's excerpt calls them "polka dots and colour waves".

## The park from the air

- "two photographs of the park, both taken from above": printed pp.82 and 83, the leaf's two photographs.
- Page 83, its caption, the dotted path wrapping the concrete area, the dots "in mixed sizes, in rows that bend with the path", the curved concrete band through them, the lawn and the street with parked cars: printed p.83, read from the render (and from the 2000px render, cropped).
- Page 82, "a lower and wider view", the planted bed with pale boulders, the banded path from the left, the houses and conifers on the slope: printed p.82, read from the render. The cover is close to that view, with more of the frame.

## Dots and bands in the coating

- "a water-based acrylic, modified with epoxy, that goes on asphalt or concrete": book p.25 (lib/idea-book-print.ts:109, Type "Water-based, epoxy-modified acrylic"; :110, Surfaces "Asphalt and concrete").
- "every dot and every band is that coating, laid on the path's own surface": the records above name StreetBond for the dots and the bands; StreetBond is a coating (book p.25).
- "parks are the first use the book lists for it": book p.25 (lib/idea-book-print.ts:114: "Parks", "Playgrounds", "Courts", "Area markings").
- "8+ years of service life", "easily refreshed": book p.25 (lib/idea-book-print.ts:112, printed "Life cycle: 8+ years / easily refreshed"; "service life" is the glossary's one term, docs/GLOSSARY.md). "worn colour on a path is put right with a new coat": lib/products.ts:161 ("a worn surface is recoated").
- "A well-kept, colourful path invites people into a park.": lib/applications.ts:105 (the parks and paths page, /applications/parks-paths), word for word; it is the page's first sentence.
- "colour on an existing asphalt path lets the route double as wayfinding, or become a destination in itself": the same line ("StreetBond pavement coating puts UV-stable colour on existing asphalt paths and plazas, so a route can double as wayfinding or become a destination in itself").

## Links (each checked)

/products/streetbond (lib/products.ts:136), /product-book/83 (app/product-book/[page]/page.tsx serves every page after the first), /applications/parks-paths (lib/applications.ts:96). Each once; no paragraph links one page twice. No published post is linked: none is about this park. No outside links.

## Against the other map posts

Opening, headings and close checked against the other drafts in content/drafts on 27 Oct 2026, with a script that compares runs of six words: no shared run outside names and fixed terms. Several of the forty open on a quoted headline, so this one leads with the spread and gives the headline second.

## Photo

public/images/map/coquitlam-sheffield-park.jpg (1600x994), the map entry's own photo (lib/map-projects.ts:689), uploaded on the real run. It is the park from the air at a low angle, close to the view on p.82, with more of the frame: the dotted path on the right, the banded path on the left, the planted bed between, houses and conifers behind. Alt: "White dots and curving bands of colour in StreetBond on the paths of Sheffield Park, Coquitlam, British Columbia, from the air" (the system and the place as the records above give them). Hotspot x 0.6 y 0.62 w 0.8 h 0.7, on the dotted path and the concrete it wraps, with the banded path inside the frame.

## Length

About 310 words. The record is thin (a place, a system and two photographs), so the piece stops there.
