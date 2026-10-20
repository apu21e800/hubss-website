# Sources: When the driveway needs sealing again, look at the asphalt first

/blog/driveway-sealing-vs-maintenance-coating · unpublished draft, replaced: drafts.blogpost-driveway-sealing-vs-maintenance-coating

Each statement about HUB, a system, a number, a place, a client or a year, then the line it rests on. "Book" is the Product Portfolio Book, Volume 5, as code. Line numbers are on origin/main at 7ac98af.

## First paragraphs

- The grey driveway, the weekend of sealing, and what a coat of sealer does ("brings back the black and slows the sun and water down", "wears off first where the tires turn"): the homeowner's scene and general context in plain words, with no numbers and no claim about HUB or another brand.

## A maintenance coating, for asphalt that is sound

- "The Product Portfolio Book calls DuraShield a pavement maintenance coating and lists driveways among its uses."
  - lib/idea-book-print.ts:171 (page 37) title "Pavement maintenance coating."; :180 uses "Parking", "Driveways", "Pathways", "LEED sites".
- "The book describes a coating that resists fuel, oil and de-icing agents, cools the surface, and protects the pavement underneath, extending its service life."
  - lib/idea-book-print.ts:173: "A maintenance coating for asphalt. Resists fuel, oil and de-icing agents, cools the surface, and protects the substrate underneath, extending the service life of the pavement." ("the pavement underneath": docs/GLOSSARY.md, substrate, for the public.)
- "Its specification line is shorter still: preserves and protects asphalt, old and new."
  - lib/idea-book-print.ts:178: "Applications: Preserves and protects asphalt, old and new".
- "It is a two-component epoxy-modified acrylic, and its solar-reflective option, SR Gray, is 0.35 on the 2026 colour card."
  - lib/idea-book-print.ts:172 "Two-component epoxy-modified acrylic. Solar-reflective options."; lib/products.ts:331 "Optional (SR Gray 0.35 on the 2026 colour card)".
- "The book's townhome pages specify the same coating for shared-drive maintenance."
  - lib/idea-book-print.ts:364 (page 74, Townhomes): `{ slug: "durashield", note: "Shared-drive maintenance" }`.
- "HUB's Residential Driveways page says when it fits: where an older driveway is sound but tired, DuraShield protects it and extends its service life."
  - lib/applications.ts:211: "Where an older driveway is sound but tired, DuraShield maintenance coating protects it and extends its service life."
- What "sound" means (trouble on top; flat, draining, nothing sinking or breaking up): general context, because docs/GLOSSARY.md (substrate) says not to write "sound pavement" without saying what that is.

## When stamped asphalt is the better answer

- "The Product Portfolio Book opens its projects section on the laneways of Oxford Townhomes in New Westminster, British Columbia: charcoal StreetPrint on a strata's shared drives."
  - lib/idea-book-edition.ts:274–277: divider leaf `projects`, pages [80, 81], photo "StreetPrint laneways at the Oxford Townhomes, New Westminster, British Columbia", caption "New Westminster, British Columbia".
  - lib/map-projects.ts:519–537, `new-westminster-oxford`: comment "Product Book p.80 ... Oxford Townhomes, 728 Ewen Ave, Queensborough", product "StreetPrint", application "Townhomes", excerpt "Charcoal StreetPrint on the strata laneways of Oxford Townhomes in Queensborough."
- "Its driveway page starts from a line a homeowner will recognize: most driveways fail on appearance long before they fail on structure."
  - lib/idea-book-print.ts:371 (page 76): statement "Most driveways fail on appearance long before they fail on structure."
- "StreetPrint ... works with the asphalt already there. Infrared heaters bring it back to a workable temperature, a steel wire-rope template presses a cobblestone, brick, herringbone or slate pattern into it, and StreetBond pavement coating colours it, with no removal, no repaving and no excavation."
  - lib/idea-book-edition.ts:188–190 (pages 20–21, "Reheat. Stamp. Coat."): "Infrared heaters bring the existing asphalt back to a workable temperature: no removal, no repaving, no excavation." "Flexible templates stamp the selected pattern ..." "StreetBond creates the colour, and seals the asphalt ..."
  - lib/applications.ts:211: "StreetPrint works on the asphalt already there: the surface is reheated, a steel wire-rope template presses a cobblestone, brick, herringbone or slate pattern into it, and StreetBond pavement coating colours it in the owner's choice of colour."
- "The surface stays flush, so there is nothing for a plow blade to catch, no joints to weed and no pavers to settle, and the asphalt stays flexible."
  - lib/idea-book-print.ts:94 (page 19): "The surface stays flush: no slip, no trip. Nothing for a plow blade to catch, no joints to weed, no pavers to settle, asphalt stays flexible."
- "The book gives StreetPrint a service life of 10–20 years"
  - lib/idea-book-print.ts:98 "Service life: 10–20 years".
- "years on, the colour is renewed with a fresh coat"
  - lib/applications.ts:211: "Years on, the colour is renewed with a fresh coat."
- "sound pavement takes a pattern, and failing pavement needs to be addressed first"
  - Post how-stamped-asphalt-is-installed (published 8 Sep 2026): "Sound pavement takes a pattern; failing pavement needs to be addressed first."
- "the book's base line for StreetPrint is new or existing asphalt"
  - lib/idea-book-print.ts:99 "Base: New or existing asphalt".

## Driveway sealing, by what the driveway shows (the table)

- Row 1, "A reseal, or a DuraShield maintenance coating": lib/applications.ts:211 and lib/products.ts:326 ("where the asphalt is sound").
- Row 2, "StreetPrint, stamped into the asphalt already there": lib/applications.ts:211.
- Row 3, "The base first, and StreetPrint can go into the new asphalt": the installation post's "failing pavement needs to be addressed first"; lib/idea-book-print.ts:99 "New or existing asphalt".

## The close

- Spec sheets on Resources: public/docs/DuraShield/ (TDS sheets), public/docs/streetprint/ (specification, colour guide, FAQ, template catalogue); lib/field-note-facts.ts:32.
- "the contact page reaches HUB's East and West offices": lib/field-note-facts.ts:31.

## Links (each checked)

/products/durashield, /products/streetprint (lib/products.ts); /blog/how-stamped-asphalt-is-installed, /blog/residential-driveways-stamped-asphalt, /blog/residential-driveways-stamped-asphalt-upgrade (published; the two driveway guides were read, and this piece does not repeat their interlocking-stone comparison or their upgrade case); /resources, /contact.

## Photo

image-920f58aaaeef3ae6aa58698b3809eb0249022243-2400x1607-jpg: Studio's DuraShield product hero (`*[_type=="product" && slug.current=="durashield"].heroImage`), alt there "Fresh DuraShield maintenance coating on a residential driveway running from the street to a carport, evergreen shrubs along one side"; the same asset is residential-driveways-06 in the Residential Driveways gallery. It shows a plain, freshly coated driveway from the street to a carport: the subject of a piece about driveway sealing. 2400 px wide. No hotspot existed; set at x 0.55, y 0.7, w 0.5, h 0.5, on the coated driveway surface.

## What was left out

- Parc Riviera Mews in Richmond: a StreetBond walkway between townhomes (lib/map-projects.ts:412–431). The driveway spread specifies StreetPrint alone (lib/idea-book-print.ts:373), so a StreetBond-only surface is not offered to a homeowner here.
- No cost, cure or drive-on time, and no install time: the 30 Mar driveway guides give some, but the book and the pages do not.
- The Oxford laneways' install year: none in the sources.
