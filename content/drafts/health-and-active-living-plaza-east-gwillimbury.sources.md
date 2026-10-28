# Sources: A blue and grey crosswalk at East Gwillimbury's new community centre

/blog/health-and-active-living-plaza-east-gwillimbury · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/health-and-active-living-plaza-east-gwillimbury.md` · 28 Oct 2026

A Project post for map job 27 (`east-gwillimbury-halp`), one of the 40 pins whose card said "More projects" (Vern, 27 Oct 2026). The map points at this slug. Line numbers are on branch feat/map-posts.

## What the record holds

- lib/map-projects.ts:1396–1414. Title "Health and Active Living Plaza" (:1401), East Gwillimbury, ON (:1402–1403), TrafficPatternsXD (:1406), Parks & Paths (:1407), photo `cdn("23a48c76…-1800x2400.jpg")`, "applications/parks-paths/parks-paths-146 (Product Book p.125)" (:1409), ideaBookPage 125 (:1411), excerpt "TrafficPatternsXD in a bold colour scheme marks the way into East Gwillimbury's new community centre" (:1412–1413). Not `approximate`.
- The comment above it (:1397–1399) quotes p.125 and adds "The pylon beside the crossing reads Health and Active Living Plaza (160 Jim Mortson Dr)".
- The printed page, p.125 (lib/idea-book-edition.ts:433, the edition's record with `mapId: "east-gwillimbury-halp"`; the render p125-1400.webp, read): eyebrow "Parks & paths", headline "Community centres.", body "Using TrafficPatternsXD in a bold colour scheme highlights the location of the new community centre, using materials that will hold up to the wear and tear of a busy community location.", caption "East Gwillimbury, Ontario | TrafficPatternsXD".

## Left out, and why

- The street address in the map comment: the house rule keeps street addresses off the site, and the post needs only the plaza's name, which the photograph shows.
- Install year, installer, owner, quantity, cost: no record gives them. "New" is the book's word for the community centre, used as the book uses it.
- The colour names: no record says which blue or which grey; the post describes the colours the photograph shows and never names a swatch.
- The people in the photograph: described, never named or identified.

## First two paragraphs

- "In the photograph the Product Portfolio Book · Volume 5 prints on page 125": the map entry's ideaBookPage and photo (:1409, :1411); the edition's p.125 record.
- The photograph (the Studio copy, the same frame as p.125, uncropped at the top): a family crossing a blue and pale grey crosswalk, a small child in a blue toy car with two adults, a pylon behind them reading "HEALTH AND ACTIVE LIVING PLAZA". The page's own crop cuts the pylon at "PLA", so the post says the pylon "names" the plaza; the map comment (:1399) reads it whole.
- "in East Gwillimbury, Ontario": the p.125 caption.
- "HUB Surface Systems' TrafficPatternsXD, a 150 mil preformed thermoplastic": the p.125 caption; p.13 Thickness 150 mil and subhead "Aggregate-reinforced, preformed thermoplastic" (lib/idea-book-print.ts:80, :83).
- "the page's headline is “Community centres.”" and the one-sentence quote: p.125, copied word for word.

## Blue and pale grey bands at the plaza

- "blue and pale grey in a brick pattern", the blue frame, the alternating bands, the pale grey strip along each outer edge against the dark asphalt: the photograph, nothing more. "The bold colour scheme" is p.125's phrase.
- "That contrast is one of the strengths the book's page 13 claims for the system: “High colour contrast for increased safety.”": p.13 description (lib/idea-book-print.ts:81), quoted. Said of the system, not as a measured result here.
- "The system's colours are the thermoplastic range on pages 14 and 15, printed under the line “Formulated for UV stability.”": pp.14–15 (lib/idea-book-edition.ts:168–171; render p014 read: eyebrow "TrafficPatternsXD, TrafficPatterns and DecoMark", subtitle "Formulated for UV stability.").

## A crosswalk on the parks and paths pages

- "The book files the page under Parks & Paths": the p.125 eyebrow. "the site's parks and paths application": the map's application (lib/map-projects.ts:1407) and /applications/parks-paths (lib/applications.ts:94–108). The book prints no Parks & Paths spread (lib/idea-book-print.ts has none), so no book words are quoted for it.
- "a road crosswalk beside the plaza's pylon": the photograph; the map comment's "the pylon beside the crossing".
- "the book's spread on crosswalks lists TrafficPatternsXD first, at “150 mil, aggregate-reinforced”, under the headline “Crosswalks that hold their colour and their grip.”": p.46 (lib/idea-book-print.ts:199–210; render read). The spread's photograph is Brampton (p.47), so nothing on it is tied to this job. The spread's body ("ASTM-rated skid resistance") is not quoted: docs/GLOSSARY.md lists "ASTM-rated" to avoid.

## Wear and tear at a busy location

- The heading echoes p.125's own words, "materials that will hold up to the wear and tear of a busy community location" (lib/idea-book-edition.ts:433).

- "heated in place and stamped with a template that pushes the pattern through the panels and into the asphalt underneath; it goes on asphalt only": docs/GLOSSARY.md:30; lib/products.ts:96, :102–103; pp.16–17 (lib/idea-book-edition.ts:176–178).
- "Its anti-skid aggregate is mixed through the whole thickness of the material, so the grip lasts as long as the colour": lib/products.ts:96 ("anti-skid aggregate ... running through the full cross-section, so the grip lasts as long as the colour"). (The Mohs and BPN figures are left to the other TrafficPatternsXD posts of this batch, so the three don't repeat each other; they are on p.13, lib/idea-book-print.ts:84–85.)
- "the book puts its service life at 10+ years": p.13 (lib/idea-book-print.ts:86).

## The close

- "The book offers physical samples of the colours by request": p.15, "Physical samples available by request." (lib/idea-book-edition.ts:170; render read).
- The Lunch & Learn: "puts them on the table": components/sections/LunchLearnV2.tsx:666 ("samples on the table"). 60 minutes: lib/lunch-learn-content.ts:30. In your office or online: LunchLearnV2.tsx:667. Lunch on us, a $25 voucher when it's online: LunchLearnV2.tsx:55. No invoice: lib/lunch-learn-content.ts:34. Link /lunch-learn?topic=TrafficPatternsXD#book, the brief's pattern.

## Links (each checked)

/products/traffic-patterns-xd, /applications/parks-paths, /applications/crosswalks, /lunch-learn?topic=TrafficPatternsXD#book. Each once. No published post is linked: none is about this job or a community centre crosswalk. No outside links.

## Photo

image-23a48c76133f301222e96691dde208a70880f5b5-1800x2400-jpg, already in Studio (the map's photo, parks-paths-146, the p.125 photograph). Alt: "A family crossing a blue and pale grey TrafficPatternsXD crosswalk by the Health and Active Living Plaza pylon, East Gwillimbury, Ontario" (the system and town from the p.125 caption, the plaza from the pylon in the frame). Portrait; hotspot x 0.5 y 0.56 w 0.9 h 0.45 keeps the family, the pylon and the first bands of the crosswalk in a wide crop.
