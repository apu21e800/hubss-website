# Sources: StreetBond colour on the Bear Creek Park spray park in Surrey

/blog/bear-creek-park-spray-park-surrey · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/bear-creek-park-spray-park-surrey.md` · 28 Oct 2026

Map job 10 of the 40 with no write-up. The slug is the one the map is pointed at. Line numbers are on branch feat/map-posts as it stood on 28 Oct 2026. The book gives this job a short paragraph of its own, and the post is built round its two sentences; it stops at about 215 words (the dry run's count), because the system facts it could add beyond that are the ones the other splash pad drafts already carry.

## What the record holds

- lib/map-projects.ts:569–586, `surrey-bear-creek-spray-park`. Comment (:570–571): "Product Book p.129: "Waterpark surface coating... Bear Creek Park, Surrey, British Columbia | StreetBond". OpenStreetMap maps the splash pad here." Title "Bear Creek Park spray park" (:573), Surrey, BC (:574–575), product StreetBond (:578), application Splash Pads (:579), no year, not `approximate`, one photo, cdn("adc864c3b43a4cb05e0397f1406ca14610d74d22-2400x1800.jpg"), "applications/splash-pads/splash-pads-26 (Product Book p.129)" (:581), ideaBookPage 129 (:583), excerpt "StreetBond on the Bear Creek Park spray park, holding vivid colour and a slip-resistant texture under constant water and bare feet." (:585).
- lib/idea-book-edition.ts:445, leaf `victoria-surrey` (pages 128–129): `project({ page: 129, eyebrow: "Splash pads", title: "Waterpark surface coating.", body: "Constant water, chemical treatments, and bare feet make waterparks one of the harshest environments in outdoor pavement. StreetBond builds a slip-resistant texture that meets wet-surface safety expectations while holding vivid colour season after season.", caption: { place: "Bear Creek Park, Surrey, British Columbia", system: "StreetBond" }, mapId: "surrey-bear-creek-spray-park" })`. The record names this job's mapId and its photo is this job, so the page is tied to it.
- The printed page, public/catalogue/2026-27/p129-1400.webp, read as an image: the photograph, then "SPLASH PADS", "Waterpark surface coating.", the two sentences above word for word, and the caption "Bear Creek Park, Surrey, British Columbia | StreetBond".
- lib/idea-book-print.ts:278–288 (the splash pads spread, book p.60) and :104–116 (StreetBond, p.25), both renders read; lib/applications.ts:150–161; lib/products.ts:134–183.
- The photo: the cdn file above, downloaded and read (2400x1800). The same frame the book prints on p.129 (the book crops it).

## Left out, and why

- Install year, client (the park's owner), installer, designer, area, cost: no record gives one.
- What the fish, leaves and flowers stand for, and whether the fish are a particular species or a particular artist's: no record says, so they are described as the photograph shows them.
- The facing page, p.128 (Victoria): another job, not tied to this one.
- The splash pads spread's headline ("Slip-resistant. Cool underfoot. Vivid colours."): three stacked fragments (docs/STYLE.md, the lint's fragment rule); its "Laughter for years to come!": an exclamation. Neither quoted.
- StreetBondSR (the spread's second system), the spread's pull line ("uniquely demanding") and the textured build on prepared concrete (lib/applications.ts:158): the caption names StreetBond, and the Maple Ridge and Saint-Antoine splash pad drafts carry those lines, so this post keeps to page 129's own words.
- The published article on coatings for waterparks (durable-coatings-waterparks) is the same subject, but its figures ("Over the last 5 years", "over 25 years of history") are not the book's, so it is not linked.

## First paragraph

- The opening quote: lib/idea-book-edition.ts:445 (body, first sentence); the p.129 render.
- "That is the first sentence on page 129 of the Product Portfolio Book · Volume 5, printed under a photograph of the spray park at Bear Creek Park in Surrey, British Columbia": the p.129 render (the text sits under the photograph); lib/map-projects.ts:573–575.
- "The caption names the HUB Surface Systems coating on it: StreetBond": lib/idea-book-edition.ts:445 (caption); lib/map-projects.ts:578; StreetBond is one of HUB's systems (lib/products.ts:135).

## Blue and green ribbons on pale concrete

- All of it is what the photograph plainly shows: a view from above; blue and green ribbons winding across pale concrete; pale fish drawn in the blue; a green band on the right with yellow flowers and leaves; a round blue island ringed in green under a large tree in the middle; a yellow arch and an orange ball among the ribbons; children and adults on the pad.

## The coating on the pad

- "The book's splash pads spread lists StreetBond as skid resistant and UV stable": lib/idea-book-print.ts:283 ("Skid resistant, UV stable"; lowercase on the printed page), paraphrased. The job's application is Splash Pads (lib/map-projects.ts:579).
- "The book gives this water-based, epoxy-modified acrylic 8+ years of service and calls it easily refreshed": lib/idea-book-print.ts:109 (type), :112 (printed label "Life cycle", value "8+ years / easily refreshed"; written as service, per docs/GLOSSARY.md:42); lib/products.ts:163, :167.
- "Page 129 heads its own text “Waterpark surface coating.”": lib/idea-book-edition.ts:445 (title); the p.129 render.
- "After the sentence about harsh environments, it turns to the coating: “StreetBond builds a slip-resistant texture that meets wet-surface safety expectations while holding vivid colour season after season.”": :445 (body, second sentence). "Slip-resistant" is the book's word (docs/GLOSSARY.md:34); the post makes no promise of its own. The close is the book's own words on the job's page.

## Links (each checked)

/product-book/129, /products/streetbond (first mention), /applications/splash-pads. Each once. No outside links.

## Photo

image-adc864c3b43a4cb05e0397f1406ca14610d74d22-2400x1800-jpg, already in Studio (applications/splash-pads/splash-pads-26, the map's photo). The dry run found it at 2400x1800. Alt: "Blue and green StreetBond ribbons on the spray park at Bear Creek Park, Surrey, British Columbia" (StreetBond and the place from the book's caption and the map). Hotspot x 0.5 y 0.6 w 0.95 h 0.6, on the pad, which fills the lower two thirds of the frame.
