# Sources: A TrafficPatternsXD crosswalk in Oakville labelled year 1 and year 10

/blog/oakville-crosswalk-ten-years · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/oakville-crosswalk-ten-years.md` · 28 Oct 2026

The write-up for the homepage map's pin `oakville-ten-years` (job 23 of the 40 without one). Each statement about HUB, a system, the place or the photographs, then the line it rests on. Line numbers are on feat/map-posts at fede3fd. The printed pages were read from their renders (public/catalogue/2026-27/p072, p073, p013, p016, p017 and p086), and both photos were downloaded from Sanity's CDN and looked at.

## What the record holds

- lib/map-projects.ts:1216–1218, the comment: "Product Book p.73: "Year 1 / Year 10. Oakville, Ontario | TrafficPatternsXD". Both photos show a grocery store; Oakville has two of that chain and the suburban one at Dundas St W fits the Year 1 photo best, so the pin is approximate."
- :1219–1235, the entry: title "Ten years of one crosswalk", Oakville, ON, product TrafficPatternsXD, application Crosswalks, approximate: true (:1227), photos Year 1 cdn 3bd039ce…-1280x960 (:1229) and Year 10 cdn b7e86508…-1280x960 (:1230), ideaBookPage 73 (:1232), excerpt "The same TrafficPatternsXD crosswalk in its first year and its tenth, at a grocery store in Oakville." (:1234). Approximate, so the post names the town and "a grocery store", never the store or a street.
- The book: pp.72–73, the Commercial spaces spread, Application 14. lib/idea-book-edition.ts:261–267 names this job's mapId (:266), labels the photographs "Year 1" and "Year 10" (:265), alts "The Oakville crossing in its first year" and "The same crossing ten years on, in winter" (:263–264). The p.73 render prints the two photographs, which are the map's two photos. The words are p.72, lib/idea-book-print.ts:349–356: headline "Premium materials for commercial parking lots.", statement "Complementing urban design elements with performance-based solutions. TrafficPatternsXD performs year after year." (:351), body "After 10 years of constant use, these crossings have provided a safe and durable path for pedestrians." (:352), SPECIFY TrafficPatternsXD "pedestrian channelization; the look of pavers, stones and cobbles" (:353), caption "Oakville, Ontario | TrafficPatternsXD" (:354).

## Title and excerpt

- The title, "A TrafficPatternsXD crosswalk in Oakville labelled year 1 and year 10": the book's labels, "Year 1" and "Year 10" (lib/idea-book-edition.ts:265; the p.73 render), given as labels, so the title makes no claim of ten years of its own (see the note for Doug below). Written without a comma: no comma in a heading.
- The excerpt, "Two photographs of one TrafficPatternsXD crosswalk in a grocery store's lot in Oakville, Ontario, labelled year 1 and year 10.": the same labels; the map's excerpt (:1234) for the grocery store and the one crosswalk.

## Opening

- "For a commercial parking lot, HUB Surface Systems' Product Portfolio Book · Volume 5 specifies TrafficPatternsXD for pedestrian channelization and for the look of pavers, stones and cobbles.": the spread's subject, commercial parking lots (p.72 headline, lib/idea-book-print.ts:350), and its SPECIFY note (:353). First mention of HUB and of the book, both in full.
- "Its example is a crosswalk in a grocery store's parking lot in Oakville, Ontario": lib/idea-book-edition.ts:266 (the spread's photographs are this job); map :1234 ("at a grocery store in Oakville").
- "the book prints it twice: once labelled "Year 1" and once "Year 10"": lib/idea-book-edition.ts:265; p.73 render.

## Two photographs on page 73

- "Page 73 of the book sets the two photographs one above the other, captioned Oakville, Ontario and TrafficPatternsXD.": p.73 render; lib/idea-book-print.ts:354.
- "In the Year 1 photograph the red brick units are laid in a herringbone, with a band of grey squares along each edge and a white line outside each band. Two people with a stroller are walking along the front of the store behind it.": the photograph, by eye (cdn 3bd039ce…, the top of p.73).
- "In the Year 10 photograph, snow is banked at the edge of the lot and water stands on the asphalt. The herringbone, both grey bands and the white edge lines are all still there to read.": the photograph, by eye (cdn b7e86508…, the bottom of p.73).
- "the book's paragraph says that after "10 years of constant use" these crosswalks "have provided a safe and durable path for pedestrians"": lib/idea-book-print.ts:352. The book's word is "crossings"; the quotes keep the book's words exactly and the word outside them is the site's, crosswalks.

## Aggregate through the full 150 mil

- "TrafficPatternsXD is aggregate-reinforced preformed thermoplastic, 150 mil thick, with aggregate rated 8–9 on the Mohs scale through the full cross-section.": lib/products.ts:96, :100; the book's TrafficPatternsXD page, lib/idea-book-print.ts:80, :83–84.
- "The sheets are heated on prepared asphalt and stamped through into the top of it": lib/products.ts:96.
- "and the herringbone is the pattern the stamping template pressed in": the book's installation spread, pp.16–17, the Stamp step (lib/idea-book-edition.ts:178: "Place the desired template on the surface and vibrate the template into the melted surface, while keying into the asphalt below").
- "It goes on asphalt only.": lib/products.ts:103 (Surfaces: Asphalt); docs/GLOSSARY.md.
- "The book gives it 60 BPN skid resistance (ASTM E303) and a service life of 10+ years.": lib/idea-book-print.ts:85–86 (p.13).
- "Page 86 gives the same system a longer run, 14 years, at the entrance to Toronto Premium Outlets in Halton Hills, Ontario.": lib/idea-book-edition.ts:295 ("14-year-old entrance feature. Still performing every day.", caption "Halton Hills, Ontario | TrafficPatternsXD"); p.86 render; map :1164–1190.
- "The write-up of the Toronto Premium Outlets crosswalks covers that job.": toronto-premium-outlets-14-years, published (posts-index-published.json), a TrafficPatternsXD retail-lot crosswalk with its years in service: the same subject.

## Links (each checked)

/products/traffic-patterns-xd, /product-book/73 and /blog/toronto-premium-outlets-14-years, each once.

## Photo

image-b7e86508809e258c0cd9a59ce7ae568989571d59-1280x960-jpg, already in Studio (the map entry's second photo, the Year 10 one; the dry run found it, 1280x960). Chosen over the Year 1 photo because the piece is about year 10, and the Year 1 photograph is described in the text. 1280 px is the size both photos come in. Hotspot x 0.5 y 0.72 w 0.95 h 0.55, on the crosswalk across the lower half of the frame. Both photos show the store's sign; the alt and the text say "a grocery store" only.

## Left out, and one thing for Doug

- **The photographs' dates.** The repo copies of the two photos carry camera dates (EXIF DateTimeOriginal, and the "taken" column of docs/site-audits/gallery-captions-2026-10-26.csv): the Year 1 photo (public/images/products/traffic-patterns-xd/traffic-patterns-xd-120.jpg) 21 Jun 2016, an iPhone 6s Plus; the Year 10 photo (traffic-patterns-xd-119.jpg) 28 Feb 2023, an iPhone 13 Pro Max. That is under seven years apart (2,443 days, about six years and eight months; the EXIF re-read on 28 Oct 2026), against the book's "Year 1", "Year 10" and "After 10 years". The book wins (the brief), so the post gives the span only as the book's labels and the book's words, attributed. For Doug to confirm before it is published, in the note below.
- Whether the two photographs show one crosswalk: the map and the edition say they do (map :1234; lib/idea-book-edition.ts:264); the photos are taken from different places and cannot show it, so the post says only that the book prints it twice.
- The store's name (on its sign in both photos and in the gallery notes, not in the record) and the street (the comment's best fit only).
- The spread's headline ("premium" as praise), the first half of its statement ("solutions") and "TrafficPatternsXD performs year after year." (quoted in parking-lot-design-year-after-year).
- "so the grip lasts as long as the colour" (lib/products.ts:96): five other drafts use the line.
- Install year, installer, client: no record gives them.
- Length: about 295 words by the script's count, just under the brief's 300.

## Note for Doug (`forDoug`, printed in Studio as "To confirm before Publish: ...")

- "The book labels the two Oakville photographs Year 1 and Year 10, but the dates saved in the photo files are Jun 21, 2016 and Feb 28, 2023, about six years and eight months apart. Please confirm the ten years before this goes live.": the labels, lib/idea-book-edition.ts:265; the dates, the EXIF DateTimeOriginal of traffic-patterns-xd-120.jpg (2016:06:21) and traffic-patterns-xd-119.jpg (2023:02:28), as above. Dates in the site's form (docs/STYLE.md).
