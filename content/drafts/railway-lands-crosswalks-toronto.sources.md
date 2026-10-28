# Sources: Downtown Toronto crosswalks still performing after 11 years

/blog/railway-lands-crosswalks-toronto · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/railway-lands-crosswalks-toronto.md` · 28 Oct 2026

A Project post for map job 28 (`toronto-railway-lands`), one of the 40 pins whose card said "More projects" (Vern, 27 Oct 2026). The map points at this slug. Line numbers are on branch feat/map-posts.

## What the record holds

- lib/map-projects.ts:1435–1454. Title "Downtown crosswalks, Railway Lands" (:1440), Toronto, ON (:1441–1442), TrafficPatternsXD (:1445), Crosswalks (:1446), `approximate: true` (:1447), photo `cdn("b5687a89…-1200x778.jpg")`, "products/traffic-patterns-xd/traffic-patterns-xd-133 (Product Book p.91)" (:1449), ideaBookPage 91 (:1451), excerpt "TrafficPatternsXD crosswalks on downtown Toronto streets, still performing 11 years after they went in" (:1452–1453).
- The comment above it (:1436–1438): "The Rogers Centre is ahead in the photo (Railway Lands, likely Bremner Blvd): approximate."
- The printed page, p.91 (lib/idea-book-edition.ts:313, the edition's record with `mapId: "toronto-railway-lands"`; render p091-1400.webp, read): eyebrow "Crosswalks", headline "Toronto's city streets.", body "TrafficPatternsXD crosswalks used where maintenance-free surfaces are needed. With non-stop use in the toughest urban environments, this durable surface continues to perform 11 years later!", caption "Toronto, Ontario | TrafficPatternsXD".

## Left out, and why

- The Railway Lands, Bremner Boulevard and the Rogers Centre. The pin is `approximate`: the site was matched from the photograph (the comment says so, and "likely" for the street), the book names only Toronto, and the brief says to name only the town for such a pin. The record's own excerpt says "downtown Toronto streets", and the photograph plainly shows downtown towers, so the post says downtown Toronto and no more. The slug, which the map is pointed at, keeps "railway-lands".
- An install year: no record gives one, and none is worked back from "11 years later".
- Installer, owner, quantity, colour names, cost: no record gives them.
- The page's closing exclamation mark: the quote stops before it (house style; the words are unchanged).

## First two paragraphs

- "on downtown streets in Toronto, Ontario": the p.91 caption (Toronto, Ontario); "downtown" from the map's title and excerpt (lib/map-projects.ts:1440, :1453) and the towers in the photograph.
- "HUB Surface Systems' TrafficPatternsXD, a preformed thermoplastic with aggregate mixed through it": the caption; p.13 subhead "Aggregate-reinforced, preformed thermoplastic" (lib/idea-book-print.ts:80); lib/products.ts:96 ("running through the full cross-section").
- "prints them under the headline “Toronto's city streets.” and says that “this durable surface continues to perform 11 years later”": p.91, word for word.
- The photograph: a pedestrian in red running shoes mid-stride on a grid of square units in alternating tan and charcoal bands; towers with balconies; people in business clothes on the sidewalk. Nothing else is read into it.

## 11 years of non-stop use

- "“used where maintenance-free surfaces are needed”" and "“non-stop use in the toughest urban environments”": p.91, quoted.
- "The book gives TrafficPatternsXD a service life of 10+ years": p.13 (lib/idea-book-print.ts:86). It now closes the paragraph above it.
- "The book's crosswalks spread states their purpose: “Providing increased visibility and safety for pedestrians.”": p.46, the crosswalks spread's statement (lib/idea-book-print.ts:201; render read), quoted as the book's line for the application, not as a result here. Its photograph is Brampton, so nothing on it is tied to this job.
- Cut on 28 Oct 2026: "Page 91 is a downtown street where it counts 11 and the surface is still performing." (it restated p.91's line, already quoted in the first paragraph) and "Crosswalks come first among the system's uses" (p.13's uses strip; nine map posts cited one). The 11 years stay p.91's printed words, attributed; no install year is worked back from them.
- "The site's crosswalks page sets TrafficPatternsXD beside the other systems a crosswalk can be built in": lib/applications.ts:52 (TrafficPatterns, TrafficPatternsXD, DecoMark, DuraTherm).

## Tan and charcoal squares stamped into the asphalt

- "TrafficPatternsXD panels, 150 mil thick (about 3.8 mm), are heated on the asphalt, and a template pressed through them into the asphalt's top layer forms the joints between the squares": p.13 Thickness (lib/idea-book-print.ts:83); "about 3.8 mm", docs/GLOSSARY.md:36 ("150 mil 3.8 mm"); pp.16–17 Place, Heat, Stamp (lib/idea-book-edition.ts:176–178); docs/GLOSSARY.md:30 ("a wire-rope grid presses a pattern through the material into the top of the asphalt").
- "Page 13, the system's own, is headed “For the toughest environments.”": p.13 title (lib/idea-book-print.ts:79).
- "8–9 on the Mohs scale by the book's figure": p.13 Aggregate (:84).
- "“proven in high traffic with concentrated wheel loads”": p.13 description (:81), quoted.
- "rates its skid resistance at 60 BPN (ASTM E303)": p.13 (:85).

## Links (each checked)

/products/traffic-patterns-xd, /product-book/91, /applications/crosswalks. Each once. No published post is linked: none is about this job, and the guides on Toronto crosswalks are on the brief's do-not-link list (durable-transit-lanes-crossings) or about other jobs. No outside links. The post ends on the system's figures, with no call to action.

## Photo

image-b5687a89f85ef25f85cb9b063d1b1d94efbf7d06-1200x778-jpg, already in Studio (traffic-patterns-xd-133, the p.91 photograph). Alt: "A pedestrian walking across a TrafficPatternsXD crosswalk of tan and charcoal squares in downtown Toronto, Ontario" (the system and town from the p.91 caption; "walking across", because the lint reads "pedestrian crossing" as the marking). 1200 px wide, under 1600: no larger copy is in Studio's map entry. Hotspot x 0.5 y 0.6 w 0.95 h 0.8, on the crosswalk and the stride.
