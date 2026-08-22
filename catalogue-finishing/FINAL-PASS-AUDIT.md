# HUBSS Catalogue 2026 — FINAL-PASS AUDIT (DDB-grade)

Per-page visual audit of the **current v53 build** (6×6, FOGRA-corrected). Method: 12 parallel review agents visually inspected all 116 trim renders, plus an objective WCAG-contrast probe on text-on-image pages, plus a viewer-CSS check. **No fixes applied — this is the Phase-1 inventory for Vernon's sign-off.**

**57 issues** — 4 critical · 24 major · 29 minor · across 43 pages. **73 pages clean.**

By type: image_text_match 18 · layout 14 · legibility 11 · overlap 7 · bottom_edge 4 · other 3


## Systematic themes (fix at the archetype, not per-page)


### A. Application archetype — headline overlaps body
When a tagline wraps to 2 lines it collides with the body block. **p43, p45, p47, p48** (and audit-confirmed pattern). Body also crowds the bottom edge (p37, p40). FIX: increase H1→body leading / push body down a fixed amount, or cap tagline to 1 line.


### B. Application + project SPREAD symmetry (Vernon's ask)
Every application page is the same image-top/white-info-bottom structure, so facing pages read identical (p40–49). Vernon wants spreads to ALTERNATE: full-bleed image one side, white info card the other. Same for project spreads with near-duplicate photos (**p95/96, p97/98**). FIX: re-architect application/project into 2-page asymmetric spreads (he OK'd more pages / fewer apps).


### C. Section openers — no scrim, title too big / too low
White title + caps sit on bare photo with NO scrim → fails contrast (p11 2.1:1, p36 2.8:1, p56 2.0:1, p106 1.6:1; p99/p105 eyebrows too). p36 'Applications.' is 64pt and descenders touch the trim. FIX: add a soft bottom vignette scrim, drop title ~10–14pt, raise the block off the edge.


### D. Image↔copy mismatches (more than Stage A caught)
CRITICAL: p80 White Rock Pier→residential street; p88 Sechelt→**Terry Fox map** (still!). MAJOR: p16 StreetBond→splash-pad rubber; p48 'premium'→dingy EV lot; p65 modal→grey plaza; p69 'W 1ST STREET'→US-looking seal; p72 Vancouver BIA→grey paver; p86 Every Child Matters→plain tan; p90 Simcoe Rainbow→grey unpainted. FIX: re-source from D:/STUDIO-01 + swap at source.


### E. p84 Kitchener — void from the detail=None fix
Setting Kitchener detail=None (to kill the duplicate) left the top ~70% blank with text jammed at the bottom. FIX: vertically centre the story block, or give p84 a dignified navy story panel.


### F. Installer [LOGO] placeholders
p100–103 still show grey '[LOGO]' boxes. FIX: drop in real installer logos or remove the slot.


### G. Lunch & Learn (p109) — redesign
Odd dog-in-hardhat photo, bullet text overlap ('team' collides with next bullet), unbalanced composition. FIX: redesign (3 options below) — Vernon picks direction.


### H. Bottom-edge / overflow clipping
p116 copyright clipped at edge; p102 body overflows onto the orange rule; p36 title at trim. FIX: enforce a bottom safe-margin guard across these renderers.


### I. Flipbook VIEWER shadow (not print)
The 'weird shadow at the bottom' (p44 etc.) is the viewer CSS gradient at Flipbook.tsx:346 (linear-gradient 0deg rgba(0,0,0,0.55)…), NOT a baked-in artifact — print/web PDFs are clean. FIX: reduce/remove that gradient in Flipbook.tsx.


### J. Minor editorial
p7 repeats p5's four stats; p9 bare captionless full-bleed; p11 opener reads US-corporate-park (provenance). FIX: vary p7 stats, caption/justify p9, confirm p11 provenance.


## Objective WCAG contrast probe (white text on image)

Large display text needs ≥3:1. Section openers FAIL (no scrim); DPS captions mixed. (Product/project heroes excluded — verified they use DARK text on white, not white-on-image.)

| Page | role | white-text contrast | verdict |
|---|---|---|---|
| p11 | Products opener | 2.11:1 | FAIL |
| p36 | Applications opener | 2.76:1 | FAIL |
| p56 | Projects opener | 1.96:1 | FAIL |
| p99 | Network opener | 3.35:1 | pass |
| p106 | Reference opener | 1.63:1 | FAIL |
| p35 | In-the-Field DPS | 3.18:1 | borderline |
| p78 | Every-Mark DPS | 1.93:1 | FAIL |
| p101 | Built-to-Last DPS | 1.14:1 | FAIL |


## Full per-page inventory (all issues)


**CRITICAL (4)**

- **p80** `image_text_match` — Copy reads 'White Rock Pier... full force of the BC coast' but the photo is a leaf-strewn residential street with bare deciduous trees, brick triplexes with exterior staircases (Montreal/Quebec vernacular) and a parked Jeep — no pier, no ocean; replace with an actual White Rock seaside/pier TrafficPatternsXD crosswalk image.
- **p88** `image_text_match` — Copy says 'Sechelt Pictograph Crosswalk — origin story of the shishalh Nation' but the photo is clearly a Terry Fox Marathon of Hope map installation ('Port aux Basques, Terry ran 28 miles, Total: 576 miles') — wrong project entirely; replace with a genuine Sechelt pictograph image.
- **p100** `other` — Top-right '[LOGO]' grey placeholder box is still baked in — replace with the actual HUB Certified Installer / Square One Paving logo before print; a placeholder must never ship.
- **p109** `overlap` — The second bullet 'Continuing-education content for your team' wraps so 'team' drops to its own line, and the third bullet 'In person across Canada, or virtual' collides with it — the third bullet dot and 'In person' text overlap the orphaned 'team.' line; fix line-height/spacing so each bullet is separated and 'team' doesn't orphan.

**MAJOR (24)**

- **p10** `legibility` — White caption 'From every intersection, a statement.' sits directly over the bright red/teal/white painted Little Italy intersection with no scrim and overlaps the white circle border at left, badly degrading the at-a-glance read; add a bottom gradient scrim or dark caption bar behind the line.
- **p10** `overlap` — A faint orange eyebrow label (reads as '...WORK', likely 'OUR WORK') is half-buried behind the painted 'Little ITALY' logo just above the white headline, producing a muddy unreadable overlap; reposition the eyebrow to a clean area or onto the scrim and ensure it clears the artwork and headline.
- **p16** `image_text_match` — StreetBond caption reads 'Coloured pavement that moves with asphalt,' but the photo is a children's water splash pad with rubberized poured-in-place play surfacing and rainbow play structures, which reads as playground rubber, not an acrylic-coated asphalt/pavement; replace with a StreetBond-coated road/plaza/bike-lane image that clearly shows coloured pavement.
- **p36** `bottom_edge` — The 'Applications.' headline sits flush against the bottom trim with the 'pp' descenders nearly touching the page edge — raise the headline ~8-10mm so descenders clear the trim/bleed safe zone.
- **p43** `overlap` — The two-line headline 'Neighbourhood identity, embedded in the street.' collides with the body paragraph below it — the descender of 'street.' touches the first body line 'Every neighbourhood has a story' — increase the gap between H1 and body (or reduce H1 size) so they don't kiss.
- **p45** `overlap` — Two-line headline 'Court colour and lines that hold their geometry.' overlaps the body copy beneath — 'hold their geometry.' sits on top of the first body line 'Sport courts are one of the most demanding...' — add leading between headline and body block.
- **p47** `overlap` — Two-line headline 'Civic plazas, transit forecourts, university campuses.' overlaps the body paragraph — 'university campuses.' baseline overlaps 'Public plazas and civic squares...' — increase headline-to-body spacing.
- **p48** `overlap` — Two-line headline 'Premium hardscape. Mixed-use developments and hospitality.' overlaps the body copy — 'developments and hospitality.' sits directly on top of 'Retail centres, mixed-use developments...' — add leading between H1 and body block.
- **p48** `image_text_match` — Headline is 'Premium hardscape — mixed-use developments and hospitality' but the photo shows a lone EV charging in a dingy lot with faded blue painted parking-stall lines, not premium stone-look StreetPrint hardscape; the surface looks cheap/utilitarian and undercuts the 'premium' claim — replace with a genuine premium mixed-use/hospitality StreetPrint installation.
- **p55** `legibility` — The orange 'ACROSS CANADA' eyebrow and white 'Ten provinces. One standard.' headline sit bottom-left over light grey concrete and the pale-blue tennis logo with no scrim; the orange eyebrow nearly disappears against the light concrete — add a dark bottom gradient scrim (or shift type onto a darker zone) to lift both lines.
- **p56** `legibility` — The white 'Projects.' section wordmark overlaps the bright sunlit light-colored crosswalk pavers along the bottom with no scrim, so the lower strokes of the type lose contrast; add a dark gradient scrim behind the wordmark to guarantee the read.
- **p65** `image_text_match` — Headline 'Modal clarity, written in colour' (StreetBond + TrafficPatterns) sits over a hero that is almost entirely grey concrete plaza and wood planters with only a small distant mural strip at the far-left edge — the image fails to show any coloured modal pavement; swap to a New Westminster frame that actually shows the coloured bike-lane/crosswalk treatment (the green-lane frame on p.066 would read far stronger as the opener).
- **p69** `image_text_match` — Crosswalk reads 'W 1ST STREET' with a generic circular civic seal — the 'W' (West) directional + numbered-street naming and seal read as a US municipality, which undercuts the 'CANADA-WIDE' caption on a Vision Zero flagship page; confirm this is a Canadian install (e.g. North Vancouver's W 1st) and caption the specific Canadian city, or replace with an unambiguously Canadian Vision Zero crosswalk.
- **p72** `image_text_match` — Copy says 'StreetPrint stamped-asphalt crosswalks across five Vancouver Business Improvement Districts' but the photo shows a grey paver loading-bay/plaza apron beside a commercial building (with bollards and a curb ramp), reading as a parking apron, not a street crosswalk; the dry brown grass and mountain backdrop also read as Interior BC, not Vancouver — swap to an actual BIA street-crosswalk photo in an urban Vancouver setting.
- **p78** `legibility` — The orange 'EVERY MARK' eyebrow is nearly invisible (low-contrast orange on light-grey road surface) — raise contrast, add a subtle scrim, or relocate the eyebrow/headline onto the darker pavement so both lines pass an at-a-glance read.
- **p84** `layout` — Entire top ~70% of the page is blank white with all content (eyebrow, headline, body) jammed at the very bottom — vertically re-center or raise the content block so the empty space reads intentional, not like a layout fault.
- **p86** `image_text_match` — Copy reads 'Every Child Matters' but the photo shows only a plain tan tile-pattern crosswalk with no Every Child Matters lettering or red/orange graphic — swap to a photo that actually shows the Every Child Matters installation so image and copy agree.
- **p90** `image_text_match` — Copy is 'Simcoe Rainbow Crosswalk' but the photo is a plain grey unpainted paver close-up with no rainbow colour — replace with an image of the actual rainbow crosswalk so the photo depicts the named subject.
- **p95** `layout` — page-095 and page-096 are the same White Rock Seaside Stroll project on consecutive pages with near-duplicate crosswalk photos and an identical image-top/white-info structure — vary the crop or angle on one (e.g. tighter detail of the wave artwork) so the spread doesn't read as a repeat.
- **p97** `layout` — page-097 and page-098 are the same Langley Railroad Heritage project on consecutive pages with near-duplicate tan-panel crosswalk imagery and identical layout — differentiate one (wider street context vs the tight panel detail on 098) so the pair alternates rather than repeats.
- **p99** `legibility` — Section-opener 'SECTION FOUR' eyebrow is small grey caps sitting over a busy mid-tone asphalt and red-band region with no scrim — add a soft bottom-left dark gradient scrim (or set the eyebrow in orange/white) so both the eyebrow and 'Network.' read cleanly at a glance.
- **p102** `overlap` — The body copy overflows into the orange divider rule — the final line 'specify by name.' sits directly on top of the orange line, which cuts through the descenders; shorten the copy or push the divider/PHONE-ONLINE block down to clear the text.
- **p105** `legibility` — White headline 'The surface underfoot. The city above.' and the orange 'BUILT TO LAST' eyebrow sit over light-grey sunlit concrete with no scrim — the orange eyebrow is nearly invisible and the white headline is low-contrast; add a bottom gradient scrim or darken the lower image region behind the type.
- **p116** `bottom_edge` — The '(c) 2026 HUB Surface Systems' copyright line at the very bottom is clipped by the page edge; raise it above the safe margin so it isn't lost in the bleed/trim on the back cover.

**MINOR (29)**

- **p7** `other` — By-the-Numbers dark page repeats the exact same four stats (30+ years / 1,000+ projects / 10 provinces / 20yr) already shown two pages earlier on page 5's white stat cards; vary the metrics or cut one instance to avoid back-to-back redundancy.
- **p9** `layout` — Full-bleed transit/BRT photo carries no caption, eyebrow, or headline and sits as a bare image facing the also-full-bleed photo page 10; add a short caption/label or pair it with a white info page so the spread alternates rather than running two captionless/captioned photos together.
- **p11** `legibility` — On this 'Products.' section opener the white 'Products.' wordmark's right edge ('s.') and the 'SECTION ONE' small-caps label sit on a bright saturated-green bike-lane patch and mid-grey asphalt with no scrim; add a subtle bottom gradient scrim so both hold at a glance against the busy daylight photo.
- **p11** `image_text_match` — The opener photo is shot at a US-looking corporate office park (blue 'be ready' banner, generic glass towers) rather than an unambiguously Canadian civic streetscape; confirm provenance or swap for a recognizably Canadian municipal scene to match HUBSS positioning.
- **p22** `image_text_match` — Caption reads 'Engineered for transit lanes' but the red MMAX lane coating is mostly hidden behind the bus and reads as ordinary asphalt; consider a tighter crop that foregrounds the red lane so the photo clearly depicts the product, not just a city bus.
- **p25** `image_text_match` — StreetBondSR photo shows a tan/orange recreational pathway through a park with a splash-pad, which reads as a 'park path' rather than the 'cool surface / heat-island' parking/plaza/LEED-site use the facing copy emphasizes; a parking-lot or plaza shot would match the SR positioning better.
- **p30** `image_text_match` — PreMark 'Pre-cut. Heat-applied. Open immediately' pairs with a wide construction-site crosswalk shot where the white ladder bars sit in the far mid-ground and read small; tighten the crop onto the finished crosswalk bars so the product is the clear subject.
- **p30** `layout` — Foreground is dominated by a large grey concrete ramp/curb wedge and bare dirt lot, leaving the actual PreMark crosswalk as a small element; reframe so the decorative marking, not the raw earthwork, occupies the dominant visual weight.
- **p35** `legibility` — The orange 'IN THE FIELD' eyebrow is too small, low-contrast and over a busy paver band — enlarge/tighten its tracking or move it onto a darker region so it does not disappear; the white headline below it reads acceptably.
- **p35** `layout` — Headline 'Designed for the city. Built for the street.' baseline sits close to the bottom edge over the brightest paver row — nudge the caption block up slightly for bottom-edge safety and contrast.
- **p36** `legibility` — White 'Applications.' wordmark crosses bright sunlit asphalt and pale paver crosswalk with no scrim; add a subtle bottom-left gradient scrim or drop the photo exposure in that quadrant to guarantee the white type reads at trim.
- **p37** `layout` — The five-line Crosswalks body paragraph runs down to the bottom margin where 'HUBSS.COM' sits — the last line ('Halifax to Vancouver.') is tight to the bottom edge; tighten copy or lift the block for bottom-margin safety.
- **p40** `layout` — Parking Lots body copy fills to the bottom margin with the final line nearly level with 'HUBSS.COM' — add a little bottom clearance so the last line is not crowding the trim.
- **p41** `image_text_match` — Copy promises 'vivid UV-stable colour... mural-quality custom graphics... visual richness of stone' but the photo is a plain grey paver crosswalk with a pedestrian bollard and a bare autumn lawn — swap to a Parks & Paths shot that actually shows coloured StreetBond surfacing or a DecoMark graphic so the image delivers on the headline.
- **p41** `layout` — This is one of a run of identically-structured pages (41-49: full-bleed photo top, white info block bottom with orange eyebrow + dark headline + grey body) — Vernon wants facing spreads to alternate full-bleed vs white-info, so check the spread pairing; several consecutive pages here repeat the exact same template and read monotonously.
- **p45** `image_text_match` — Court stencil text reads 'LA DAUVERSI...' (a Quebec/French school name) — fine for Canadian content, but the text-on-court is cropped mid-word at the left edge; verify this reads as intentional and isn't a US/foreign-looking crop.
- **p55** `other` — The 'DE TENN...' / 'Repentigny' logo text is cropped hard at the right edge of the photo; reframe or zoom out slightly so the wordmark isn't sliced mid-word.
- **p57** `layout` — This York Region MMAX page (image-top / white-info-bottom) shares the identical structure with its facing page 058; per Vernon's spread rhythm, alternate one of the two to a full-bleed image so the pair reads as contrast rather than repetition.
- **p59** `layout` — This Toronto Priority Bus Lanes page (image-top / white-info-bottom) is structurally identical to its facing page 060; alternate one to full-bleed image to avoid the monotonous matched-pair layout across the spread.
- **p78** `bottom_edge` — The white headline baseline sits very low in the frame, close to the bottom trim — nudge the text block up to protect against bleed/trim loss.
- **p96** `image_text_match` — page-096 photo reuses essentially the same straight-on crosswalk view as page-095 while the copy adds the artist/40%-traffic story — swap in a different vantage (street-level pedestrian or angled context shot) so the richer writeup is paired with a fresh image.
- **p99** `layout` — As a full-bleed section opener the daytime photo competes with the lower-left type; darken the bottom-left corner with a gradient to anchor the 'Network.' lockup and keep it distinct from the in-image red bike-lane band.
- **p100** `layout` — Final body line 'contractors across British Columbia.' nearly touches the orange divider rule beneath it — add a few points of leading/space between the paragraph and the rule.
- **p101** `image_text_match` — Body copy code-switches mid-paragraph between French and English ('Spécialiste québécois en marquage de longue durée. Crosswalk programs, bus lane markings...'); pick one language (English to match the rest of the catalogue, or a clean bilingual treatment) rather than splicing them.
- **p105** `bottom_edge` — Headline baseline sits very close to the bottom trim edge with the type running into the medallion graphic; raise the text block to add safe-margin clearance from the bottom bleed.
- **p106** `legibility` — The 'SECTION FIVE' eyebrow (white with orange dot) sits over the bright lime-green pavement with weak contrast; the large 'Reference.' reads fine but the eyebrow needs a darker pin or slight scrim to hold against the green.
- **p108** `layout` — The client list occupies only the top third of the page, leaving the entire bottom half empty and unbalanced; either enlarge/space the list, add a footer rule or proof point, or vertically centre the block.
- **p112** `image_text_match` — Decorative concentric-circle crosswalk reads as a US/California intersection (green bike-box signal head, US-style curb and signage); verify this is a Canadian installation since the catalogue is Canadian-positioned, or swap for a Canadian crosswalk photo.
- **p116** `legibility` — The dark photo scrim behind the logo block is uneven/blotchy; even out the overlay gradient so the background reads as an intentional flat scrim rather than a patchy photo.


**Clean pages (73):** p1, p2, p3, p4, p5, p6, p8, p12, p13, p14, p15, p17, p18, p19, p20, p21, p23, p24, p26, p27, p28, p29, p31, p32, p33, p34, p38, p39, p42, p44, p46, p49, p50, p51, p52, p53, p54, p58, p60, p61, p62, p63, p64, p66, p67, p68, p70, p71, p73, p74, p75, p76, p77, p79, p81, p82, p83, p85, p87, p89, p91, p92, p93, p94, p98, p103, p104, p107, p110, p111, p113, p114, p115
