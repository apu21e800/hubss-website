# Sources: A PreMark ladder crosswalk on the Cascades Casino Delta access road

/blog/cascades-casino-delta-access-road · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/cascades-casino-delta-access-road.md` · 28 Oct 2026

Map job 7 of the 40 with no write-up. The slug is the one the map is pointed at. Line numbers are on branch feat/map-posts as it stood on 28 Oct 2026. A thin record: the post stops at about 290 words (the dry run's count) because the facts stop there.

## What the record holds

- lib/map-projects.ts:488–506, `delta-cascades-casino`. Comment (:489–491): "Product Book p.38, the PreMark page: "City of Delta, British Columbia". The building is the Delta Hotels by Marriott at Cascades Casino Delta, 6005 Highway 17A, under construction." Title "Cascades Casino Delta" (:493), Delta, BC (:494–495), product PreMark (:498), application Crosswalks (:499), no year, not `approximate`, one photo, cdn("45eeb1538a81716f5dd63fc3c92fe5c3a01ef77f-1200x900.jpg"), "products/premark/premark-01 (Product Book p.38)" (:501), ideaBookPage 38 (:503), excerpt "PreMark crosswalk markings on the access road to the new hotel at Cascades Casino Delta." (:505).
- lib/idea-book-edition.ts:218: the PreMark system leaf, pages 38–39, photo "PreMark crosswalk markings at Cascades Casino, City of Delta, British Columbia", caption "City of Delta, British Columbia". A system leaf has no `mapId` field (the type, :75), so the tie of p.38 to this job rests on the map's ideaBookPage (:503) and photo note (:501), the leaf's alt, and the photograph itself: the p.38 render and the map's photo are the same frame (the book crops it). Flagged in the report.
- The printed pages, read as images: p.38 (public/catalogue/2026-27/p038-1400.webp), the photograph with the caption "City of Delta, British Columbia"; p.39, PreMark's page.
- lib/idea-book-print.ts:183–195 (PreMark as printed); lib/products.ts:367–389 (PreMark).
- The photo: the cdn file above, downloaded and read (1200x900), with the sign and the marking read at full size.

## Left out, and why

- "Delta Hotels by Marriott": the hotel's brand is in one place only (the map comment's research), so the post says "new hotel", as the map's excerpt does.
- "6005 Highway 17A": a street address; none on the site.
- Install year, client, installer, quantity, cost: no record gives one. Which PreMark thickness this crosswalk is (125 mil or 90 mil ViziGrip): no record says, so the post gives both, as the book does.
- "Provincially approved across Canada" (book p.39): cut, as lib/products.ts:382–383 and docs/GLOSSARY.md ("Claims that need a source") cut it.
- "school legends" from the book's list: left out of the post's shorter list; the e-blast guides already quote the book's full list.
- No published post linked: none is about PreMark on a job. The guides on the do-not-link list are not linked.

## First paragraph

- "A blue and grey sign beside the access road reads “Cascades Casino” and points the way to the casino drop-off, the hotel drop-off, hotel parking, the parkade and deliveries": the photograph (the sign's lines: CASINO DROP-OFF, HOTEL DROP-OFF, HOTEL PARKING, PARKADE, DELIVERIES, under the Cascades Casino logo).
- "The road serves Cascades Casino Delta's new hotel in the City of Delta, British Columbia": lib/map-projects.ts:493–495, :505 ("the access road to the new hotel at Cascades Casino Delta"); "City of Delta" is the book's caption (lib/idea-book-edition.ts:218).
- "In the photograph the hotel is still under construction": :490–491 ("under construction"); the photograph (graded earth, traffic cones, a boom lift, an unfinished ground floor).
- "a ladder crosswalk in PreMark": :498, :505 ("PreMark crosswalk markings"); "ladder" for bars between two edge lines is docs/GLOSSARY.md:53, and the photograph shows exactly that.
- "HUB Surface Systems' preformed thermoplastic for road markings": lib/products.ts:375 ("PreMark is preformed thermoplastic for regulatory road markings"), :377.
- "The same photograph opens the PreMark pages of the Product Portfolio Book · Volume 5, on page 38, with the caption “City of Delta, British Columbia”": lib/idea-book-edition.ts:218; the p.38 render.

## Ladder lines cut to specification

- "two white edge lines with white bars set between them, the pattern known as a ladder": the photograph; docs/GLOSSARY.md:53.
- "Ladder lines are on PreMark's list in the book, with arrows, stop bars, yield triangles and bike symbols": lib/idea-book-print.ts:186; book p.39.
- "each is cut to the specified shape before it reaches the road": :186 ("pre-cut to specification").
- "On site the pieces are heated on the asphalt with a torch until they bond to it": :186 ("Heat-applied by torch"), :189 ("Heat-applied"); docs/GLOSSARY.md:27–29 (heated until they bond; PreMark is heat-applied and bonds to the surface). The road in the photograph is asphalt.

## What goes into the white bars

- "125 mil as standard, about 3 mm, with a 90 mil ViziGrip option": lib/idea-book-print.ts:188; lib/products.ts:375; "about 3 mm" is docs/GLOSSARY.md:29 and :36.
- "The material carries glass beads in it, so the white bars return a driver's headlights after dark": lib/idea-book-print.ts:190 ("Retroreflectivity", "Integrated glass beads"); docs/GLOSSARY.md:35 (glass beads in the material bounce a headlight back to the driver; true of PreMark).
- "The service life the book gives is 6–8 years": lib/idea-book-print.ts:191.
- "No stencil is needed and there is no cure to wait for: in the book's words, traffic can “drive on immediately”": :186 ("no stencils, no curing window, drive on immediately").

## The close

- "PreMark's page closes on a strip of four uses: bike lanes, crosswalks, regulatory markings and parking": :193 ("Bike lanes", "Crosswalks", "Regulatory", "Parking"); the uses strip at the foot of the p.39 render. "regulatory markings" expands the strip's "Regulatory", as the site's application of that name does.
- Lunch & Learn: 60 minutes (lib/lunch-learn-content.ts:30, the brief), at your office or online (components/sections/LunchLearnV2.tsx:52), lunch on HUB and a $25 voucher when the session is virtual (:55), no invoice (lib/lunch-learn-content.ts:34). The link carries the topic (lib/lunch-learn.ts, lunchLearnHref). One of the two posts of my five that close on it.

## Links (each checked)

/products/premark (first mention), /product-book/38, /applications/crosswalks, /lunch-learn?topic=PreMark#book. Each once. No outside links.

## Photo

image-45eeb1538a81716f5dd63fc3c92fe5c3a01ef77f-1200x900-jpg, already in Studio (products/premark/premark-01, the map's photo). The dry run found it at 1200x900, under 1600 px wide: the repo's copy (public/images/products/premark/premark-01.jpg) and the three Studio assets named premark-01.jpg are all 1200 px wide, so no larger copy was found. Alt: "A PreMark ladder crosswalk on the access road at Cascades Casino Delta, with the new hotel under construction behind" (PreMark and the place from the map, the construction from the map comment and the photograph). Hotspot x 0.68 y 0.66 w 0.5 h 0.55, on the crosswalk and the sign, right of centre.
