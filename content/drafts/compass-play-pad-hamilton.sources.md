# Sources: A compass in StreetBond blue on a Hamilton play pad

/blog/compass-play-pad-hamilton · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/compass-play-pad-hamilton.md` · 28 Oct 2026

The write-up for the homepage map's pin `hamilton-play-pad` (job 22 of the 40 without one). Each statement about HUB, a system, the place or the photograph, then the line it rests on. Line numbers are on feat/map-posts at fede3fd. The printed pages were read from their renders (public/catalogue/2026-27/p058, p059 and p025, 1400 px), and the photo was downloaded from Sanity's CDN and looked at.

## What the record holds

- lib/map-projects.ts:1145–1146, the comment: "Product Book p.59: "Hamilton, Ontario", on the Play Surfaces spread (StreetBond, DecoMark, StreetBondSR). The park is not identified: pin at city hall."
- :1147–1162, the entry: title "Compass play pad", Hamilton, ON, product StreetBond, application Playgrounds, approximate: true (:1155), one photo, cdn 149b5152…-2016x1512 (:1157, "applications/playgrounds (Product Book p.59)"), ideaBookPage 59 (:1159), excerpt "A compass laid out in StreetBond blue on a concrete play pad beside an outdoor pool in Hamilton." (:1161). Approximate, so the post names the city and nothing smaller.
- The book: pp.58–59, the Play surfaces spread, Application 07. lib/idea-book-edition.ts:248 names this job's mapId ("hamilton-play-pad") with the alt "A blue StreetBond compass play pad in Hamilton, Ontario"; the photograph is p.59 (applicationLeaf, :524), and the p.59 render is the same frame as the CDN photo. The words are p.58, lib/idea-book-print.ts:266–277: headline "Vibrant, slip-resistant, built for FUN.", statement "Make concrete and asphalt your canvas." (:268), body (:269), SPECIFY StreetBond "any colour, UV stable", DecoMark "custom graphics and play markings", StreetBondSR "cooler underfoot in full sun" (:271–273; printed lower-case on the page, which the post follows; the file sets them in sentence case), caption "Hamilton, Ontario" (:275).

## Opening

- "On the play surfaces spread of the Product Portfolio Book · Volume 5, one line sits under the headline: "Make concrete and asphalt your canvas."": p.58 render; lib/idea-book-print.ts:268. First mention of the book, in full.
- "Opposite it is the photograph of a concrete play pad in Hamilton, Ontario, with a compass laid out across it in StreetBond blue.": lib/idea-book-edition.ts:248 (the p.59 photograph is this job); map :1161.
- "The caption gives the city and not the park.": p.59's caption "Hamilton, Ontario" (render; print :275); map comment :1146.

## A compass across the whole pad

- "In the book's photograph the compass runs edge to edge. A pale circle sits at the centre, split by a grey band and ringed in grey, and grey bands run out from the ring to the borders of the pad, so the blue reads as panels set between the lines.": the photograph, by eye (p.59 render and cdn 149b5152…).
- "Temporary fence panels stand around the pad, and through the fence on the right is the water of the outdoor pool.": the photograph, by eye; the pool is in the record (map :1161).
- "The spread lists DecoMark for "custom graphics and play markings"": lib/idea-book-print.ts:272; p.58 render.
- "the site's playground page counts compass roses among the games DecoMark makes, factory-cut in preformed thermoplastic and heat-applied to the surface": lib/applications.ts:118 ("DecoMark brings the games and the graphics: hopscotch, number grids, compass roses, four-square courts and school crests, factory-cut in preformed thermoplastic and heat-applied to the surface"); the same in Studio (public API, read 28 Oct 2026).
- "In Hamilton the compass is laid out in the coating itself.": map :1161 ("A compass laid out in StreetBond blue").

## StreetBond on a concrete pad

- "StreetBond is a water-based, epoxy-modified acrylic pavement coating.": lib/idea-book-print.ts:109; docs/GLOSSARY.md (pavement coating).
- "It goes on asphalt and concrete.": lib/idea-book-print.ts:110 (p.25, Surfaces "Asphalt and concrete"). p.25's uses strip (:114) is no longer cited: nine of the map posts from Ontario east cited a system's uses strip, and two keep it (the Toronto fleet lot and Mont-Mégantic).
- "On the play surfaces spread it is the first system specified, with the note "any colour, UV stable"": lib/idea-book-print.ts:271; p.58 render.
- "On the playground page, that colour goes down with a slip-resistant texture.": lib/applications.ts:118 ("StreetBond pavement coating puts vivid, UV-stable colour on an asphalt or concrete play surface with a slip-resistant texture").
- "HUB Surface Systems' book gives StreetBond a service life of 8+ years.": lib/idea-book-print.ts:112 (labelled "Life cycle" on the page); lib/products.ts:167 ("Service life"). First mention of HUB, in full.
- "When the colour wears, the site's playground page says, a play surface is recoated over a summer break rather than rebuilt.": lib/applications.ts:118, the playgrounds page (/applications/playgrounds): "A worn surface is recoated over a summer break, not rebuilt." The line is the site's page, not the book's, so it is attributed to the page by name.

## Links (each checked)

/product-book/58, /products/streetbond, /products/decomark and /applications/playgrounds, each once. No published post is linked: playgrounds-recreation, the one published playground post, carries outside statistics (a Boston schoolyard study) that the brief rules out.

## Photo

image-149b51528ec8f529600246cae5f6c13683231cf6-2016x1512-jpg, already in Studio (the map entry's only photo; the dry run found it, 2016x1512). Hotspot x 0.53 y 0.52 w 0.94 h 0.72, on the compass, which fills most of the frame. The alt names StreetBond and Hamilton, which the records prove.

## Left out

- The park, a street, an install year, installer, client or designer: no record names them ("The park is not identified").
- The spread's headline and body ("Vibrant, slip-resistant, built for FUN."; "vibrant colour options and non-slip surfaces"): "vibrant" and "non-slip" are words the house style rules out.
- StreetBondSR's note: the record for this job names StreetBond only, and three splash pad drafts already make the cooler-surface point.
- What the grey bands and the pale circle are (another coating or the concrete itself): no record says, so only the blue is named as StreetBond.
- Two small red posts on the pad: what they are is not plain from the photograph.
- The closing Lunch & Learn: about twenty of the drafts end on one, three of them StreetBond, so this one ends on the system.
- Length: about 263 words by the script's count, under the brief's 300. The record is a city, a design, a photograph and the spread.
