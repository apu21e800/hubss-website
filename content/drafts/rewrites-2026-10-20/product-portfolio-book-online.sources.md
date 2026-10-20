# Sources: Volume 5 of the Product Portfolio Book is out

/blog/product-portfolio-book-online · unpublished draft, replaced: drafts.blogpost-product-portfolio-book-online (category Blog, which prints as Article)

News about the book itself, not the web reader. Every statement, then the line it rests on, from lib/idea-book-print.ts and lib/idea-book-edition.ts (the book as code) and lib/catalogue.ts (its name and the three ways to get it). Line numbers are on origin/main at 7ac98af. The book is named only as the Product Portfolio Book.

## Opening

- "Volume 5 of the Product Portfolio Book, the 2026–27 edition, is out."
  - lib/catalogue.ts:73–79 `ideaBook`: short "Product Portfolio Book", title "Product Portfolio Book · Volume 5", volume "Volume 5"; lib/catalogue.ts:112 the edition written as "2026–27"; lib/field-note-facts.ts:29 "The HUB Product Portfolio Book (Volume 5, the 2026-27 print edition ...)".
- "HUB Surface Systems' printed book of its ten systems and the jobs that show them in service across Canada"
  - lib/idea-book-edition.ts:161 divider "Ten systems", "Our systems, how they work, and where to find them."; the projects leaves :274–481.
- "its cover is the Musqueam crosswalk at the HUB sign at UBC"
  - lib/idea-book-edition.ts:139 cover: "The HUB Product Portfolio Book cover: a Musqueam crosswalk in front of the HUB sign at UBC".

## Inside the book

- "The systems come first, each with its own page of specifications and the uses it is made for", and the ten names
  - lib/idea-book-print.ts:64–196 PRINT_SYSTEMS: each system's specs and its uses strip; lib/idea-book-edition.ts:125–136 CONTENTS, the same ten in the book's order.
- "The colour charts sit with the systems that have them"
  - lib/idea-book-edition.ts:167–171 "Thirty-seven colours" (TrafficPatternsXD, TrafficPatterns and DecoMark); :207–212 "Sixty-three colours" (StreetBond); lib/idea-book-print.ts:153 MMAX colour families.
- "and so do the installation steps for TrafficPatternsXD and StreetPrint, with StreetPrint's stamping templates"
  - lib/idea-book-edition.ts:172–182 "Place. Heat. Stamp." (TrafficPatternsXD, pages 16–17); :184–194 "Reheat. Stamp. Coat." (StreetPrint, pages 20–21); :195–205 "Stamping templates." (pages 22–23).
- "Then the applications, each spread with the systems the book specifies for it and the reason for each."
  - lib/idea-book-print.ts:198–390 PRINT_APPLICATIONS: each spread's SPECIFY list, a system and a note.
- "Crosswalks, bike lanes, transit corridors and traffic calming ... play surfaces, splash pads, townhomes, driveways and parking lots"
  - lib/idea-book-edition.ts:235–272, the application eyebrows: "Crosswalks", "Bike lanes", "Transit corridors", "Traffic calming", "Play surfaces", "Splash pads", "Townhomes", "Homes" (the driveway spread), "Parking lots".
- "a TrafficPatternsXD crosswalk at a grocery store in Oakville, Ontario, in its first year and its tenth"
  - lib/idea-book-edition.ts:261–267 then-and-now `commercial-spaces`, labels "Year 1", "Year 10", mapId "oakville-ten-years"; lib/map-projects.ts:1209 "Product Book p.73: 'Year 1 / Year 10. Oakville, Ontario | TrafficPatternsXD'" and excerpt "... at a grocery store in Oakville."
- "a StreetBondSR park path in Osoyoos, British Columbia, when it went in and three years on"
  - lib/idea-book-edition.ts:342–352 then-and-now `osoyoos`: "Three years on, this Osoyoos park path still reads as new", labels "Installed", "After 3 years", caption "Osoyoos, British Columbia" / "StreetBondSR".
- "the 14-year-old entrance feature at Toronto Premium Outlets in Halton Hills, Ontario"
  - lib/idea-book-edition.ts:295 (page 86): "14-year-old entrance feature. Still performing every day.", caption "Halton Hills, Ontario" / "TrafficPatternsXD".
