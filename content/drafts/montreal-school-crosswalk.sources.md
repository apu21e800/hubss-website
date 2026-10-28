# Sources: Squares of colour at a Montréal school crosswalk

/blog/montreal-school-crosswalk · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/montreal-school-crosswalk.md` · 28 Oct 2026

Map job 35, `montreal-school-crosswalk`. The slug is the one the map is pointed at. Each statement, then the line it rests on. Line numbers are lib/ and docs/ on branch feat/map-posts as read on 28 Oct 2026. The book's pages were read on the renders in public/catalogue/2026-27/ (p127, p011, p025).

## What the record holds

- lib/map-projects.ts:1650–1652 (comment): "Product Book p.127: 'School crosswalks should be seen... TrafficPatterns and StreetBond... Montréal, Québec | TrafficPatterns'. The school is not identified (a street sign reads Glen, which may put it in Rosemère): approximate."
- lib/map-projects.ts:1653–1668: title "School crosswalk" (:1654), Montréal, QC (:1655–1656), product TrafficPatterns (:1659), systems ["StreetBond"] (:1660), application Traffic Calming (:1661), `approximate: true` (:1662), photo cdn("3e56133bab2d5fc879e93432fa32f61f2060aabf-768x1024.jpg"), the applications/public-spaces gallery copy of the p.127 photograph (:1664), ideaBookPage 127 (:1666), excerpt "A playful school crosswalk in TrafficPatterns and StreetBond, coloured to be seen." (:1668).
- lib/idea-book-edition.ts:439, the printed page 127: eyebrow "Traffic calming"; headline "School crosswalks should be seen."; body "Using colour to enhance visibility and create awareness in the community brings a playful, vibrant community crosswalk together. Using a combination of TrafficPatterns and StreetBond to achieve a long-lasting surface."; caption "Montréal, Québec | TrafficPatterns".
- The photograph (the cover, 768x1024, read): crosswalks of small coloured squares on all four sides of an intersection, edged in black and white; wet asphalt; a sidewalk corner in the foreground in large coloured triangles; houses, an autumn maple, a parked van, a pickup with a camper. The blue street sign at the left edge is too small to read.

## What I left out, and why

- The school, the street and the borough: not identified (`approximate: true`). The map's comment says the street sign may put the job in Rosemère; the sign is illegible in the photograph (enlarged on 28 Oct 2026), and the book, which wins, captions it Montréal, Québec. The piece says "as HUB Surface Systems' Product Portfolio Book · Volume 5 captions it" and says nothing of Rosemère: flagged in the report.
- Which surface is TrafficPatterns and which is StreetBond: the book names the two together and the caption names TrafficPatterns; no record assigns them, so the piece says so and does not guess.
- The book's words "enhance", "vibrant" and "long-lasting" (p.127): on the lint's filler list (lib/style-lint.ts:215–217), so the piece quotes the rest of the page and paraphrases "enhance visibility" as "there for visibility".
- "playful" (the book and the map): left out; the piece names the colours instead.
- The traffic calming spread's lines (p.54): the DuraTherm Toronto, North Cowichan and e-blast drafts quote them, so this piece uses the site's pedestrian safety and crosswalks pages instead.
- A yellow paw print on the sidewalk in the photograph: no record says what it is or who put it there, so it is not mentioned.
- Install year, installer, client, size: no record gives one.
- Page 126, which faces page 127 (Nanaimo's Pride intersection): another job.

## Excerpt

- "A Montréal intersection wrapped in squares of colour, from the book's page on school crosswalks.": the photograph (crosswalks of coloured squares on all four sides); p.127's headline, "School crosswalks should be seen." (lib/idea-book-edition.ts:439); its caption, Montréal, Québec.

## First paragraph

- "At an intersection in Montréal, Québec, as HUB Surface Systems' Product Portfolio Book · Volume 5 captions it": p.127 caption (lib/idea-book-edition.ts:439); lib/map-projects.ts:1655, :1666. The book's full name at first mention: lib/catalogue.ts:77.
- "every crosswalk is a band of small coloured squares": the photograph.
- "The caption names TrafficPatterns": p.127 caption; lib/map-projects.ts:1659.
- "the page's text pairs it with StreetBond, 'a combination of TrafficPatterns and StreetBond.'": p.127 body ("Using a combination of TrafficPatterns and StreetBond"); lib/map-projects.ts:1660.
- "The page's headline is one plain sentence: 'School crosswalks should be seen.'": p.127 headline, word for word. "school crosswalk" in the title rests on it and on the map's title (lib/map-projects.ts:1654).

## Colour on all four sides

- "The bands run around all four sides of the intersection, in squares of purple, blue, green, yellow, orange and red, edged in black and white. The asphalt is wet and shining. In the foreground the sidewalk corner is coloured too, in large triangles of purple, pink, blue and green.": the photograph. No part is credited to either system.

## Two systems at one intersection

- "TrafficPatterns arrives as 125 mil preformed thermoplastic, cut in the factory to the design, and on site it is heated and bonds to the asphalt or concrete beneath": lib/products.ts:119 ("factory-made to your design at 125 mil and heat-applied to asphalt or concrete, where it bonds to the surface"), live in Sanity (product-traffic-patterns, read 28 Oct 2026); p.11 (lib/idea-book-print.ts:70); docs/GLOSSARY.md:27–29 ("made in a factory, cut to shape, laid on the pavement and heated until they bond to it").
- "Because its anti-skid aggregate is mixed all the way through the sheet, wear exposes more of it, and the grip keeps pace with the colour": p.11 (lib/idea-book-print.ts:68, "Anti-skid aggregate is intermixed through the full cross-section, so the grip lasts as long as the colour."); docs/GLOSSARY.md:33 (PPG: "as material wears, new anti-skid elements are exposed").
- "Its own page in the book, page 11, sets the numbers: back in use within hours, 60 BPN (ASTM E303) for skid resistance, and 8+ years of service life": p.11 (lib/idea-book-print.ts:71–73; "Open to traffic: Hours").
- "StreetBond's page in the book is headed 'The colour.'": p.25 (lib/idea-book-print.ts:105).
- "It is a pavement coating for asphalt or concrete, with a service life of 8+ years.": p.25 (lib/idea-book-print.ts:110, :112; "Life cycle" printed, "service life" per docs/GLOSSARY.md:42 and lib/product-catalogue.ts:79); docs/GLOSSARY.md:37.
- "The book pairs the two here without saying which surface carries which.": p.127 (see "What I left out").

## Seen at driving speed

- "The page sits in the book under 'Traffic calming'": p.127 eyebrow (lib/idea-book-edition.ts:439).
- "its text says the colour is there for visibility and to 'create awareness in the community.'": p.127 body ("Using colour to enhance visibility and create awareness in the community").
- "HUB's pedestrian safety page sets the test a school zone treatment has to pass: it 'has to read at driving speed.'": lib/applications.ts:228 ("a school zone treatment has to read at driving speed"), live in Sanity (application-pedestrian-safety, read 28 Oct 2026); that page names TrafficPatterns for school zones and lists it among its systems (:230).
- "The crosswalks page names the two jobs any crosswalk has: it tells the driver someone may cross, and it keeps its grip underfoot.": lib/applications.ts:52 ("A crosswalk has two jobs: it tells a driver that someone may be crossing, and it keeps its grip under the people who do."), live in Sanity (application-crosswalks, read 28 Oct 2026).
- "The photograph and its headline are on page 127 of the book.": lib/map-projects.ts:1666. No Lunch & Learn close: the piece ends on the book's page.

## Links (each checked)

/products/traffic-patterns and /products/streetbond (first mentions), /product-book/11, /applications/pedestrian-safety, /applications/crosswalks, /product-book/127. No published post is about this job or a school crosswalk in these two systems, so none is linked. No outside link.

## Photo

image-3e56133bab2d5fc879e93432fa32f61f2060aabf-768x1024-jpg, the map entry's photo (lib/map-projects.ts:1664), already in Studio (the dry run found it at 768x1024: portrait, and the only copy the map has). Alt: what the photo shows, with both systems and the city as p.127 gives them. Hotspot x 0.5 y 0.66 w 1 h 0.5, on the band of crosswalks, so a landscape crop keeps them.

## Checked against the other map posts

Compared sentence by sentence with every draft in content/drafts on 28 Oct 2026: no shared sentence. The opening was rewritten after the first check (it opened with the book's headline in quotes, as seven other drafts do, and was built like the Whitehorse draft's), and so were the TrafficPatterns sentences, which ran close to the Kitchener and e-blast drafts.

## Length

About 320 words in the dry run's count (headings included). The record is the book's headline, two sentences, a caption and a photograph, so the piece stops at the two systems' facts and the site's pages on school zones and crosswalks.
