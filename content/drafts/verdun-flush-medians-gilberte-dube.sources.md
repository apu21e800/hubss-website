# Sources: Flush medians on Verdun's Rue Gilberte-Dubé

/blog/verdun-flush-medians-gilberte-dube · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/verdun-flush-medians-gilberte-dube.md` · 28 Oct 2026

Map job 34, `verdun-flush-medians`. The slug is the one the map is pointed at. Each statement, then the line it rests on. Line numbers are lib/ and docs/ on branch feat/map-posts as read on 28 Oct 2026. The book's pages were read on the renders in public/catalogue/2026-27/ (p116, p013, p054).

## What the record holds

- lib/map-projects.ts:1631–1633 (comment): "Product Book p.116: 'Flush medians become part of the road... Verdun, Québec | TrafficPatternsXD'. The corner signs in the photo read Rue Gilberte-Dubé and Rue Jacques-Lauzon (Île-des-Sœurs)."
- lib/map-projects.ts:1634–1647: title "Flush medians, Rue Gilberte-Dubé" (:1635), Verdun, QC (:1636–1637), product TrafficPatternsXD (:1640), application Traffic Calming (:1641), not approximate (no `approximate` field), photo cdn("6d342d0b6a69e5d5c9b215cd3319a6bdc54170ab-2400x1800.jpg"), the applications/traffic-calming gallery copy of the p.116 photograph (:1643), ideaBookPage 116 (:1645), excerpt "Flush medians in TrafficPatternsXD that narrow the road and slow cars on the existing asphalt, with nothing for a plow to catch." (:1647).
- lib/idea-book-edition.ts:402, the printed page 116: eyebrow "Traffic control"; headline "Flush medians become part of the road."; body "Utilizing TrafficPatternsXD to create visual and tactile traffic control methods. Slowing down cars, protecting pedestrians all while using the existing road surface with this snowplow-proof, road-narrowing installation."; caption "Verdun, Québec | TrafficPatternsXD".
- The photograph (the cover, downloaded at 2400x1800 and read, the sign area enlarged): a street sign reading "Rue Gilberte-Dubé", with a second sign above it reading "Rue Jacques" and cut off by the frame; under them a green sign reading "JEU LIBRE", a figure kicking a ball, "1er avril au 14 novembre, 7h à 21h"; a curved median against the curb, charcoal bricks in offset rows ringed by pale bricks set crosswise, on dark asphalt; brick houses; parked cars on the far side. The book's crop on p.116 cuts the signs off.

## What I left out, and why

- The book's headline, "Flush medians become part of the road.": docs/GLOSSARY.md:29 and the brief ("becomes part of the road"), and the lint flags it (lib/style-lint.ts:382). The piece quotes the page's two body sentences instead.
- "with nothing for a plow to catch" (the map's excerpt): the piece quotes the book's own word for it, "snowplow-proof", inside the page's sentence.
- The traffic calming spread's pull line and body sentence ("A change in surface is a change in speed.", "Changing colour and texture tells a driver ..."): the DuraTherm Toronto, North Cowichan and e-blast drafts quote them, so this piece uses the spread's list of devices, which names medians, and the site's traffic calming page.
- The free-play sign's dates and hours: shown on the sign, not needed; the piece gives the sign's words and a plain translation, and says nothing about what the sign means for the street.
- Install year, installer, client, number of medians: no record gives one. The photograph shows one median; "flush medians" is the book's and the map's plural, kept in the title.
- Whether these medians and the parking lane on p.131 (also Verdun, TrafficPatternsXD) are one project: no record says so.
- An earlier e-blast draft (content/drafts/specifying-thermoplastic-pavement-markings.md) left the street name out as one weak source. Here the entry is not approximate, the slug carries the street, and the sign is plainly in the photograph (read and enlarged), so the piece names it. "Jacques-Lauzon" is the comment's reading of the cut-off sign (lib/map-projects.ts:1632–1633): flagged in the report.

## First paragraph

- "The road narrows at the corner of Rue Gilberte-Dubé and Rue Jacques-Lauzon, on Île-des-Sœurs in Verdun, Québec": lib/map-projects.ts:1632–1633 (the comment), :1635; the sign in the photograph; Verdun, Québec from p.116's caption; "road-narrowing installation" (lib/idea-book-edition.ts:402) and "narrow the road" (lib/map-projects.ts:1647).
- "where a flush median of TrafficPatternsXD curves out from the curb": "Flush medians" and the caption's system, p.116; the curve and the curb, the photograph.
- "HUB Surface Systems prints the corner on page 116 of the Product Portfolio Book · Volume 5, labelled 'Traffic control'": lib/idea-book-edition.ts:402 (page 116, eyebrow). The book's full name at first mention: lib/catalogue.ts:77.
- "Utilizing TrafficPatternsXD to create visual and tactile traffic control methods.": lib/idea-book-edition.ts:402, the body's first sentence, word for word.

## Charcoal bricks at the corner

- "The street sign is in the wider frame of the photograph above: Rue Gilberte-Dubé, with a green sign under it that reads Jeu libre (free play) and shows a figure kicking a ball.": the cover photograph, which is wider than the book's crop. "free play" is the plain English of the sign's two words.
- "The median's field is charcoal bricks in offset rows, ringed by a border of pale bricks set crosswise, on dark asphalt. Brick houses face the street, and cars are parked along the far side.": the photograph.

## A median drivers see and feel

- "Slowing down cars, protecting pedestrians all while using the existing road surface with this snowplow-proof, road-narrowing installation.": lib/idea-book-edition.ts:402, the body's second sentence, word for word.
- "The road surface here is asphalt, the only one TrafficPatternsXD goes on": lib/products.ts:103 ("Surfaces: Asphalt"); docs/GLOSSARY.md:30 ("Asphalt only"); the asphalt in the photograph.
- "Its 150 mil sheets are aggregate-reinforced, heated on the prepared asphalt and stamped into it": p.13 (lib/idea-book-print.ts:80, :83); docs/GLOSSARY.md:30; lib/products.ts:102.
- "the system page, page 13, credits the material with high colour contrast for increased safety and a service life of 10+ years": p.13 (lib/idea-book-print.ts:81, "High colour contrast for increased safety."; :86, "10+ years").
- The heading's "see and feel" is the book's "visual and tactile" (lib/idea-book-edition.ts:402) in plain words.

## Medians on the book's traffic calming list

- "lists medians among the devices it covers, with roundabouts, truck aprons, gateway treatments and speed tables": p.54 (lib/idea-book-print.ts:246, "Traffic calming devices such as roundabouts, medians, truck aprons, gateway treatments and speed tables.").
- "Traffic calming works when a driver sees the street change before a sign says so.": lib/applications.ts:243 (the sentence's first clause), live in Sanity (application-traffic-calming, read 28 Oct 2026).

## The close (the second of my two Lunch & Learn closes)

- "gives it 60 minutes with HUB": lib/lunch-learn-content.ts:30, :16–18. "at your office or online": :42. "At the office HUB brings the lunch; online, the lunch arrives as a $25 voucher": components/sections/LunchLearnV2.tsx:55 ("Lunch on HUB, and a $25 voucher when the session's virtual"). "either way there is nothing to pay": lib/lunch-learn-content.ts:34 ("What does it cost? Nothing. No invoice").
- The link carries the topic: /lunch-learn?topic=TrafficPatternsXD#book.

## Links (each checked)

/products/traffic-patterns-xd (first mention), /product-book/116, /product-book/13, /product-book/54, /applications/traffic-calming, /lunch-learn?topic=TrafficPatternsXD#book. No published post is about flush medians, so none is linked; traffic-calming-surface-design is not linked (its "BPN 65+" and outside speed figures are not the book's). No outside link.

## Photo

image-6d342d0b6a69e5d5c9b215cd3319a6bdc54170ab-2400x1800-jpg, the map entry's photo (lib/map-projects.ts:1643), already in Studio (the dry run found it at 2400x1800). Alt: what the photo shows; the system and the town from p.116's caption, the street from the sign in the photograph. Hotspot x 0.5 y 0.62 w 1 h 0.7, on the median, below the signs.

## Checked against the other map posts

Compared sentence by sentence with every draft in content/drafts on 28 Oct 2026: no shared sentence. The opening (built like the Kings and Queens draft's "King Street and Queen Street meet"), the photograph line and the Lunch & Learn lines (close to the Granville Island and Green Square drafts) were rewritten after the first check.

## Length

About 340 words in the dry run's count (headings included). The record is the book's two sentences, a caption and a photograph with legible signs, so the piece stops there.