- "London, Ontario's transit corridor in TrafficPatternsXD and red MMAX"
  - lib/idea-book-edition.ts:312 (page 90): "Combining TrafficPatternsXD for pedestrian safety with red MMAX for the dedicated transit lanes gave the City of London the solution it needed", caption "London, Ontario".
- "the white StreetBondSR surface at the Mont-Mégantic observatory in Québec"
  - lib/idea-book-edition.ts:355 (page 102): "A white StreetBondSR surface reflects what little light there is", caption "Mont-Mégantic, Québec" / "StreetBondSR".
- "the cruise ship terminal walkway in Charlottetown, Prince Edward Island"
  - lib/idea-book-edition.ts:466–469 (pages 134–135): "Charlottetown, PEI: the cruise ship terminal walkway, stamped in a herringbone basket-weave and sealed with StreetBond."
- "the crosswalks at the Kwanlin Dün Cultural Centre in Whitehorse, Yukon"
  - lib/idea-book-edition.ts:391 (page 113): "Acknowledgement, cast in pavement.", caption "Whitehorse, Yukon" / "TrafficPatterns", mapId "whitehorse-kwanlin-dun"; lib/map-projects.ts:76–77 `whitehorse-kwanlin-dun`, title "Kwanlin Dün Cultural Centre crosswalks".
- "the certified installers who lay the systems, province by province"
  - lib/idea-book-edition.ts installer leaves: Saskatchewan (:220–224), Ontario (:305–309), Québec (:359–363), Alberta (:412–416), British Columbia (:460–464).
- "HUB's own numbers, 27 years and 1,000+ projects, coast to coast"
  - lib/idea-book-edition.ts:484 (pages 140–141): stats "27 years · 1,000+ projects · coast to coast". (The company's numbers: docs/STYLE.md, Numbers.)
- "some of the communities HUB works with, the City of Toronto and the University of British Columbia among them"
  - lib/idea-book-edition.ts:485–492: "Here are a few of the communities we work with." The list includes "City of Toronto" and "University of British Columbia".
- "The last spread is the Lunch & Learn: an hour on the systems for your team, in person across Canada or virtual, with lunch on HUB."
  - lib/idea-book-edition.ts:496–501 (pages 142–143): "Lunch is on us.", "Got an hour?", "An hour of technical, in-depth, product solutions ...", "In person across Canada, or virtual." The point "Continuing-education content" is left out: no CE claims (lib/lunch-learn-content.ts:17).

## Getting a copy

- "Read it online, page by page as it is printed, with a page turn": lib/catalogue.ts:80–86 `href: "/product-book"`, "the printed book, page by page, open at page one, with a page turn".
- "Download the PDF from the same page": app/product-book/CatalogueViewer.tsx:1241–1244, the toolbar's PDF download.
- "Request a printed copy, and HUB will mail one to your office": lib/catalogue.ts:94 `requestHref: "/request-product-book"`; app/request-product-book/page.tsx:10 "Have the Product Portfolio Book (Volume 5) mailed to your office".
- The close: spec sheets on Resources (lib/field-note-facts.ts:32); the Lunch & Learn (lib/field-note-facts.ts:32).

## Links (each checked)

The ten /products/<slug> pages (lib/products.ts), /product-book, /request-product-book, /resources, /lunch-learn (app/ routes).

## Photo

public/catalogue/2026-27/p001-2000.webp, the book's cover (2000 x 2000): the Musqueam crosswalk at the HUB sign at UBC, "Volume 5" on it. Already in Studio as image-af25f2d8435d82509507db73252843002fc9a3ba-2000x2000-webp (the 16 Oct draft uploaded it), so the script reuses that asset and uploads nothing. Hotspot x 0.5, y 0.55, w 0.5, h 0.5: between the sign and the crosswalk, so a wide crop keeps both.

## What was left out

- The web reader's features (page turn, zoom, page addresses): the subject is the book (Vern: "a blog post about a design improvement").
- Any page count (lib/catalogue.ts:70: "No page count travels with the name").
