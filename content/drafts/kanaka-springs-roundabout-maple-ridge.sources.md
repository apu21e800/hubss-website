# Sources: A StreetPrint herringbone apron at Kanaka Springs in Maple Ridge

/blog/kanaka-springs-roundabout-maple-ridge · new draft, map job 15 (`maple-ridge-kanaka-springs`), loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/kanaka-springs-roundabout-maple-ridge.md` · 27 Oct 2026

Vern, 27 Oct 2026: "if it's on the map it should have it's own landing page (blog), if it's missing a landing page, create one." Each statement about HUB, a system, a number, a place or the book, then the line it rests on. Line numbers are on feat/map-posts at fede3fd. "Book p.N" is the printed Product Portfolio Book · Volume 5: the renders of pages 19, 54 and 132 (public/catalogue/2026-27/pNNN-1400.webp) were opened and read; the words are in lib/idea-book-print.ts and lib/idea-book-edition.ts.

## What the record holds

- lib/map-projects.ts:827–845. Comment: "Product Book p.132: "Maple Ridge, British Columbia". The Kanaka Springs community sign is behind the roundabout, on 112 Ave at Bosonworth Ave. The traffic calming page shows the same photo as a stamped apron." Entry: title "Kanaka Springs roundabout", city Maple Ridge, province BC, product StreetPrint, application Traffic Calming, no year, not approximate, image cdn("0b5c599579465f38fde5f75adbbc74fd343af683-2400x1800.jpg") (the traffic calming gallery's traffic-calming-58, "Product Book p.132"), ideaBookPage 132, excerpt "A red herringbone StreetPrint apron on the roundabout at Kanaka Springs in Maple Ridge."
- lib/idea-book-edition.ts:454–458: p.132, a full-page photograph, caption place "Maple Ridge, British Columbia", system "StreetPrint", mapId "maple-ridge-kanaka-springs". The record names this job's mapId and its photograph is the job, so p.132 is tied to it.
- The printed p.132 is the photograph across the whole page with one caption line, "Maple Ridge, British Columbia", and no headline. It prints no system: StreetPrint rests on the edition's record (:456), the map entry (:837, :844) and the traffic calming gallery's line for the same photo (lib/image-facts.ts:493, "StreetPrint"), which agree. The photograph shows a stamped red herringbone, as StreetPrint is.
- The site name: the map's title and excerpt, and the sign in the photograph, which reads "Kanaka Springs" (read at 5x).

## Left out, and why

- 112 Ave at Bosonworth Ave (the comment): one place, from research on the sign; not needed to name the roundabout. Left out.
- New or existing asphalt: no record says which, so the piece does not say how this apron's asphalt was prepared.
- No year, client, designer, installer, quantity or cost: no record gives one.
- The traffic calming spread (book pp.54–55) is not quoted or linked: its photograph is another map job, the North Cowichan roundabout apron, whose post has the spread as its book page and covers it in full. This piece takes its application line from HUB's traffic calming page instead, and quotes a different sentence of it from the one the Cowichan post uses.
- No Lunch & Learn close: the Cowichan post, the nearest sibling (also a StreetPrint roundabout apron in British Columbia), ends with a StreetPrint Lunch & Learn, so this one ends on the system's facts.

## First paragraph

- "Page 132 of the Product Portfolio Book · Volume 5 carries no headline. A photograph fills it, and the only words on the page are its caption, "Maple Ridge, British Columbia"": printed p.132, read from the render; lib/idea-book-edition.ts:456 (fullBleed). The book's full name, lib/catalogue.ts:77.
- "The photograph is the roundabout at Kanaka Springs, and the red herringbone that rings its central island is StreetPrint stamped asphalt from HUB Surface Systems": lib/map-projects.ts:832–834, :837, :844; lib/idea-book-edition.ts:456; the photograph. Link text "StreetPrint stamped asphalt" per docs/GLOSSARY.md (stamped asphalt, the link).

## Herringbone round the island

- "The ring is the roundabout's apron, the part a long truck's rear wheels track over while cars keep to the lane": what a roundabout apron is, in general terms (no figure, nothing about HUB); the map's excerpt calls the ring an apron (:844), and the book's traffic calming spread lists "truck aprons" among its devices (lib/idea-book-print.ts:246).
- "Its herringbone runs as one straight grid from side to side, cut off by a concrete curb on the outside and by the island's curb on the inside, where a chevron sign points traffic around": the photograph, with crops of the ring's left and right sides, where the rows run the same way.
- "The Kanaka Springs sign stands behind the roundabout, and in the picture cones are still out at the splitter islands, with construction fencing along the far side": the photograph; the comment (:828–829) places the sign behind the roundabout.
- "stamps a pattern into the asphalt of the calming device itself, so the texture is in the road rather than on it.": lib/applications.ts:243 (the traffic calming page, /applications/traffic-calming), word for word up to "on it"; the full stop is the piece's.

## A stamped pattern under a StreetBond coat

- ""Stamping + StreetBond coating"": book p.19, StreetPrint's System spec (lib/idea-book-print.ts:96), word for word.
- "The pattern is stamped into the asphalt with a template": book p.19 (:94, "Patterns are stamped into existing asphalt"); pp.22–23, "Stamping templates" (lib/idea-book-edition.ts:196–205).
- "herringbone is one of the book's standard field templates, along with diagonal herringbone, offset brick and British cobble; custom templates are made on request": lib/idea-book-edition.ts:200 ("Field templates": "Herringbone", "Diagonal Herringbone", "Offset Brick", "British Cobble" among them) and :202 ("Custom templates available on request"); book p.19 (:97, Patterns "Standard and custom options").
- "The colour is a coat of StreetBond laid over the stamped surface": book pp.20–21 (lib/idea-book-edition.ts:190, "StreetBond creates the colour, and seals the asphalt"); p.19 (:94, "then coloured with StreetBond coatings").
- "The book gives StreetPrint 10–20 years of service life and the StreetBond coat 8+ years": book p.19 (lib/idea-book-print.ts:98) and p.25 (:112, printed "Life cycle"; "service life" per docs/GLOSSARY.md).
- "the coating "runs its own cycle", and when the colour needs freshening, the surface gets a new coat": /blog/how-stamped-asphalt-is-installed (published; read in full from Sanity's public API on 27 Oct 2026): "The StreetBond coating runs its own cycle. When colour eventually needs freshening, the surface is recoated". The guide's service life line (10 to 20 years) matches the book.

## Links (each checked)

/product-book/132 (app/product-book/[page]/page.tsx), /products/streetprint (lib/products.ts:186), /applications/traffic-calming (lib/applications.ts:234), /blog/how-stamped-asphalt-is-installed (in posts-index-published.json; the same subject as the section that links it). Each once; no paragraph links one page twice. traffic-calming-surface-design is not linked: it gives outside speed figures and "BPN 65+", which the book does not. No outside links.

## Against the other map posts

Checked against the other drafts in content/drafts on 27 Oct 2026 with a script comparing six-word runs: none shared outside names and fixed terms. The Cowichan post opens on what an apron must do; this one opens on its book page, which has no headline.

## Photo

image-0b5c599579465f38fde5f75adbbc74fd343af683-2400x1800-jpg, already in Studio (the map entry's own photo, lib/map-projects.ts:840; the traffic calming gallery's traffic-calming-58, the photograph on p.132). The dry run found it (2400x1800). Alt: "A red herringbone StreetPrint apron around the central island of the Kanaka Springs roundabout, Maple Ridge, British Columbia". The apron fills the lower half of the frame under a wide sky, so the hotspot is x 0.5 y 0.74 w 0.96 h 0.4.

## Length

About 300 words. The record is the place, the system, the application and one full-page photograph; the piece stops there.
