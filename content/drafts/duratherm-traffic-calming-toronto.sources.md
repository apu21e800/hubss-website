# Sources: An inlaid DuraTherm traffic calming marking in Toronto

/blog/duratherm-traffic-calming-toronto · new draft, loaded with `npx tsx scripts/draft-blog-post.ts content/drafts/duratherm-traffic-calming-toronto.md` · 28 Oct 2026

A Project post for map job 30 (`toronto-traffic-calming-markings`), one of the 40 pins whose card said "More projects" (Vern, 27 Oct 2026). The map points at this slug. Line numbers are on branch feat/map-posts.

## What the record holds

- lib/map-projects.ts:1497–1515. Title "Traffic calming markings" (:1501), Toronto, ON (:1502–1503), DuraTherm (:1506), Traffic Calming (:1507), `approximate: true` (:1508), photo `cdn("8a3bc196…-2400x1800.jpg")`, "products/duratherm/duratherm-37 (Product Book p.34)" (:1510), ideaBookPage 34 (:1512), excerpt "DuraTherm traffic calming markings on a residential street in Toronto, inlaid flush with the asphalt" (:1513–1514).
- The comment above it (:1498–1499): "Product Book p.34, the DuraTherm page: "Toronto, Ontario". The street is not identified: approximate."
- The printed page: p.34 is the photograph of the DuraTherm spread, pp.34–35 (lib/idea-book-edition.ts:216, the system leaf: photo p.34, caption "Toronto, Ontario"; render p034-1400.webp, read). The words are p.35 (lib/idea-book-print.ts:157–169; render read).
- How the page is tied to this job: a system leaf has no `mapId` field (lib/idea-book-edition.ts:75), so the tie is the map entry's own `ideaBookPage: 34` and its photo, which is the p.34 photograph (the same frame, checked by eye).

## Left out, and why

- "Reflective options" (p.35): two records disagree. The book prints it; docs/GLOSSARY.md:35 says DuraTherm is decorative and anti-skid, "not beaded". Left out, flagged for Doug.
- "Flush". The book says the finished surface "sits flush with the road" and "Zero, flush with road"; docs/GLOSSARY.md:31 says it "sits just below the surface, out of a plow's way". The post says only what both hold, "Nothing stands above the road", and quotes the book's "nothing for a plow blade to catch, nothing to trip on". "Zero profile" stays out of the body (docs/GLOSSARY.md:31).
- "Heat-fused" (the p.35 subhead and Bond line): the brief and the glossary rule it out; the post says "bonded with an infrared heater" (lib/products.ts:306).
- "Speed bumps" (the p.35 uses strip): the lint and docs/GLOSSARY.md:57 rule it out; the post names "calming", the strip's own word.
- The street. The pin is `approximate`; the post names only Toronto, and "residential street" from the record's excerpt.
- A service life: neither the book nor lib/products.ts gives one for DuraTherm, so none is stated.
- That the darker asphalt is a speed hump or table, or new paving: the photograph does not show it plainly.
- Install year, installer, client, quantity, cost: no record gives them.

## First two paragraphs

- "A white triangle points up a tree-lined street ... its field broken into rows of dark rectangles": the photograph.
- "in Toronto, Ontario": the p.34 caption.
- "a traffic calming marking in DuraTherm": the map entry's title, application and excerpt (:1501, :1507, :1514); p.34 is on the DuraTherm spread.
- "the inlaid thermoplastic in the HUB Surface Systems range": p.35 headline "Inlaid thermoplastic." (lib/idea-book-print.ts:158). DuraTherm is the only system that goes in this way (docs/GLOSSARY.md:31).
- "the photograph takes all of page 34 ..., facing the system's own page": the spread, pp.34–35 (lib/idea-book-edition.ts:216); the p.34 render is the photograph with its caption.
- The photograph again: darker asphalt under the marking, the paler road beyond, lawns, tall trees and houses, a white van in the distance. "residential street": the map excerpt (:1514).

## White thermoplastic inlaid in a stamped surface

- "The asphalt is heated and stamped first, then precut 90 mil thermoplastic (about 2.3 mm) is set into the impressions and bonded with an infrared heater": lib/products.ts:306; "about 2.3 mm", docs/GLOSSARY.md:36 ("90 mil is 2.3 mm"); (the same words are live on Studio's DuraTherm product, read 28 Oct 2026); docs/GLOSSARY.md:31; p.35 Install "Inlaid into a stamped surface" (lib/idea-book-print.ts:162).
- "In this marking, then, the white is the thermoplastic, and the dark rectangles within it are the asphalt itself": an inference from how DuraTherm goes in (above) and the photograph (the dark rectangles have the colour and texture of the asphalt around the marking). Marked by "then" as a reading of the photo against the method, not a record of this job.
- "Nothing stands above the road": p.35 subhead ("Zero profile above grade", :159) and docs/GLOSSARY.md:31 ("just below the surface") agree on this much.
- "Page 35 says so in its own words: “nothing for a plow blade to catch, nothing to trip on.”": p.35 description (:160), the words after the page's dash, quoted.
- "Under Snowplow safe, it prints “no shear risk”": p.35 spec (:164; the page prints "Yes — no shear risk").

## Traffic calming that keeps clear of the plow

- "The site files the job under traffic calming": the map's application (:1507). One of the two map posts that keep a sentence saying where the site files the job (the other is the Toronto fleet lot).
- p.35's uses strip, "Calming" among them (:167): no longer cited, cut on 28 Oct 2026 (nine map posts cited a uses strip). The book's traffic calming spread (p.54) does not list DuraTherm under SPECIFY (StreetPrint, StreetBond, TrafficPatternsXD; lib/idea-book-print.ts:247–251), and the post does not say it does.
- "“A change in surface is a change in speed.”" and "“Changing colour and texture tells a driver the environment has changed before any sign does.”": p.54 (lib/idea-book-print.ts:245–246; render read), quoted as the book's words on traffic calming, not as a result on this street. The spread's photograph is the Cowichan Valley (p.55).
- "The site's DuraTherm page names speed tables beside crosswalks, calming and identity work, and it gives the case for inlaying a marking at all: the system is specified “where winter maintenance would strip anything that sits on top”": lib/products.ts:306 ("Specified for crosswalks, speed tables, traffic calming and identity work where winter maintenance would strip anything that sits on top"), live on Studio's DuraTherm product (read 28 Oct 2026); the closing words quoted.
- The link: /blog/snowplow-safe-decorative-pavement (published; the posts index). Its section "3. Zero profile above grade" has a paragraph on DuraTherm that matches the book ("inlays thermoplastic into a stamped impression, so the finished surface sits flush with the road"). The same subject: why a marking is inlaid on a road that is plowed.

## Links (each checked)

/products/duratherm, /product-book/34, /applications/traffic-calming, /blog/snowplow-safe-decorative-pavement. Each once. No outside links. The post ends on the guide, with no call to action.

## Photo

image-8a3bc196f60cb2d0acd42d9a389654c709f5aa0a-2400x1800-jpg, already in Studio (duratherm-37, the p.34 photograph). Alt: "A white DuraTherm traffic calming marking inlaid in the asphalt of a tree-lined residential street, Toronto, Ontario" (the system from the spread, the town from the caption, "residential" and "traffic calming" from the map entry). Hotspot x 0.5 y 0.64 w 0.96 h 0.6, on the marking, which fills the lower two thirds.
