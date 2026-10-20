# Sources: Fill the cracks and potholes before the first freeze

/blog/asphalt-crack-filler-cracks-joints-potholes · unpublished draft, replaced: drafts.blogpost-asphalt-crack-filler-cracks-joints-potholes

Each statement about HUB, a system, a number, a place, a client or a year, then the line it rests on. The three repair products are not in the Product Portfolio Book's ten systems (lib/product-catalogue.ts:151–152: "The four systems the book does not cover (AirMark, ChipFill, AggreFill, Fast Patch DPR) have no line here"), so every product fact is from lib/products.ts. Line numbers are on origin/main at 7ac98af.

## First paragraphs

- The October walk (a crack across a drive aisle, a joint opening at a curb, a small pothole) and what a Canadian winter does to each (water runs in, freezes, pushes the edges apart; an open joint lets water under the pavement; tires and plow blades break a pothole's edges): the reader's scene and general context in plain words, no numbers, no claim about HUB. There is no documented repair job on the map, so the piece leads with the scene.

## Asphalt crack filler for the crack and the open joint

- "ChipFill's product page names what it is best for: smaller potholes, cracks and joints."
  - lib/products.ts:436 `{ label: "Best for", value: "Smaller potholes, cracks, joints" }`.
- "It is thermoplastic in small chips. They are poured in, levelled and heated with a propane torch, and once heated they conform to the shape of the damage and bond to the surrounding asphalt or concrete, sealing out the water that drives freeze-thaw damage."
  - lib/products.ts:429: "ChipFill is thermoplastic in small chips: poured into the prepared hole, levelled and heated with a propane torch ... Once heated, it conforms to the shape of the damage and bonds to the surrounding asphalt or concrete, sealing out the water that drives freeze-thaw damage."
- "It needs no specialized equipment and no hot-mix plant, it can go in year-round in any weather, and the lane reopens to traffic within minutes."
  - lib/products.ts:429: "so it needs no specialized equipment and no hot-mix plant ... It can be installed year-round in any weather, and the lane reopens to traffic within minutes."; :434–435 "Weather: Any, year-round", "Back in service: Minutes".
- "The page lists edge joints among its uses, with patrol patching, emergency repairs and utility cuts, on roads, parking lots, sidewalks and pathways."
  - lib/products.ts:429: "It is used for patrol patching, emergency repairs, utility cuts and edge joints on roads, parking lots, sidewalks and pathways."
- "Where the joint runs along a concrete slab whose edge has spalled, Fast Patch DPR is the product whose page names both spalls and joints, in asphalt and in concrete."
  - lib/products.ts:515: "Fast Patch DPR is a distressed pavement repair material for asphalt and concrete: a pourable polymer blend of recycled and renewable materials for high-strength repairs to potholes, spalls, joints, wheel paths and utility cuts."

## The small pothole, and the one that is not small

- "ChipFill's page leads with potholes: thermoplastic chips for pothole repair, heated in place, year-round and in all weather."
  - lib/products.ts:404 shortDesc: "Thermoplastic chips for permanent pothole repair, heated in place. Year-round, all-weather." ("permanent" left out: docs/GLOSSARY.md lists "Permanent, permanently" among claims that need a source.)
- "A small pothole takes it the same way a crack does, and traffic is back within minutes."
  - lib/products.ts:436 "Smaller potholes"; :429 the method; :435 "Back in service: Minutes".
- "Where the hole is too deep or wide for ChipFill alone, AggreFill fills the void. It is a pre-coated aggregate, poured cold, and the repair is finished with the torch and ChipFill, which bonds the aggregate and seals the repair flush."
  - lib/products.ts:475: "AggreFill is a pre-coated aggregate filler used with ChipFill ... Where the damage is too deep or wide for ChipFill alone, AggreFill fills the void and ChipFill bonds the aggregate and seals the repair flush. The system goes in cold and is finished with a heat torch"; :478 "How it goes in: Poured cold, finished with a torch and ChipFill"; :480 "Best for: Potholes too deep or wide for ChipFill alone".
- "Like ChipFill on its own, it goes in year-round, and the lane reopens within minutes."
  - lib/products.ts:475: "Like ChipFill on its own, it can be installed year-round in any weather, and the lane reopens to traffic within minutes."; :481 "Back in service: Minutes".
- "Fast Patch DPR is the third: a pourable polymer blend for potholes, spalls, joints, wheel paths and utility cuts, mixed, poured and finished with minimal site preparation."
  - lib/products.ts:515 (above) and "With minimal site preparation"; :494 seoDescription "Mix, pour, finish".
- "Its page gives the return to service as about an hour at 21°C."
  - lib/products.ts:519 `{ label: "Return to service", value: "About 1 hour at 21°C" }`; :515 "back in service in about an hour at 21°C".
- "In cooler conditions the optional Fast Patch Kicker accelerator shortens the cure, so the work can go on year-round."
  - lib/products.ts:515: "the optional Fast Patch Kicker accelerator shortens the cure in cooler conditions so the work can go on year-round"; :520 "Cold weather: Fast Patch Kicker accelerator shortens the cure".
- "It bonds to the surrounding pavement and is freeze-thaw resistant, and because it is odourless and 100% solids, it also goes indoors, on warehouse floors."
  - lib/products.ts:515: "bonding to the surrounding pavement, and freeze-thaw resistant for colder climates. Because it is odourless and 100% solids, it can be used indoors, on warehouse floors".

## Before the first freeze (the checklist)

- Each line maps a mark to a product by the same lines: ChipFill :436; AggreFill :480; Fast Patch DPR :515 ("spalls ... wheel paths and utility cuts"); the closures :435, :481, :519, :520.

## The close

- "The product flyers for ChipFill, AggreFill and Fast Patch DPR are on Resources": public/resources/flyers/HUBSS-Flyer-chipfill-v01.pdf, HUBSS-Flyer-aggrefill-v01.pdf, HUBSS-Flyer-fast-patch-v01.pdf (app/resources/page.tsx lists the 14 flyers). They are flyers, not spec sheets, and the piece says so.
- "the contact page reaches both offices": lib/field-note-facts.ts:31–32.

## Links (each checked)

/products/chipfill, /products/fast-patch, /products/aggrefill (lib/products.ts); /blog/parking-lot-sealcoating-vs-maintenance-coating (published); /resources, /contact.

## Photo

image-e58314023b6dbcf9a565b90b8221063b41781da2-1480x912-jpg: Studio's Fast Patch DPR product hero, alt there "A finished Fast Patch DPR repair, a patch of fine grey aggregate set flush in the surrounding pavement". It shows a finished patch set flush in worn pavement: a repair, the subject. 1480 px wide, under the 1600 asked for: no repair photo in Studio or the repo reaches 1600 (the next largest are ChipFill's 1400 x 392 strip and 1200 x 900 pour). No hotspot existed; set at x 0.45, y 0.5, w 0.5, h 0.5, on the patch.

## What was left out

- Any numbers for winter damage (the brief asked for plain words).
- How deep or wide "too deep or wide for ChipFill alone" is: lib/products.ts:447 notes "Up to 1 m²" was dropped as unsourced, so no size is given.
- Surface preparation beyond "the prepared hole" and "minimal site preparation": the pages give no more.
- Cure or open times for ChipFill and AggreFill beyond "minutes", and for Fast Patch DPR at any temperature but 21°C.
