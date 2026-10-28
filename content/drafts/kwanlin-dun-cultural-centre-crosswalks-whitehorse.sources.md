# Sources: Whitehorse crosswalks at the Kwanlin Dün Cultural Centre

/blog/kwanlin-dun-cultural-centre-crosswalks-whitehorse · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/kwanlin-dun-cultural-centre-crosswalks-whitehorse.md` · 28 Oct 2026

Map job 1 of the 40 pins with no write-up (BRIEF.md, 27 Oct 2026; Vern: "if it's on the map it should have it's own landing page (blog)"). The slug is the one the map is pointed at. Each statement about HUB, the system, a number, the place or the book, then the line it rests on. Files and line numbers are on feat/map-posts at fede3fd. Book pages are the printed Product Portfolio Book · Volume 5: the render public/catalogue/2026-27/p113-1400.webp was read, and its words checked against lib/idea-book-edition.ts. A thin record, so a short piece: about 286 words by the script's count; it stops where the facts stop.

Checked against the other drafts in content/drafts on 28 Oct 2026 (the 35 other map posts and the e-blast posts): no sentence or heading in common. The opening leads with the two crosswalks and gives the book's headline second.

## What the record holds

- lib/map-projects.ts:79–97, id whitehorse-kwanlin-dun. Comment (:80–82): "Product Book p.113: "Acknowledgement, cast in pavement. Whitehorse, Yukon | TrafficPatterns". The Cultural Centre is in the photo; CBC places the crosswalks at Front and Black Streets." Title "Kwanlin Dün Cultural Centre crosswalks" (:84), Whitehorse, YT (:85–86), product TrafficPatterns (:89), application Community Branding (:90), not approximate, no year, no other systems, one photo (:92, cdn f07ab2a9…-1184x864.jpg, applications/public-art/public-art-04, book p.113), ideaBookPage 113 (:94), excerpt (:95–96): "Truth and reconciliation crosswalks in TrafficPatterns in front of the Kwanlin Dün Cultural Centre on the Whitehorse waterfront."
- The book, p.113 (lib/idea-book-edition.ts:391, mapId whitehorse-kwanlin-dun; its photo is this job's photo, the same frame as the map's cdn file): eyebrow "First Nations land acknowledgement", headline "Acknowledgement, cast in pavement.", caption "Whitehorse, Yukon | TrafficPatterns". No body text.
- The system: book p.11 (lib/idea-book-print.ts:65–77); lib/products.ts:111–133. The application: book p.68 (lib/idea-book-print.ts:325–336); lib/applications.ts:122–133.

## Excerpt

- "Two TrafficPatterns crosswalks in front of the Kwanlin Dün Cultural Centre in Whitehorse, Yukon, the nearer one carrying two white feathers": the caption's system and place (lib/idea-book-edition.ts:391); the map's excerpt, "in front of the Kwanlin Dün Cultural Centre" (lib/map-projects.ts:95–96); the two crosswalks and the feathers on the nearer one are the photograph (see "Two crosswalks outside the centre").

## First paragraph

- "Two TrafficPatterns crosswalks carry a First Nations land acknowledgement": p.113's eyebrow, "First Nations land acknowledgement", and its headline, "Acknowledgement, cast in pavement." (lib/idea-book-edition.ts:391); caption system (:391); map product (lib/map-projects.ts:89). "Two" and "crosswalks", plural: the photograph and the map's title (:84).
- "outside the Kwanlin Dün Cultural Centre on the Whitehorse waterfront, Yukon": map excerpt, "in front of the Kwanlin Dün Cultural Centre on the Whitehorse waterfront" (:95–96); comment, "The Cultural Centre is in the photo" (:81); the caption's place, "Whitehorse, Yukon" (lib/idea-book-edition.ts:391).
- "HUB Surface Systems prints them on page 113 of the Product Portfolio Book · Volume 5, under 'Acknowledgement, cast in pavement.'": p.113's headline, word for word (lib/idea-book-edition.ts:391; on the render it sits under the photograph); ideaBookPage 113 (lib/map-projects.ts:94). First mention of HUB and of the book, both in full (BRIEF.md; docs/STYLE.md:57–70). The link opens /product-book/113, a prerendered page of the reader (app/product-book/[page]/page.tsx).

## Two crosswalks outside the centre

- All of it is what the photograph plainly shows (the cdn file, and the same frame on the p.113 render): taken at road level; two orange crosswalks across the road; two large white feathers along the nearer one; a line of white lettering on a second crosswalk farther off (too small in the photograph to read, so not quoted); dark, gabled buildings with the name in letters on one wall (partly hidden by trees; "KWANLIN" is legible); a planted island of young trees. The buildings are the centre's on the comment's word (:81) and the excerpt's (:95–96). The cladding is not named: the photograph does not show whether it is wood or metal.

## Heated onto the road in sheets

- "TrafficPatterns is preformed thermoplastic": book p.11 headline, "Preformed thermoplastic." (lib/idea-book-print.ts:66).
- "In the factory the design is made up in sheets 125 mil thick (about 3 mm); on site the sheets are laid on the pavement and heated until they bond to it": lib/products.ts:119 ("factory-made to your design at 125 mil and heat-applied to asphalt or concrete, where it bonds to the surface"); p.11 thickness (lib/idea-book-print.ts:70); docs/GLOSSARY.md:27–29 ("laid on the pavement and heated until they bond to it"; "125 mil, about 3 mm").
- "The pavement itself is not cut or stamped": docs/GLOSSARY.md:29 ("The pavement is not cut or stamped").
- "a crosswalk in TrafficPatterns is open to traffic within hours": p.11 "Open to traffic: Hours" (lib/idea-book-print.ts:72); lib/products.ts:126.
- Not said: that the feathers or the lettering are TrafficPatterns rather than another material. The caption names one system for the job, so the crosswalks are called TrafficPatterns and the parts of the design are not assigned to anything.

## The grip is in the material

- "Grip comes from anti-skid aggregate mixed into the full thickness of the sheet, so it is still there as the surface wears": p.11, "Anti-skid aggregate is intermixed through the full cross-section, so the grip lasts as long as the colour." (lib/idea-book-print.ts:68), in other words; docs/GLOSSARY.md:33 ("so grip stays as the surface wears").
- "The book rates the skid resistance at 60 BPN under ASTM E303 and gives TrafficPatterns a service life of 8+ years": p.11 (:71, :73).

## Another land acknowledgement in the book

- "On page 106 the book shows a second job of the same kind in TrafficPatterns, at the University of British Columbia": p.106, eyebrow "Community branding", headline "Musqueam Nation land acknowledgement, UBC.", caption "UBC, British Columbia | TrafficPatterns" (lib/idea-book-edition.ts:372, mapId ubc-musqueam).
- "the UBC and Musqueam crests are woven together in one crosswalk": ubc-musqueam-crosswalk, "The decorative crosswalk uses the UBC & Musqueam crests woven together, acknowledging that UBC is situated on the ancestral, traditional and unceded territory of the Musqueam peoples."; lib/map-projects.ts:283 ("with the UBC and Musqueam crests woven together").
- "one of those specified on the book's community branding spread, for streetscape work, under the line 'Every neighbourhood has a story.'": p.68 statement (lib/idea-book-print.ts:327) and SPECIFY, TrafficPatterns "Streetscape enhancement and beautification" (:332). The note is paraphrased ("streetscape work") because "enhancement" is on the lint's filler list (lib/style-lint.ts, FILLER).
- The piece ends here, on the community branding spread; no Lunch & Learn and no closing book link (the book page is linked in the first paragraph).

## Links (each checked)

/products/traffic-patterns (first mention of the system), /product-book/113 (first paragraph), /blog/ubc-musqueam-crosswalk (published, Project Profile, in posts-index-published.json; the same subject: a land acknowledgement crosswalk in TrafficPatterns), /applications/community-branding. No outside links. None of the seven guides the brief bars.

## Photo

image-f07ab2a9d2f944b128d54084fa1623b78736a0c6-1184x864-jpg, already in Studio (original file public-art-04.jpg; the dry run found it, 1184x864): the map's own photo of this job (lib/map-projects.ts:92) and the photograph on p.113. Alt: "Two orange TrafficPatterns crosswalks, the nearer with two white feathers, in front of the Kwanlin Dün Cultural Centre in Whitehorse, Yukon": the system from the caption, the place from the caption and the map. Hotspot x 0.6 y 0.62 w 0.8 h 0.72, on the nearer crosswalk with the centre behind it.

## Left out, and why

- "Truth and reconciliation" (the map's excerpt, :95–96): the book files the page under "First Nations land acknowledgement" (:391). The two records describe the purpose differently and the book wins, so the post uses the book's label only.
- Front and Black Streets: in the comment only (:81–82), as what CBC reports; no other record and no source to link (the brief allows no outside links). The post places the crosswalks by the centre, which the photograph shows.
- The words on the far crosswalk and the meaning of the feathers: not legible in the photograph, not in any record.
- Designer, Nation partner, installer, install year, client, quantities: no record gives them.
- The book's "You design it, we build it, our certified installers make it last." (p.11 subhead, :67): true and on the page, but the Kitchener Every Child Matters draft quotes it, so it is not repeated here.
- The book's closing page lists "Whitehorse" among the communities HUB works with (lib/idea-book-edition.ts:492); not tied to this job, so not used.
