# Sources: Cold patch asphalt makes a pothole safe until it can be repaired

/blog/cold-patch-asphalt · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/cold-patch-asphalt.md` · 21 Oct 2026

The plan item is Studio → Blog ideas → "Asphalt patch: cold patch, hot mix or a permanent repair product" (storyIdea-asphalt-patch, set to Drafted by Vern on 21 Oct so the Thursday run takes the Remembrance Day idea). Vern, 21 Oct: "we should do the cold patch article". Each statement about HUB, a system, a number, a place or a year, then the line it rests on. The three repair products are not in the Product Portfolio Book's ten systems, so every product fact is from lib/products.ts (line numbers on main at 2ef795a). The two city pages were read in full on 21 Oct 2026; the quotes are copied from the pages' text.

## Why this piece, and how it differs from the crack filler guide

- Semrush, Canada, 21 Oct 2026: "cold patch asphalt" 1,000 a month (KD 24), "asphalt cold patch" 480, "asphalt patch" 480, "cold patch" 390, "hot mix asphalt" 880, "cold mix asphalt" 170. The crack filler guide (/blog/asphalt-crack-filler-cracks-joints-potholes) targets "asphalt crack filler" (880) and "pothole repair" (720).
- The crack filler guide walks a lot in October and matches each mark to a product. This piece starts at the pothole that has already opened in winter and the choice of route (cold patch, hot mix, a repair product), keeps the products to a paragraph each and links the crack filler guide for the rest. No paint anywhere.

## First paragraph

- The January pothole by the entrance, the bag of cold patch in the shed, the contractor's "wait for spring": the reader's situation, no claim about HUB. There is no documented repair job on the project map, so the piece leads with the decision.

## What cold patch asphalt is for

- Toronto: "During winter months when temperatures are low and pavement is covered with snow/ice, it is extremely difficult to work with hot asphalt because it cools very quickly. Potholes are temporarily patched with cold mix asphalt to make the road safe." https://www.toronto.ca/services-payments/streets-parking-transportation/road-maintenance/potholes/ (the piece paraphrases the first clause outside the quotes and quotes the rest word for word).
- Greater Sudbury: "Cold mix can be applied directly under all weather conditions, but is susceptible to road bed movement, vehicle traffic and snow removal operations." https://www.greatersudbury.ca/live/transportation-parking-and-roads/road-maintenance/potholes/
- "it fills the hole tonight, by hand, in whatever weather there is, and makes the lane safe to drive": Sudbury's "all weather conditions", Toronto's "to make the road safe" and its crews' method ("Crews place asphalt and rake it into the pothole. Then they tamp down the asphalt"). The spring list and the look after the plows: advice drawn from the two pages, no claim about any product.

## Hot mix, when the plants are open

- Greater Sudbury: "Hot mix patching is the more cost effective form of pothole repair. However, during the winter, local asphalt plants shut down, therefore cold mix patching and recycled asphalt patching is used." and "Due to this freeze-thaw cycle, pothole issues are most common in the late winter and early spring."
- Toronto: "More permanent repairs are performed with hot asphalt when warmer conditions prevail." ("Permanent" is the city's word about hot asphalt, quoted; the piece never calls a HUB product permanent: docs/GLOSSARY.md lists the word among claims that need a source.)
- "Hot mix is asphalt made hot at a plant, then placed and compacted by a paving crew while it is still hot": what hot mix is, in general terms; Toronto's "it cools very quickly" is why it must go in hot.
- "it is the repair both cities make" when the plant is open: Sudbury's "We predominantly use hot mix asphalt patching ... depending on the time of year" and Toronto's line above.

## A repair that goes in year-round

- ChipFill "Any, year-round": lib/products.ts:434. "Back in service: Minutes": :435. "no specialized equipment and no hot-mix plant": :429. "Smaller potholes, cracks, joints": :436.
- "one of HUB's three repair products, and all three go in year-round": lib/product-categories.ts:84–91 (Asphalt & Concrete Repair: chipfill, aggrefill, fast-patch; "deployable year-round", which its comment says every member states); ChipFill :434, AggreFill :482 ("Any, year-round"), Fast Patch DPR :515 ("so the work can go on year-round").
- "thermoplastic in small chips, poured into the prepared hole, levelled and heated with a propane torch until it bonds to the asphalt or concrete around it": :429 ("poured into the prepared hole, levelled and heated with a propane torch ... Once heated, it conforms to the shape of the damage and bonds to the surrounding asphalt or concrete").
- AggreFill "fills the void: a pre-coated aggregate, poured cold and finished with the torch and ChipFill, which bonds the aggregate and seals the repair flush": :475 and :478. "parking lot craters and deep road failures": :475. "the lane reopens within minutes": :475, :481.
- Fast Patch DPR "a pourable polymer blend for potholes, spalls, joints, wheel paths and utility cuts in asphalt and concrete": :515. "about an hour at 21°C": :519. "the optional Fast Patch Kicker accelerator shortens the cure in cooler conditions": :515, :520. "odourless and 100% solids, it also goes indoors, on warehouse floors": :515.
- "the repair in the photo at the top of this page": the photo is the Fast Patch DPR page's own hero, /images/products/fast-patch/fastpatch-repaired.jpg (lib/products.ts:499).

## The checklist and the close

- Each line uses the facts above. "in any month" stands for "year-round" (ChipFill and AggreFill say "Any, year-round"; Fast Patch DPR says the Kicker lets the work "go on year-round"), so no product is said to go in "in any weather" that doesn't say so.
- The flyers: public/resources/flyers/HUBSS-Flyer-chipfill-v01.pdf, -aggrefill-v01.pdf, -fast-patch-v01.pdf, listed on /resources (lib/resource-documents.ts:1075, 1090, 1105). The contact page reaches both offices.

## Links (each checked)

/products/chipfill, /products/aggrefill, /products/fast-patch, /resources, /contact; /blog/asphalt-crack-filler-cracks-joints-potholes (a draft on 21 Oct: publish it before this piece, or the link 404s until it is live); the two city pages, each linked once.

## Photo

image-230baf755f95941bc159ccf0a3624d32d88298bb-1480x912-jpg, already in Studio (fastpatch-repaired.jpg, the same file as the Fast Patch DPR page's hero): a finished Fast Patch DPR repair seen from above, level with the pavement around it. The crack filler guide wears the ChipFill pour (image-576a…-1200x900), so the two pieces don't share a photo. The supplier's kit photo (fastpatch-bucket.jpg) was not used: it shows the maker's branding. 1480 px wide, under the 1600 asked for: no photo of the three products in Studio or the repo reaches 1600. Hotspot x 0.5 y 0.5 w 0.8 h 0.9, on the patch, which fills most of the frame.

## Left out

- Any number for cold patch or hot mix (how long a cold patch lasts, what either costs): the city pages give none that apply to a lot, and the brief asked for none.
- Toronto's "15-20 minutes" for a crew's patch and "within four days" of a report: the city's own service figures, not the reader's.
- Cure or open times beyond "minutes" (ChipFill, AggreFill) and "about an hour at 21°C" (Fast Patch DPR).
