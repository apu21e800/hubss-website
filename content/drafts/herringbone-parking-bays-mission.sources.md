# Sources: Herringbone stamped asphalt parking bays in Mission, British Columbia

/blog/herringbone-parking-bays-mission · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/herringbone-parking-bays-mission.md` · 27 Oct 2026

The write-up for the homepage map's pin `mission-herringbone-bays` (map job 16 of the 40 without one; Vern, 27 Oct 2026: "if it's on the map it should have it's own landing page"). Each statement about HUB, a system, a place, a year or the photograph, then the line it rests on. Line numbers are on feat/map-posts at fede3fd. The printed pages were read from their renders (public/catalogue/2026-27/p137, p019, p020, p022, p023, p025, p027, p078) and the PDF's text layer.

## What the record holds

- lib/map-projects.ts:846–867. Comment (:847–849): "Product Book p.137: "Commercial hardscapes... Mission, British Columbia | StreetPrint". Square One's April 2025 job; the building is not named: pin at city hall, approximate." Entry: title "Herringbone parking bays" (:851), city Mission, BC (:852–853), product StreetPrint (:856), systems StreetBond (:857), application Commercial Spaces (:858), year 2025 (:859), approximate: true (:860), photo cdn 69d1d4f3…-2400x1800 (:862, applications/commercial-spaces/commercial-spaces-68), ideaBookPage 137 (:864), excerpt "Herringbone StreetPrint in StreetBond Pewter on the parking bays in front of a new commercial building in Mission." (:866).
- The book: lib/idea-book-edition.ts:474, p.137, mapId "mission-herringbone-bays": eyebrow "Commercial space", title "Commercial hardscapes.", body "Retail entries, hotel forecourts, and mixed-use frontages where the surface underfoot signals the quality of everything inside. StreetPrint delivers the visual weight of premium stone paving in place, on the existing asphalt, without closing the site for reconstruction.", caption "Mission, British Columbia | StreetPrint". The render of p.137 was looked at: its photograph is the map's photo, cropped, and it is the only job on the page (p.136, facing, is Langley City's railway heritage crosswalk).
- Approximate pin, so the post names the town only: no street, no building, no business.

## First paragraph

- "A parking bay at the front door of a commercial building is where a visit starts: the car stops on it, and the customer steps out onto it.": what the site asks of a surface, in general words, no claim about HUB; the photograph shows the bays directly in front of the building's door with only the walk between.
- "At a new commercial building in Mission, British Columbia, the bays out front are herringbone StreetPrint stamped asphalt, coloured in StreetBond Pewter": lib/map-projects.ts:866 (the excerpt), :856–857. "installed in 2025": :859 (the year field), :848 ("April 2025 job").
- The link text "StreetPrint stamped asphalt" to /products/streetprint: docs/GLOSSARY.md, "stamped asphalt, the link (20 Oct 2026)".

## Herringbone up to the drive aisle

- "The job has page 137 of the Product Portfolio Book · Volume 5 to itself, under the headline "Commercial hardscapes."": lib/idea-book-edition.ts:472–474 (p.137 is one card, this job's mapId, and its photograph is this job); the render of p.137. The book's full name at its first mention: lib/catalogue.ts:77.
- "In the book's photograph the grey herringbone fills each bay from the concrete wheel stops at the walk to the plain black asphalt of the drive aisle. Thin white lines divide the bays, and a white border runs along the outside edge of the nearest one. The building's glass front and its brick and metal siding stand along one side, with mountains on the skyline.": the photograph (the map's 2400 px copy and p.137), looked at, with a close crop of the bays' far edge. Nothing about the lines' or the border's material is said.
- The quote "Retail entries, hotel forecourts, and mixed-use frontages where the surface underfoot signals the quality of everything inside.": p.137's body, word for word (lib/idea-book-edition.ts:474; the PDF's text layer). Its caption "Mission, British Columbia | StreetPrint": the same. Link /product-book/137.
- The page's second sentence ("... on the existing asphalt, without closing the site for reconstruction") is not used: the record calls the building new and says nothing of the asphalt under the bays, so the post does not say the bays were stamped into existing asphalt.

## Stamped into the asphalt and coloured Pewter

- "With StreetPrint, a pattern is pressed into heated asphalt, new or existing, and then coloured with StreetBond pavement coating.": p.19 (lib/idea-book-print.ts:94, "Patterns are stamped into existing asphalt, then coloured with StreetBond coatings"; :99, Base "New or existing asphalt"); p.22 ("Precision made templates for stamping decorative patterns into hot asphalt", lib/idea-book-edition.ts:197); docs/GLOSSARY.md, "stamped asphalt (StreetPrint)" and "pavement coating".
- "The pattern is in the asphalt itself, so, as the book's StreetPrint page puts it, "The surface stays flush."": p.19, the start of its second sentence (lib/idea-book-print.ts:94; the printed page continues "— no slip, no trip", which the post leaves out).
- "On that page StreetPrint's service life is 10–20 years and its patterns come standard or custom": p.19 specs (lib/idea-book-print.ts:98, :97).
- "Herringbone and Diagonal Herringbone both appear on the book's list of field templates": p.23 (lib/idea-book-edition.ts:200), link /product-book/23.
- "StreetBond, the colour coat, is a water-based, epoxy-modified acrylic made for asphalt and concrete, and the book puts its own service life at 8+ years, easily refreshed.": p.25 (lib/idea-book-print.ts:109, :110, :112; the printed label is "Life cycle", written as service life per docs/GLOSSARY.md); lib/products.ts:161, :167.
- "Pewter is one of the greys in the StreetBond range printed on page 27 of the book.": p.27's text layer ("Sterling · Pewter · Concrete Gray ..."); lib/colours.ts:96 (the 2026 StreetBond colour card). Its solar reflectance (0.24) is not given: it is not one of the SR colours and nothing here needs it.

## Where StreetPrint fits on a commercial site

- "HUB Surface Systems uses StreetPrint at the entrances and pedestrian routes of a parking lot, for the look of pavers with nothing to settle or weed.": lib/applications.ts:90 ("StreetPrint stamps a pattern into the asphalt at entrances and pedestrian routes for the look of pavers with nothing to settle or weed").
- "Page 78, the book's parking lots page, lists StreetPrint with its StreetBond coat beside DuraShield, StreetBond and TrafficPatternsXD.": lib/idea-book-print.ts:381–386 (StreetPrint: "Stamped asphalt treated with StreetBond coating"); the render of p.78.
- "On HUB's page for commercial spaces, the same system takes the entry courts and walkways, while TrafficPatternsXD carries the crosswalks from the lot to the doors.": lib/applications.ts:187.
- The post ends on where the system fits, not on a Lunch & Learn (two of the five end with one; this is not one of them).

## Links (each checked)

/products/streetprint, /products/streetbond, /products/durashield, /products/traffic-patterns-xd (each at its first mention); /product-book/137, /product-book/23; /applications/parking-lots, /applications/commercial-spaces. The dry run resolves both products and both applications. No published post is the same subject (a herringbone StreetPrint parking job), so none is linked; none of the seven guides the brief bars is linked.

## Against the other posts

A seven-word-run check against the 77 published posts and every other draft in content/drafts (27–28 Oct 2026) finds no shared run but the book's name. The book's lines that several other drafts quote (StreetPrint's "Nothing for a plow blade to catch ...", p.78's "Stamped asphalt treated with StreetBond coating") are left unquoted here.

## Photo

image-69d1d4f3f739adab42e181181b1fd6f21124c143-2400x1800-jpg, already in Studio: the map's own photo of the job (applications/commercial-spaces/commercial-spaces-68), the same photograph the book prints on p.137. Alt: what it shows, with StreetPrint and Mission, British Columbia, which the book's caption and the map prove, and "new commercial building" from the excerpt. Hotspot x 0.55 y 0.72 w 0.85 h 0.5, on the bays in the lower two thirds of the frame.

## Left out

- Square One as the installer, and "April": the map's comment (:848) is the only record of either; the year (2025) stays because the entry's year field states it. The book's p.133 names Square One as HUB's British Columbia master installer, but no record but the comment ties this job to it.
- The building, its business and any street: the pin is approximate (:860, "the building is not named"). The unit number on the door in the photograph is not used.
- The bays' count and size, and what the lines and the border are made of: no record gives them.
- Whether the bays were stamped into new or existing asphalt: no record says.
- "the visual weight of premium stone paving": the book's words, left out because "premium" as praise is on docs/STYLE.md's list.
