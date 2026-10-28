# Sources: StreetBond colours on the spray park at Maple Ridge Park

/blog/maple-ridge-park-spray-park · new draft, map job 13 (`maple-ridge-spray-park`), loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/maple-ridge-park-spray-park.md` · 27 Oct 2026

Vern, 27 Oct 2026: "if it's on the map it should have it's own landing page (blog), if it's missing a landing page, create one." Each statement about HUB, a system, a number, a place, a year or the book, then the line it rests on. Line numbers are on feat/map-posts at fede3fd. "Book p.N" is the printed Product Portfolio Book · Volume 5: the renders of pages 25, 60 and 108 (public/catalogue/2026-27/pNNN-1400.webp) were opened and read; the words are in lib/idea-book-print.ts and lib/idea-book-edition.ts.

## What the record holds

- lib/map-projects.ts:787–806. Comment: "Product Book p.108: "The playground is the canvas. Maple Ridge, British Columbia | StreetBond". The City's new spray park at Maple Ridge Park (232 St and 132 Ave), July 2025." Entry: title "Maple Ridge Park spray park", city Maple Ridge, province BC, product StreetBond, application Splash Pads, year "2025", not approximate, image cdn("9a5a84c2eb4f12a3b52e11ffb909c167e300ea91-1966x1299.jpg") (the splash pads gallery's splash-pads-10, "Product Book p.108"), ideaBookPage 108, excerpt "Blue and orange StreetBond fields and a salmon graphic on the Maple Ridge Park spray park, opened in July 2025."
- lib/idea-book-edition.ts:376–381: p.108, eyebrow "Public art", title "The playground is the canvas. We do fun.", caption place "Maple Ridge, British Columbia", system "StreetBond", mapId "maple-ridge-spray-park". The record names this job's mapId and its photograph is the job, so p.108 is tied to it. The printed page says the same (eyebrow under the photograph, headline, caption "Maple Ridge, British Columbia | StreetBond").
- lib/image-facts.ts:417 and docs/site-audits/gallery-captions-2026-10-26.csv (splash-pads-10): StreetBond, Maple Ridge, British Columbia; the photo's own date is 7 Jul 2025.

## Left out, and why

- The salmon graphic: only in the map's excerpt, and the photograph does not show a salmon plainly (an orange form runs through the fields, but nothing in the frame says what it is). Left out.
- The City as owner or client ("The City's new spray park", the comment only): one place, and no record says who HUB's client was. The piece names the park and the town.
- 232 St and 132 Ave (the comment): one place, from research; not needed to name the park. Left out.
- The photo's date (7 Jul 2025, from its own data in the caption sheet): the piece gives the record's "opened in July 2025" instead.
- No installer, designer, quantity or cost: no record gives one. What the pad's slab is: no record says; the splash pads line is given as that page's general description.
- StreetBondSR is named as the book's option for full sun, never as what went in here: the records give StreetBond only, so StreetBondSR is linked but not listed in relatedProducts.

## Against the other drafts

content/drafts/decorative-pavement-landscape-architects.md (an e-blast companion) opens on this job and wears the same photo, and the Collingwood post opens on children at play. This piece opens on a detail of the pad instead, shares no sentence with either, and was checked against all the drafts in content/drafts on 27 Oct 2026 with a script comparing six-word runs: none shared outside names and fixed terms.

## First paragraph

- "An orange bucket hangs from a tall arch at the middle of the Maple Ridge Park spray park, and the pad around it is laid out in deep blue, light blue, orange and grey": the photograph; the job's name, lib/map-projects.ts:792; the map's excerpt has "Blue and orange StreetBond fields" (:805).
- "The colour is HUB Surface Systems' StreetBond": book p.108 caption (lib/idea-book-edition.ts:378, system "StreetBond"); lib/map-projects.ts:797.
- "on a pad in Maple Ridge, British Columbia, that opened in July 2025": lib/map-projects.ts:793–794, :799 (year "2025"), :805 ("opened in July 2025"); the comment's "July 2025" (:790).

## A full pad on page 108

- "The photograph on page 108 of the Product Portfolio Book · Volume 5": lib/idea-book-edition.ts:378; the book's full name, lib/catalogue.ts:77.
- The children among the spray features and on the boulders, the adults on the lounge chairs, the large rounded fields from the play structure to the lawn, and the three orange spheres toward the front: the photograph, read in full (the p.108 render, looked at again on 28 Oct 2026: three orange spheres at the front left; the tall spray posts on the left are blue, so the spray features are not called orange).
- "Under the photograph the page is labelled Public art, and its headline reads "The playground is the canvas. We do fun." The caption at the foot names the town and the coating: "Maple Ridge, British Columbia | StreetBond"": printed p.108, read from the render (the eyebrow sits under the photograph and above the headline); lib/idea-book-edition.ts:378.

## Grip comes first

- "Everyone on a spray pad gets wet and most are barefoot, so the surface has to grip first": lib/applications.ts:158 ("On a splash pad the first requirement is grip in the wet, with chemical treatment and bare feet all season"); book p.60 ("constant water exposure, chemical treatments, bare feet", lib/idea-book-print.ts:280).
- "StreetBond on the prepared concrete, textured for grip, with pigments that stand up to UV": lib/applications.ts:158 (the splash pads page, /applications/splash-pads: "applied to the prepared concrete in a textured, slip-resistant build ... with UV-stable pigments").
- "skid resistant, UV stable": book p.60, the SPECIFY note for StreetBond (lib/idea-book-print.ts:283), word for word.
- "The book puts StreetBond's service life at 8+ years": book p.25 (lib/idea-book-print.ts:112, printed "Life cycle"; "service life" per docs/GLOSSARY.md). "colour that has worn is restored with a fresh coat": lib/applications.ts:158 ("a worn pad is recoated between seasons"); lib/products.ts:161 ("a worn surface is recoated").
- "the book pairs it on that spread with StreetBondSR": book p.60 SPECIFY (lib/idea-book-print.ts:284, "LEED compliant SR ≥ 0.33, coatings keep surfaces cooler"). "StreetBond formulated to reflect": lib/products.ts:272. "colours whose solar reflectance is 0.33 or higher": book p.29 (lib/idea-book-print.ts:120, :122). "so the surface stays cooler underfoot": book p.60 (:281, "solar-reflective options that stay cooler underfoot").

## The close

- The Lunch & Learn ("A parks department with a pad on the drawing board can go over StreetBond with HUB"): "60 minutes": lib/lunch-learn-content.ts:30 ("Sixty minutes"). "at your office or by video": components/sections/LunchLearnV2.tsx:52 ("In your office or online"). "costs the department nothing": lib/lunch-learn-content.ts:34 ("Nothing. No invoice, no minimum order"). "lunch is provided, or a $25 voucher if the session is held by video": LunchLearnV2.tsx:55 ("Lunch on HUB, and a $25 voucher when the session's virtual"). Link /lunch-learn?topic=StreetBond#book, so the form opens with StreetBond (lib/lunch-learn.ts). No continuing-education claim. The only Lunch & Learn close in this batch of five.

## Links (each checked)

/products/streetbond (lib/products.ts:136), /product-book/108 (app/product-book/[page]/page.tsx), /applications/splash-pads (lib/applications.ts:152), /products/streetbondsr (lib/products.ts:260), /lunch-learn?topic=StreetBond#book. Each once; no paragraph links one page twice. No published post is linked: the waterparks post (durable-coatings-waterparks) gives figures the book does not ("over 25 years of history"). No outside links.

## Photo

image-9a5a84c2eb4f12a3b52e11ffb909c167e300ea91-1966x1299-jpg, already in Studio (the map entry's own photo, lib/map-projects.ts:801; the splash pads gallery's splash-pads-10, the photograph on p.108). The dry run found it (1966x1299). Alt: "Children playing on the blue, orange and grey StreetBond surface of the spray park at Maple Ridge Park, Maple Ridge, British Columbia" (the system from the book's caption, the place from the record). Hotspot x 0.52 y 0.5 w 0.9 h 0.85, on the pad, which fills most of the frame.

## Length

About 331 words. The record is the place, the year, the system and the book's page; the piece stops there.
