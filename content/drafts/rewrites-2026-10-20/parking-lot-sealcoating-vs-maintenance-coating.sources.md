# Sources: Before you book the next round of parking lot sealcoating

/blog/parking-lot-sealcoating-vs-maintenance-coating · live post, rewritten into drafts.blogpost-parking-lot-sealcoating-vs-maintenance-coating

Each statement about HUB, a system, a number, a place, a client or a year, then the line it rests on. "Book" is the Product Portfolio Book, Volume 5, as code. Line numbers are on origin/main at 7ac98af.

## First paragraphs

- The grey lot, the quote on the desk, and what a sealcoat does ("a thin coat over the asphalt that brings back the colour and slows the sun and water down", "it wears first where traffic turns and brakes"): the reader's scene and general context in plain words, with no numbers and no claim about HUB or about another brand.
- "For a lot whose asphalt is still sound, a pavement maintenance coating is the other choice on the table."
  - lib/products.ts:326 DuraShield: "Specified for parking lots, driveways, pathways and LEED sites where the asphalt is sound and the surface needs protecting."
  - "pavement maintenance coating": lib/idea-book-print.ts:171 (page 37) title "Pavement maintenance coating."

## What DuraShield is

- "The photograph on DuraShield's spread in the Product Portfolio Book is a lot in Etobicoke, Ontario."
  - lib/idea-book-edition.ts:217: system leaf `durashield`, pages [36, 37], photo "A DuraShield-coated commercial lot in Etobicoke, Ontario", caption "Etobicoke, Ontario". The page render, public/catalogue/2026-27/p036-2000.webp, prints "Etobicoke, Ontario" on the photograph. (The job is not on the project map; the book's caption and page are its record.)
- "The book calls DuraShield a pavement maintenance coating, a two-component epoxy-modified acrylic with solar-reflective options."
  - lib/idea-book-print.ts:171–172 (page 37): title "Pavement maintenance coating.", subhead "Two-component epoxy-modified acrylic. Solar-reflective options."
- "It resists fuel, oil and de-icing agents, cools the surface, and protects the pavement underneath, extending its service life."
  - lib/idea-book-print.ts:173: "A maintenance coating for asphalt. Resists fuel, oil and de-icing agents, cools the surface, and protects the substrate underneath, extending the service life of the pavement." ("the pavement underneath" for "the substrate underneath": docs/GLOSSARY.md, substrate, "For the public: 'the pavement underneath'".)
- "Its applications line in the book reads: preserves and protects asphalt, old and new."
  - lib/idea-book-print.ts:178: `{ label: "Applications", value: "Preserves and protects asphalt, old and new" }`.
- "The product page says where it is specified: parking lots, driveways, pathways and LEED sites where the asphalt is sound and the surface needs protecting."
  - lib/products.ts:326 (quoted above).
- "The solar-reflective option is SR Gray, at 0.35 on the 2026 colour card."
  - lib/products.ts:331: `{ label: "Solar reflectance", value: "Optional (SR Gray 0.35 on the 2026 colour card)" }`.

## Where colour fits in a lot

- "The StreetBondSR spread opens on a fleet lot in Toronto, Ontario, coated across in StreetBondSR."
  - lib/map-projects.ts:1448–1465, `toronto-fleet-lot`: comment "Product Book p.28, the StreetBondSR page: 'Toronto, Ontario'", product "StreetBondSR", application "Parking Lots", excerpt "StreetBondSR across a fleet parking lot in Toronto, reflecting sunlight so the surface stays cooler." The pin is approximate (the site is not identified), so the piece names the city only.
  - lib/idea-book-edition.ts:213: system leaf `streetbondsr`, pages [28, 29], photo "A fleet lot in a solar-reflective StreetBondSR coating, Toronto, Ontario".
  - The photograph shows a fleet's branded vehicles; the book names no client, so the piece names none.
- "StreetBondSR is StreetBond formulated to reflect rather than absorb. Twelve of its colours carry a solar reflectance of 0.33 or higher and can contribute to the LEED v5 heat-island credit for non-roof surfaces"
  - lib/products.ts:272: "StreetBondSR is StreetBond formulated to reflect rather than absorb".
  - lib/idea-book-print.ts:120 (page 29): "StreetBond colours that are formulated to reflect rather than absorb. Twelve colours carry SR 0.33 or higher and can contribute to LEED V5 urban heat-island credits (non-roof)." ("LEED v5": docs/STYLE.md "LEED is v5".)
- "and the book lists parking among their uses"
  - lib/idea-book-print.ts:127 uses: "Parking", "Plazas", "LEED projects", "Schools".
- "StreetBond itself is a water-based, epoxy-modified acrylic in 63 standard colours with custom matching."
  - lib/idea-book-print.ts:107–111 (page 25): "Sixty-three standard colours plus full custom colour matching"; "Type: Water-based, epoxy-modified acrylic"; "Colours: 63 standard + custom colours".
- "The book specifies it for parking lots as a coloured coating to enhance and preserve"
  - lib/idea-book-print.ts:383 (page 78): `{ slug: "streetbond", note: "Coloured coating to enhance and preserve" }`.
- "HUB's Parking Lots page puts it in drive aisles, wayfinding zones and fire lanes"
  - lib/applications.ts:90: "StreetBond adds colour for drive aisles, wayfinding zones and fire lanes".
- "the book shows a lot inside a heritage industrial hall, coated in a slate colour that complements the brick and steel"
  - lib/idea-book-edition.ts:424–429 (pages 122–123), "Colour that knows when to be quiet.": "Inside a heritage industrial hall, the lot is coated in a slate coloured coating that complements the brick and steel. StreetBond transforms older pavement to give it new life." Caption "StreetBond"; no place is printed, so none is given.
- "StreetBond's service life is 8+ years, and a worn surface is recoated rather than rebuilt."
  - lib/products.ts:161: "A service life of 8+ years, and easily refreshed: a worn surface is recoated, not rebuilt."

## Maintain or replace

- "it breaks down when it is exposed to the elements, and the systems the book specifies for a lot add to its looks while preserving the asphalt underneath"
  - lib/idea-book-print.ts:380 (page 78): "Asphalt breaks down when it's exposed to the elements. By using StreetPrint, StreetBond, DuraShield or TrafficPatternsXD you are adding aesthetic value all while preserving the underlying asphalt."
- What "sound" means (trouble on top; not sound when there are ruts, settled areas, cracks joined into a web, or potholes that come back): general context in plain words, written because docs/GLOSSARY.md (substrate) says not to write "sound pavement" without saying what that is.
- "Where the asphalt is sound, DuraShield's own condition is met." lib/products.ts:326.
- "ask HUB for the specification for your site": the standard's own wording for a fact the sources do not give.

## Questions for whoever quotes the parking lot sealcoating

- Question 1's fact, "DuraShield's page names fuel, oil and de-icing agents": lib/products.ts:330 `{ label: "Chemical resistance", value: "Fuel, oil, de-icing agents" }`. The other questions state no facts.

## The close

- Spec sheets on Resources: public/docs/DuraShield/ (two DuraShield TDS sheets), public/docs/StreetBond/, public/docs/StreetBondSR/ (specification, colour guide, brochure); lib/field-note-facts.ts:32.
- "the contact page reaches both offices": lib/field-note-facts.ts:31–32.

## Links (each checked)

/products/durashield, /products/streetbondsr, /products/streetbond (lib/products.ts); /blog/parking-lot-line-painting-vs-thermoplastic (published); /resources, /contact (app/ routes).

## Photo

Uploaded from the repo: public/catalogue/2026-27/p036-2000.webp, the photograph on the book's DuraShield page (2000 x 2000). It shows the coated lot in Etobicoke, wet, with the commercial building, a planted island and a pickup behind. Crop bottom 0.08 removes the caption the page prints on the photo ("Etobicoke, Ontario", at about 97% down; lib/idea-book-edition.ts stops its photo bands at 0.92 for the same reason). Hotspot x 0.5, y 0.48, w 0.5, h 0.5, on the coated surface just below the island, so a wide crop shows the lot and the building's base, not the sky.

Why not the others: the fleet lot's Studio copy (lib/map-projects.ts:1461) is 1280 px; the DuraShield gallery's lot photos are 1200 px and show US sites (an Ingles grocery lot, a Chrysler dealership); the DuraShield product hero is a residential driveway (the old stand-in, used on the driveway piece instead).

## What was left out

- The Pacoima cool-pavement study (lib/insights-evidence.ts): it bears on parking lots, but it measures a GAF coating it does not name and says nothing about upkeep, which is this piece's question.
- No cost, cycle length, coverage or cure time for a sealcoat or for DuraShield: none in the sources.
- The 7 Oct version's "Canada's top REITs" line and its link to the REIT post are gone.
