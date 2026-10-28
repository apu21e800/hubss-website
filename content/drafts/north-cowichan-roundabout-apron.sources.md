# Sources: A StreetPrint roundabout apron in the Cowichan Valley

/blog/north-cowichan-roundabout-apron · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/north-cowichan-roundabout-apron.md` · 28 Oct 2026

Map job 3 of the 40 pins with no write-up (BRIEF.md, 27 Oct 2026). The slug is the one the map is pointed at. Each statement about HUB, the system, a number, the place or the book, then the line it rests on. Files and line numbers are on feat/map-posts at fede3fd. Book pages are the printed Product Portfolio Book · Volume 5: the renders public/catalogue/2026-27/p054-1400.webp and p055-1400.webp were read, and their words checked against lib/idea-book-print.ts and lib/idea-book-edition.ts. A thin record: about 333 words by the script's count.

The Kanaka Springs draft (kanaka-springs-roundabout-maple-ridge, job 15) is also a StreetPrint roundabout apron in British Columbia. To keep the two from reading as one template, this piece opens on the photograph rather than on what an apron is, leads its middle with the traffic calming spread (the Maple Ridge job is a projects page), and does not link the stamped asphalt install guide that one links. Checked against every draft in content/drafts on 28 Oct 2026: no sentence or heading in common.

## What the record holds

- lib/map-projects.ts:172–191, id cowichan-roundabout. Comment (:173–175): "Product Book p.55: "Cowichan Valley, British Columbia" (file: roundabout median, StreetPrint). Matched from imagery, not a source, to the Bell McKinnon Rd and Herd Rd roundabout: approximate." Title "Roundabout apron" (:177), city North Cowichan, BC (:178–179), product StreetPrint (:182), application Traffic Calming (:183), approximate: true (:184), one photo (:186, cdn e3f43c69…-1184x864.jpg, applications/traffic-calming/traffic-calming-57, book p.55), ideaBookPage 55 (:188), excerpt (:189–190): "A StreetPrint brick apron on a new roundabout in the Cowichan Valley."
- The book, pp.54–55: the traffic calming application spread, its photograph on p.55 (lib/idea-book-edition.ts:240, mapId cowichan-roundabout, alt "A StreetPrint roundabout apron in the Cowichan Valley, British Columbia"; its photo is this job's photo). Printed words (lib/idea-book-print.ts:243–254): headline "Drivers slow down with visual cues.", statement "A change in surface is a change in speed.", body "Traffic calming devices such as roundabouts, medians, truck aprons, gateway treatments and speed tables. Changing colour and texture tells a driver the environment has changed before any sign does. Our systems can help with this.", SPECIFY StreetPrint "Traffic calming device treatments", StreetBond "Sidewalks, pathways and plazas", TrafficPatternsXD "Durable road surface treatments", caption "Cowichan Valley, British Columbia" (no system printed).
- The system: book p.19 (lib/idea-book-print.ts:91–103); lib/products.ts:184–213. The application: lib/applications.ts:232–246.

## First paragraph

- "The sky is clear in the photograph, and under it a roundabout in the Cowichan Valley, British Columbia, curves away with an apron of red brick pattern between two concrete curbs": the photograph; the place is the book's caption (lib/idea-book-print.ts:252), which wins (BRIEF.md). The pin is approximate (:184), so only the place is named, never a road.
- "The apron is StreetPrint stamped asphalt": the map's product (:182) and title (:177); the file name the comment quotes, "roundabout median, StreetPrint" (:174); the edition's alt for the photo (lib/idea-book-edition.ts:240); the excerpt, "A StreetPrint brick apron" (:189–190). The link text carries "stamped asphalt" (docs/GLOSSARY.md:74).
- "HUB Surface Systems prints the photograph beside the traffic calming page of its Product Portfolio Book · Volume 5": the photo is p.55, the facing half of the p.54 spread (lib/idea-book-edition.ts:240, 512–526: the photo is page + 1). First mention of HUB and of the book, in full.

## The apron and the road around it

- All of it is what the photograph plainly shows: the brick pattern across the full width of the frame, following the apron's curve; a yield sign and a pedestrian sign beyond it at the roadside (the plate under the yield sign is not legible, so not quoted); black asphalt around the apron; a bank cut for the road, bare earth; forested hills on the skyline. The pattern is called "brick", not a named template: the photograph does not settle which one.
- "The caption names the place, Cowichan Valley, British Columbia": p.55's printed caption (render; lib/idea-book-print.ts:252).

## Opposite the traffic calming page

- "The book's traffic calming spread is headed 'Drivers slow down with visual cues.' Under the headline is the line 'A change in surface is a change in speed.'": lib/idea-book-print.ts:244–245, word for word; the p.54 render.
- "Its list of traffic calming devices starts with roundabouts and includes truck aprons": :246 ("Traffic calming devices such as roundabouts, medians, truck aprons, gateway treatments and speed tables"). The apron in the photograph is not called a truck apron: the record says "roundabout apron" only.
- "it specifies StreetPrint for traffic calming device treatments, with StreetBond for the sidewalks, pathways and plazas around them": SPECIFY (:248–249); "around them" as lib/applications.ts:243 has it ("the same coating marks the sidewalks, pathways and plazas around it").
- "HUB's own traffic calming page names a roundabout apron among the places where colour and texture show a driver the street has changed before a sign does": lib/applications.ts:243 ("Traffic calming works when a driver sees the street change before a sign says so, and colour and texture do that at a gateway, a speed table, a roundabout apron or a raised crossing").

## Where the red comes from

- "The red is StreetBond pavement coating, laid over a pattern that a steel wire-rope template and a plate compactor have pressed into the heated asphalt": StreetPrint is stamping plus StreetBond coating (p.19 spec, "System: Stamping + StreetBond coating", lib/idea-book-print.ts:96; p.19 description, "Patterns are stamped into existing asphalt, then coloured with StreetBond coatings", :94); docs/GLOSSARY.md:32 ("A pattern pressed into heated asphalt with a steel wire-rope template and a plate compactor, then coloured with StreetBond coatings"); "pavement coating", docs/GLOSSARY.md:37. The apron is StreetPrint and red, so its red is the StreetBond coat; the colour's name is not given (no record has it).
- "The book's specification for StreetPrint reads 'Stamping + StreetBond coating.'": :96, word for word.
- "With the pattern in the asphalt, nothing stands above the road for a plow to catch, and the asphalt stays flexible": p.19 description ("The surface stays flush ... Nothing for a plow blade to catch, no joints to weed, no pavers to settle, asphalt stays flexible.", :94), in other words. The printed "no slip, no trip" is not used: "non-slip" is not written as a promise (BRIEF.md; docs/GLOSSARY.md:34).
- "The same page specifies new or existing asphalt as the base and gives a service life of 10–20 years": p.19 specs (:99, :98).
- Not said: whether this apron was stamped into new or existing asphalt, or how it was installed. No record says.

## The close

- Lunch & Learn: 60 minutes (CLAUDE.md, "Lunch & Learn page", Doug 26 Oct 2026; lib/lunch-learn-content.ts:30), in your office or online (:42), lunch on HUB and a $25 voucher when it is virtual (components/sections/LunchLearnV2.tsx:55), no invoice (lib/lunch-learn-content.ts:34). Link /lunch-learn?topic=StreetPrint#book (lib/lunch-learn.ts). One of the two of these five pieces that end on the Lunch & Learn (the other is granville-island-brewing-crosswalk); the two closing paragraphs share no sentence.

## Links (each checked)

/products/streetprint (first mention, "StreetPrint stamped asphalt" as the link text), /product-book/54 (the spread; its photograph is p.55), /applications/traffic-calming, /products/streetbond, /lunch-learn?topic=StreetPrint#book. No published post linked: none is about this job; the traffic calming guide (traffic-calming-surface-design) carries outside speed figures and a BPN that is not the book's, so it is not a fit. No outside links.

## Photo

image-e3f43c69a926c36fafd00a8045e7e3796d55acce-1184x864-jpg, already in Studio (original file traffic-calming-57.jpg; the dry run found it, 1184x864): the map's own photo (lib/map-projects.ts:186) and the photograph on p.55. Alt: "A curved red brick-pattern roundabout apron in StreetPrint stamped asphalt, between concrete curbs, in the Cowichan Valley, British Columbia": system from the map record, place from the caption. Hotspot x 0.5 y 0.7 w 0.95 h 0.46: the apron fills the lower half; the top 40% is sky.

## Left out, and why

- North Cowichan, and the Bell McKinnon Road and Herd Road roundabout: the comment says the roundabout was matched from imagery, not a source (:174–175), and the pin is approximate. The book's caption names the Cowichan Valley, so the post does too. North Cowichan stays in the slug only, as the map is pointed at it.
- "a new roundabout" (the excerpt, :189–190): the photograph shows black asphalt and a bare cut bank, but no record dates the roundabout, so the post describes what the photograph shows and does not call it new.
- The system on the book's page: the caption prints none. StreetPrint rests on the map record and the original file name the comment quotes; flagged in the report.
- Install year, client, installer, designer, size: no record gives them.
- The book's closing page lists "North Cowichan Valley RD" among the communities HUB works with (lib/idea-book-edition.ts:491); not tied to this job, so not used.
