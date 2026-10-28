# Sources: Every Child Matters in white script on an Ontario crosswalk

/blog/every-child-matters-crosswalk-kitchener · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/every-child-matters-crosswalk-kitchener.md` · 27 Oct 2026

The write-up for the homepage map's pin `kitchener-every-child-matters` (map job 19 of the 40 without one). Each statement about HUB, a system, a place or the photograph, then the line it rests on. Line numbers are on feat/map-posts at fede3fd. The printed pages were read from their renders (public/catalogue/2026-27/p056, p057, p011) and the PDF's text layer.

## Read this first: the town is not named, on purpose

The two records disagree on where this crosswalk is. The printed book captions the photograph on p.57 "London, Ontario" (render and text layer; lib/idea-book-print.ts:263). The map places it in Kitchener, at Water Street and Jubilee Drive by Victoria Park, unveiled in September 2022, because CBC's photos of Kitchener's Victoria Park crosswalk "show the same design, speed sign and overhead sign" (lib/map-projects.ts:1013–1016, :1019, :1025, :1031); the map's comment flags it for Doug, and CLAUDE.md records it as Doug's to settle. The brief says the book wins and that a fact two records disagree on is left out, so the post names neither town, nor the streets, the park or the date, and says only what both records agree on: Ontario. The slug still says kitchener, as the brief requires (the map points at it).

Once Doug says which town it is, three edits finish the post. If Kitchener: the title becomes "Every Child Matters in white script on a Kitchener crosswalk"; the first paragraph's "This Every Child Matters crosswalk in Ontario fills page 57" becomes "This Every Child Matters crosswalk by Victoria Park in Kitchener, Ontario, unveiled in September 2022, fills page 57"; the alt's "in Ontario" becomes "in Kitchener, Ontario". If London: the same three with London, without the park, the streets or the date (they come from the Kitchener identification), and the map pin and slug move too.

The question and these edits are put to Doug in the note he reads in Studio (`forDoug`, printed as "To confirm before Publish: ..."), in two lines:
- "The book's caption on page 57 places this crosswalk in London, Ontario, but the photograph matches the Every Child Matters crosswalk by Victoria Park in Kitchener. Which town is it? Until you say, the post names neither.": p.57's caption (lib/idea-book-print.ts:263); the map's comment and entry (lib/map-projects.ts:1013–1016, :1018–1019, :1031).
- "If it is Kitchener, the title, the first paragraph and the photo description will name Kitchener, with Victoria Park and the September 2022 unveiling. If it is London, they will name London only, and the map pin and the page's web address will change to match.": the three edits above, in plain words ("the page's web address" is the slug); "unveiled in September 2022" is the map's excerpt (:1031).

## What the record holds

- lib/map-projects.ts:1012–1032. Comment (:1013–1016) as above, and "Product from the facing Creative Design spread (p.56: TrafficPatterns, custom designs)." Entry: title "Every Child Matters crosswalk, Victoria Park" (:1018), city Kitchener, ON (:1019–1020), product TrafficPatterns (:1023), application Community Branding (:1024), year 2022 (:1025), photo cdn 7eb436ff…-1184x864 (:1027, applications/parks-paths), ideaBookPage 57 (:1029), excerpt "An Every Child Matters crosswalk at Water Street and Jubilee Drive by Victoria Park, unveiled in September 2022." (:1031). Not approximate.
- The book: lib/idea-book-edition.ts:242–246, the creative design leaf, pp.56–57, mapId "kitchener-every-child-matters", photo p.57 with the alt "The Every Child Matters crosswalk in TrafficPatterns". The words (lib/idea-book-print.ts:255–265; render of p.56): eyebrow "Creative design", title "Seen from the sidewalk as well as the driver's seat.", statement "An Indigenous-designed crossing: intricate line work that reads as art up close and as high-visibility contrast for drivers." (an em dash in print), body "Preformed thermoplastic can reproduce artwork while holding the contrast, grip and visibility a crossing is designed for.", SPECIFY TrafficPatterns "125 mil preformed: custom designs" and DecoMark "125 mil preformed custom graphics", "Application 06". The render of p.57 was looked at: its photograph is the map's photo, cropped square.

## First paragraph

- "A driver coming up to this crosswalk sees a band of orange across the road, edged in white. Someone on the sidewalk can read what is on it: the words "every child matters" in white script, and a white drawing of a shoe whose lace runs out into one long line around them.": the photograph (the map's 1184 px copy and p.57), looked at, with close crops of the lettering and the drawing; the two readers are the book's own frame, p.56's title and statement. No meaning is given to the colour or the drawing: no record states one.
- "This Every Child Matters crosswalk in Ontario fills page 57 of the Product Portfolio Book · Volume 5, opposite a page headed "Seen from the sidewalk as well as the driver's seat."": lib/idea-book-edition.ts:243–245 (the record names this job's mapId, and its photograph is this job, a full-page photograph); p.56's title, word for word. "in Ontario": p.57's caption and lib/map-projects.ts:1020 agree on the province. The book's full name at its first mention: lib/catalogue.ts:77. "HUB Surface Systems'": the book is HUB's; HUB's two mentions were in sentences cut on 28 Oct 2026, so the company is named here, in full. The three ready-made edits above still apply word for word.
- "It is TrafficPatterns preformed thermoplastic.": lib/map-projects.ts:1023; the edition's alt for p.57 (lib/idea-book-edition.ts:245); p.56's SPECIFY list names it first. The printed caption on p.57 names no system.

## Line work that reads at two distances

- "The facing page is the book's creative design page, Application 06, and it calls this crosswalk Indigenous-designed, with "intricate line work that reads as art up close and as high-visibility contrast for drivers."": p.56's eyebrow, its "Application 06" and its statement (lib/idea-book-print.ts:257), quoted from after the dash; the word before the dash, "crossing", is the book's and is not quoted.
- "For that kind of work the page specifies TrafficPatterns for custom designs and DecoMark for custom graphics, both 125 mil preformed thermoplastic.": p.56's SPECIFY list (lib/idea-book-print.ts:259–262).
- "In the photograph, more white line work runs along the far end of the band, and a park in autumn colour lines one side of the road. A speed limit sign reading 40 stands on a post by the sidewalk; over the road hangs a sign with a walking figure.": the photograph, looked at.
- Cut on 28 Oct 2026: "On HUB Surface Systems' site it sits with the community branding work." (the map's application, lib/map-projects.ts:1024; the same filing sentence ran in most of the forty map posts), and the sentence on the Georgina Every Child Matters crosswalk (/blog/every-child-matters-crosswalk): its photograph carries the same artwork, so it put a third town beside the two the records already dispute.

## Made to the artwork in the factory

- "The artwork goes into the material at the factory. TrafficPatterns is preformed thermoplastic made to the design, 125 mil thick, and on site the finished pieces are heat-applied to the road, where they bond to its surface.": lib/products.ts:119 ("factory-made to your design at 125 mil and heat-applied to asphalt or concrete, where it bonds to the surface"); p.11, Thickness 125 mil (lib/idea-book-print.ts:70); p.56 ("Preformed thermoplastic can reproduce artwork", lib/idea-book-print.ts:258); docs/GLOSSARY.md, "preformed thermoplastic" and "heat-applied".
- "The anti-skid grit is mixed right through the material, so the crosswalk keeps its grip as it wears.": p.11 ("Anti-skid aggregate is intermixed through the full cross-section, so the grip lasts as long as the colour.", lib/idea-book-print.ts:68); docs/GLOSSARY.md, "anti-skid aggregate" ("Hard grit mixed right through the thermoplastic, so grip stays as the surface wears"). In other words, because many drafts quote p.11's line whole.
- "The book's TrafficPatterns page (page 11) lists a skid resistance of 60 BPN, measured to ASTM E303; the service life it gives is 8+ years.": p.11 (lib/idea-book-print.ts:71, :73); link /product-book/11.
- "The spread, page 56 with this photograph opposite on page 57, is in the Product Portfolio Book online.": lib/idea-book-edition.ts:243 (pages [56, 57]); link /product-book/56. The post ends on the book page.
- p.11's subhead ("You design it, we build it, our certified installers make it last.") is not quoted: another draft quotes it.

## Links (each checked)

/products/traffic-patterns and /products/decomark (first mentions), /product-book/11, /product-book/56. The dry run resolves the product and both applications (community-branding, crosswalks), which are set in relatedApplications. None of the seven guides the brief bars is linked.

## Against the other posts

A seven-word-run check against the 77 published posts and every other draft in content/drafts (27–28 Oct 2026) finds no shared run but the book's name.

## Photo

image-7eb436ffcc1df43c83a445ce82f62b5d3767b4f9-1184x864-jpg, already in Studio: the map's own photo of the job, the same photograph the book prints on p.57. 1184 px wide, under 1600: no larger copy is in Studio or the repo (the book's page render is the same photo, cropped, with the caption printed on it). Alt: what it shows, with TrafficPatterns (the map and the edition) and Ontario (where the two records agree). Hotspot x 0.5 y 0.72 w 0.6 h 0.55, on the band and its lettering in the lower half.

## Left out

- The town (Kitchener in the map's record, London in the book's caption), with Victoria Park, Water Street and Jubilee Drive and "unveiled in September 2022", which all come from the Kitchener identification: see the first section.
- The Georgina Every Child Matters crosswalk (every-child-matters-crosswalk, published): not linked. Its photograph carries the identical artwork, so naming it would put a third town beside a disputed one.
- The designer, the client and the installer: no record names them. The © mark in the photograph is not mentioned.
- What Every Child Matters stands for, and any meaning for the orange or the shoe: no record of this job states one (lib/field-note-drafter.ts:88, ATTENTION: "give the meaning only as they state it").
- Whether DecoMark is part of this crosswalk: p.56 specifies it for this kind of work, but no record says it was used here, so it is not listed as a related product.
