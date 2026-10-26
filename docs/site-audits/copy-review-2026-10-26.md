# The blog's copy review, 26 Oct 2026

Vern, 26 Oct 2026: "a DDB AAAA creative agency QA pass, with extra attention to making sure the editorial stuff does not read like AI slop, and is worded in a way Doug will not complain about? seo optimized, no weird jargon, correct terminology for each product and application ... Don't re-write everything only improve, it's a lot of posts."

Ten reviewers read the 76 published posts (the archived York transit post left out) against docs/STYLE.md and docs/GLOSSARY.md and filed local edits (a phrase, a sentence, never a paragraph; nothing added, no number, name, quote or link changed). Three independent editors then read every edited span (885 spans) and corrected 11 edits with a one-line fix each; 11 were dropped. What survived is scripts/copy-review-2026-10-26.json, applied by scripts/copy-review-2026-10-26.ts on Vern's PC (dry run by default; `--apply` writes; `--case` adds the sentence-case pass on titles and headings).

- 962 word edits on 885 spans in 75 posts: tell 404, terminology 271, gobbledygook 115, spelling 113, claim 27, paint 26, seo 6.
- 115 case edits (Title Case titles and headings to sentence case), applied only with `--case`: Doug's word first, since the older posts' titles are his.
- 42 claims flagged, not changed (below): a figure or a statement with no source in the printed Product Portfolio Book or a maker's sheet. The post keeps it until Doug says.
- Verdicts: improve 38, rewrite-candidate 35, fine 3. A rewrite candidate got its worst lines fixed and a note; the rewrite itself is a separate decision.

## Claims for Doug (the post says; the book or the sheet says)

- **residential-driveways-stamped-asphalt-upgrade** (body[12].children[2].text): Book gives StreetBond 8+ years; 20+ has no source. Post: «the same product that holds its colour on a high-traffic city plaza for 20+ years»
- **residential-driveways-stamped-asphalt-upgrade** (body[14].children[0].text): Return-to-service time needs the maker's sheet; body[44] repeats it. Post: «You're back on it within 24 hours.»
- **streetbond-leed-urban-heat-island** (body[3].children[0].text): Whose measurements? Needs a source or the maker's figure. Post: «Field measurements confirm surface temperature reductions of up to 30°F (17°C) compared to standard black asphalt»
- **streetbond-leed-urban-heat-island** (body[6].children[0].text): LEED is v5 (SR 0.33), not v4 (SRI 29); recheck bullets. Post: «StreetBondSR contributes to multiple LEED v4 credit categories:»
- **commercial-parking-reit-specification** (body[7].children[1].text): A cure or return-to-service time needs PPG's sheet; cut or quote it. Post: «Zero cure time.»
- **commercial-parking-reit-specification** (body[19].children[0].text): A quote attributed to Stantec needs the source document, or goes. Post: «As Stantec's urban design team noted in a recent specification review:»
- **trafficpatternsxd-urban-design** (body[10].children[0].text): The book gives TrafficPatternsXD 60 BPN (ASTM E303); 65+ needs a source. Post: «BPN 65+ certified skid resistance»
- **vision-zero-thermoplastic-crosswalks** (body[9].children[0].text): TrafficPatterns and XD are not beaded (glossary); anti-skid, not retroreflective Post: «The glass beads that provide retroreflectivity are»
- **vision-zero-thermoplastic-crosswalks** (body[10].children[0].text): Book gives 60 BPN; 'certified' and 'zero documented' need sources Post: «BPN 65+ certified skid resistance maintained throughout service life. Zero documented edge damage from snowplow operatio»
- **keeping-pedestrians-safe** (body[0].children[0].text): No crash figures in the post; needs a study or cut Post: «Canadian Municipalities Are Proving That Surface Treatments Reduce Crashes Without Full Reconstruction»
- **keeping-pedestrians-safe** (body[9].children[0].text): Book gives XD 10+ years; the 40–60% saving is unsourced Post: «Offers an 8+ year service life»
- **bowen-island-asphalt-path** (body[3].children[0].text): Name the BC MoTI recognized-products listing, or cut Post: «is a recognized product with the BC Ministry of Transportation»
- **white-rock-pier-crosswalk** (body[12].children[1].text): Return-to-service time needs the maker's sheet; else cut the hours. Post: «open to traffic in a matter of hours»
- **parking-lot-sealcoating-vs-maintenance-coating** (body[4].children[0].text): Glossary has GAF's DuraShield SR at 0.34; check the colour card's 0.35. Post: «The solar-reflective option is SR Gray, at 0.35 on the 2026 colour card.»
- **branded-crosswalks-vancouver-richmond** (excerpt): Body says Richmond used TrafficPatternsXD; SEO description says the same. Check. Post: «DecoMark and TrafficPatterns»
- **cycling-transit-integration-surface-solutions** (body[12].children[0].text): Heading says Red MMAX for bus lanes; this says green, and later bike lanes. Check colour and lane. Post: «Bold green pigmentation»
- **pedestrian-walkways-surface-systems** (body[15].children[1].text): Which standard? The book cites only ASTM E303; name it or cut Post: «Skid resistance values meet or exceed accessibility pathway standards.»
- **decorative-crosswalks-community-identity** (body[9].children[0].text): No source named for these reports; cite one or soften Post: «Businesses in corridors with decorative surface treatments report measurable increases in foot traffic and dwell time. N»
- **playgrounds-recreation** (body[7].children[0].text): Which study? Name and link it before the figures below stand Post: «A study on Boston schoolyards»
- **vision-zero-surface-markings** (body[0].children[0].text): No source for the $11–14 million figure; name one or cut Post: «$11–14 million»
- **vision-zero-surface-markings** (body[3].children[0].text): Figure uncited; link the Transport Canada or IIHS source, or cut Post: «reduce pedestrian-involved collisions by 30–50% at uncontrolled intersections»
- **vision-zero-surface-markings** (body[6].children[0].text): Book gives TrafficPatterns 8+ and TrafficPatternsXD 10+; also in body[13] Post: «5–7 years»
- **community-identity-surface-design** (body[4].children[0].text): 6 to 8 times paint has no source in the book Post: «6–8 times the lifespan of spray-applied paint»
- **community-identity-surface-design** (body[8].children[0].text): 'than any alternative' has no source; say lower cost per year Post: «a lower cost per year of visibility than any alternative horizontal medium.»
- **community-identity-surface-design** (body[10].children[1].text): 25 to 40 percent has no source; cut or cite Post: «Foot traffic in BIA districts with branded crosswalks typically increases 25–40% over baseline.»
- **performance-crosswalks-asphalt-concrete** (title): glossary: TrafficPatternsXD is asphalt only; concrete needs a source Post: «Asphalt & Concrete»
- **surface-signage-wayfinding** (body[13].children[0].text): Jet wash is not on AirMark's sheet; source it or cut. Post: «maintained under continuous exposure to jet wash and de-icing chemicals»
- **surface-signage-wayfinding** (body[15].children[0].text): The book gives PreMark 6–8 years, not 6–8 times paint. Post: «6–8x»
- **surface-signage-wayfinding** (body[26].children[0].text): HUB's number is 27 years since 1999; 30 years is StreetPrint's. Post: «the 30-year installation track record»
- **durable-transit-lanes-crossings** (body[5].children[0].text): Cure time needs the MMAX sheet's figure, and an en dash. Post: «Cure time in the 30-60 minute range»
- **durable-transit-lanes-crossings** (body[5].children[0].text): The book gives TrafficPatternsXD 60 BPN, ASTM E303; source this. Post: «BPN 65+»
- **traffic-calming-surface-design** (body[6].children[0].text): Which York Region study? Name it or the figure goes. Post: «York Region documented reductions in 85th-percentile operating speeds of 8–12 km/h»
- **traffic-calming-surface-design** (body[9].children[0].text): The book gives TrafficPatternsXD 60 BPN, ASTM E303; source this. Post: «BPN 65+»
- **best-crosswalks-canada** (body[7].children[0].text): Which ministry, which requirement? The book gives 60 BPN, ASTM E303. Post: «Exceeds MOT requirements»
- **decorative-crosswalk-meridian** (body[10].children[1].text): Which requirement? The book says StreetBond meets ASTM E303. Post: «that exceed all government-regulated vehicle skid-resistance requirements»
- **pedestrian-safety-solutions** (body[32].children[0].text): A return-to-service time needs the maker's sheet. Post: «Immediate return to service: no curing time»
- **pedestrian-safety-solutions** (body[35].children[0].text): The book gives TrafficPatternsXD 10+ years; the post says 5–10. Post: «Proven 5–10 year durability in heavy traffic environments»
- **pedestrian-safety-solutions** (body[38].children[0].text): Glossary: TrafficPatternsXD is not beaded; cut this bullet. Post: «Embedded glass beads maintain night visibility without degradation»
- **corporate-logos-branded-pavement** (body[13].children[0].text): 'Permanent' needs a source; glossary allows 'for its service life'. Post: «in a medium that is genuinely permanent»
- **corporate-logos-branded-pavement** (body[22].children[1].text): No DecoMark BPN on a sheet we hold; cite PPG or cut. Post: «BPN (British Pendulum Number) ≥ 55 for pedestrian applications»
- **corporate-logos-branded-pavement** (body[24].children[1].text): DecoMark has no 10-year figure in the book; cite or cut. Post: «Formulated for minimum 10-year exterior colour retention.»
- **asphalt-concrete-renewal** (body[6].children[0].text): Binder and elasticity claims need GAF's sheet; 'coats and seals' is safe. Post: «DuraShield penetrates and reseals the existing binder, restoring elasticity and stopping further oxidation»

## Rewrite candidates (the reviewers' notes)

- **best-crosswalks-canada**: A 2019 sales page: 'speaks volumes', 'the solution' twice, 'unprecedented', 'exceed performance expectations', and it calls TrafficPatternsXD stamped asphalt, which is StreetPrint's name. Worst lines fixed; 'Exceeds MOT requirements' needs a province and a number before it stays.
- **branded-crosswalks-vancouver-richmond**: A brochure in bullet points: 'Key Benefits', 'Results Across Both Cities', 'Conclusion', each a list of slogans, and the excerpt names the wrong system for Richmond. Twelve fixes plus the trademark cuts; the piece wants writing again from the two jobs.
- **commercial-applications**: Five paragraphs of retail-marketing filler (COVID, BOPIS, an ICSC statistic) before the job, 'HUBSS' in prose, and TrafficPatternsXD called stamped asphalt throughout; the job itself is three thin paragraphs. Worst fixed; a rewrite from the job's record would serve Doug better. Left: 'Solution' as a heading, 'large scale' and 'well planned' hyphens, 'Kitchener Municipality'.
- **community-branding-case-study**: A 2023 brochure, not a case study: it opens with an About-us blurb, says 'HUBSS' in prose, mixes US spellings, and has sentences that mean nothing ('solutions that are perfectly aligned with the solution and intent'). The worst twelve are fixed; the tables and the 'luxury lifestyle' copy are still there. Rewrite it from the Square One record of the job.
- **corporate-logos-branded-pavement**: Brand-agency jargon from the first line to the last: 'ground plane', 'institutional arrival', 'layered identity system', 'brand standards performance'. The facts and structure are sound; the worst twelve lines are fixed here and three spec claims (BPN 55, 10-year colour, 'genuinely permanent') need a sheet or a cut. Lint: title recased with the colon removed; body[5] reversal and lifespan fixed; body[8] 'premium' fixed.
- **cycling-transit-integration-surface-solutions**: A bullet-point brochure with a contradiction at its centre: Red MMAX for bus lanes in the title and headings, green pigment and bike lanes in the body (the white paper says green for bicycle lanes in London). Twelve fixes plus trademark cuts; it wants writing again once the colour and the lane are settled.
- **decorative-asphalt-crosswalks**: A 2021 overview that calls TrafficPatternsXD stamped asphalt, DuraTherm imprinted and TrafficPatterns heat fused; the grammar slips ("out perform longer", "less maintenance issues") and every heading is "Product: Praise". "Decorative asphalt crosswalks" stays where it is the post's search phrase. Better rewritten as a short guide to the four decorative crosswalk systems.
- **decorative-crosswalk-commercial-drive**: A 2019 post pasted from somewhere else: broken grammar, American spelling, 'outstanding products with superior installations', and a closing 'we wanted to give some definition' that reads as an unattributed quote from the City or the BIA. Nine fixes make it readable; a short rewrite from the job record, with that quote sourced or dropped, would be better.
- **decorative-crosswalks-community-identity**: The strongest idea in the set, undercut by 'permanent' five times, a paragraph on paint and three colon headings. Fixed where local; the Vancouver impact claims need a named source or softer verbs.
- **decorative-hardscape-grey-is-new-black**: The old SEO kind of post: 'solutions' eleven times, 'ensuring' seven, every section closing on a summing-up line, three case studies with no named project, and an FAQ answer that repeats a paragraph word for word. These edits clear the title, the first screen, the headings, the glossary errors and the spellings; still left for the rewrite are 'ensures' in the two slip bullets, 'seamlessly' and 'ensuring' in the case studies, the FAQ heading and its repeated answer, and two colon headings. Doug would rather see it rewritten from the three products' book pages than patched further.
- **decorative-paving-solutions**: A 2025 marketing piece Doug would call gobbledygook from the first line: reversals, pull quotes built on 'Think of it as', seven ® marks and a DecoMark description that has the material embedded in the pavement. The edits fix the lint list, the ® marks and the system descriptions; the Q&A and the closing pitch still need a rewrite, and the list runs past twelve because the lint alone was twelve.
- **durable-coatings-waterparks**: A 2019 product note in the old GAF phrasing, with a grammar slip in most paragraphs; the balance-of-hardness point at the end is the one worth keeping. The "Waterproof Coatings" heading is not supported by anything in the body and is left for Doug. Better rewritten around a named splash pad job if there is one.
- **durable-transit-lanes-crossings**: Built on paint as the subject: the title, the opening paragraph and half the sentences are about paint failing. Cut to one sentence on paint and one on what goes in instead, the two case studies stand up on their own. The 30-60 minute cure and BPN 65+ figures need the sheets; the book says 60 BPN.
- **extending-transit-lane-lifespan**: Four real jobs written as a product sheet: every bullet is "engineered for", "high-performance", "enhances", and the York Region section calls TrafficPatternsXD inlaid. ™ sits on all 20 product names and the spelling is American throughout; those strips make up most of the edits here. Keywords "transit lane lifespan" and "pavement lifecycle cost" are left: they go only to schema and search matching, never onto the page, and lifespan is what people type. Worth rewriting as four short project records.
- **multimodal-connectivity-york-region**: A 2024 case study written in transit-consultant English: 'modal transition points', 'pedestrian channelling', 'performance surfacing', 'high-impact transit environments', with ™ on every product. The York Region and London facts are worth keeping; the prose needs a person to retell it. Worst lines fixed here; 'bicycle lanes' (body[26]), the bold triplet in body[6] and the Results bullets remain. Lint: both items fixed.
- **murrayville-schoolhouse-sidewalk**: Two lines about the job, then the DecoMark sheet pasted twice with Uses and Places lists under it. The repeat is cut and the sheet copy tidied; a real profile would say what was laid, where and when, with the photograph doing the rest.
- **pedestrian-channelization-public-spaces**: A 2019 post with good facts (three named promenades, 5,600 square metres, Cobalt Blue, Safety Blue, Civiliti) and prose nobody edited: an opener with no grammar, fragments, a word-salad close. These edits make it read; it is worth a rewrite from the same facts. 'StreetBond150 Pavement Coatings' is the maker's old product name and stays as written; the places heading names Vancouver, which the post never visits.
- **pedestrian-walkways-surface-systems**: A sound guide with a machine accent: three colon headings, five reversals and a 'decades' claim that StreetBond's 8+ years cannot carry. The worst are fixed here; it wants one pass in a single voice.
- **performance-crosswalks-asphalt-concrete**: A 2018 stub: it promises a Kelowna wear comparison and never shows it, still says 'plans for more in 2017', and its premise (asphalt and concrete) conflicts with the glossary's asphalt-only for TrafficPatternsXD. Terminology and grammar fixed; retire it or rewrite it as the Kelowna project post.
- **playgrounds-recreation**: A 2023 case study in WordPress SEO dress: bolded keyword phrases, 'solution' and 'transform' throughout, American spelling, and an unnamed Boston study carrying the numbers. The Seferian and Doug quotes are the good part; a rewrite should be built around them.
- **residential-driveways-stamped-asphalt**: A useful guide in a salesy blog voice: a reversal in nearly every section, two runs of fragments, 'Here's the part that matters most', and a 20-year claim three times over (the book says StreetPrint 10–20, StreetBond 8+). The worst fixed; still there: the three 'vs.' subheads (say 'Compared with…'), DuraShield 'seals' (it coats), 'colour systems', '24 hours' with no maker's sheet, 'Ladysmith, BC' in prose, and 'Seamless' in the table.
- **residential-driveways-stamped-asphalt-upgrade**: Homeowner-marketing voice throughout: reversals, stacked fragments, 'premium', a question heading and a 20-year colour claim the book does not support. Worst 12 fixed and two claims flagged. A rewrite should also spell out BC (body[30], body[48], alt body[49]), drop 'seamless' (body[8], body[36]) and 'colour system' (body[12], body[19]), and lose 'The honest summary' (body[26]). Title left to the case pass.
- **richmond-brighouse-crosswalk**: A 2020 product-sheet paste under a two-sentence project record. Grammar slips in most paragraphs, 'stamped asphalt' for a system that is stamped into asphalt, 'applicators' three times, 'wheelchair-friendly'. The job itself (TransLink, No. 3 Road) deserves a real write-up; the ISO 9001 line and the ampersand labels are left for it.
- **roadway-accents-natures-walk**: A project profile with no project in it: a town, then two paragraphs of brochure copy under question headings ('superior decorative surface solution', 'bonds permanently'). The edits make it honest; it needs the job's facts (what was done, where on the road, who installed it), a first-mention link to /products/streetprint reading 'StreetPrint stamped asphalt', and an SEO description (the excerpt, 136 characters, would serve).
- **safety-durability-transit-stations**: Same family as the York Region piece and weaker: a subtitle as an h2, 'high-performance' and 'modal transitions' throughout, 'Thermoplastic inlay process' (that is DuraTherm, not TrafficPatternsXD), 'Toronto, York Region' as a place, and US spelling. Worst lines fixed; still to do in a rewrite: 'freeze–thaw' with an en dash (body[4], [24], [36]), 'color' (body[37]), 'Non-slip performance' (body[16]), 'LRT & BRT' (body[12]), and body[43] says nothing. Lint: all three items fixed.
- **simcoe-rainbow-crosswalk**: A good story (Ryder, the two-year campaign, Multiseal) buried under gush: reversals in five paragraphs, "enduring beacon", "boundless possibilities", a colon on every heading, and one paragraph pasted twice (body[9] and body[11]). The edits take the worst out; the piece wants rewriting at half the length around the facts it has.
- **streetbond-leed-urban-heat-island**: Brochure copy in a 'guide' of under 200 words: 'specification-ready intervention', 'advanced pigments', 'deployed', and a LEED v4 credit list the site's own rule (v5, SR 0.33) makes stale. Worst fixed and the two claims flagged; a rewrite against LEED v5 and the maker's SR figures would be the honest fix.
- **streetbondsr-solar-reflective-coatings**: A 2023 case study in brochure voice ('active contributor to environmental performance metrics', 'curated SRI-optimized palette') with no figure for what Osoyoos measured and two unsourced 'becoming standard' claims. Worst 12 fixed; it still talks SRI and LEED v4 where the site says SR and v5, and body[3]'s 'redirect a significant portion' and body[10]'s 'fundamental challenge' remain. A short rewrite from the job record would serve it better.
- **surface-signage-wayfinding**: Reads as machine marketing from start to finish: two taglines ('The ground is the new sign system', 'The surface is the sign'), 'ground plane' four times, a triplet in most paragraphs and a 30-year claim HUB does not hold. The worst are fixed here. The Spirit Trail is on the North Shore rather than in Vancouver proper; worth a check before the next edit.
- **transportation-infrastructure-guide**: A resource index written in procurement-speak ('curated resource portal', 'performance specification', 'modal transition zones'). The four case studies are the real content and all four are Canadian, so 'international' in the intro has nothing behind it; the author should cut it or add one. Worst sentences fixed here.
- **vancouver-decorative-crosswalk-design**: A concept piece in sales voice: 'arsenal', 'ideal choice', 'announcing arrival', paint three times, and ™ or ® on nearly every product name (all cut below; those are mechanical). The excerpt says Granville & 41st and the heading says Granville & 68th; the author should say which. The worst sentences are fixed here.
- **vision-zero-surface-markings**: The voice is fine; the facts are not. TrafficPatterns and TrafficPatternsXD are called retroreflective (they are not beaded), their service life is given as 5–7 years against the book's 8+ and 10+, and the $11–14 million and 30–50% figures have no source. Rewrite around the FHWA crosswalk study HUB already cites.
- **vision-zero-thermoplastic-crosswalks**: Paint is the subject from the title to the cost section, and the argument rests on retroreflectivity, which the glossary says TrafficPatterns and TrafficPatternsXD do not have (PreMark and AirMark do); BPN 65+ also beats the book's 60. The paint section is cut to its one Vision Zero sentence (four blocks go, so four entries); still to do: 'full retroreflective performance' at Brighouse (body[12]), 'thermoplastic' alone in body[13] and [16], 'measurably better safety performance' with no measure, the summing line at body[17], and 'installation contractor' (certified installer).
- **white-paper-resilient-transit-infrastructure**: A 2025 marketing white paper: every case study ends in the same gush (enhanced, elevated, seamless, strategic) and the six h3s are 'Place: Project' couplets. The glossary hits and the worst gush are fixed here; the last bullet is cut off in the export (' t') and needs checking live. Worth rewriting as a plain guide for public works.
- **white-paper-transportation-urban-design**: Reads as a brochure: every paragraph carries a triplet or a superlative, the four project headings are 'Place: Project' couplets, and 'Why Engineers Choose HUB' is a list of slogans. The worst are fixed here (plus two mechanical table cells); it wants writing again as a plain guide with the four jobs as its spine.

## Edits per post

- extending-transit-lane-lifespan (rewrite-candidate): 37
- vancouver-decorative-crosswalk-design (rewrite-candidate): 32
- decorative-hardscape-grey-is-new-black (rewrite-candidate): 26
- white-paper-resilient-transit-infrastructure (rewrite-candidate): 24
- decorative-paving-solutions (rewrite-candidate): 21
- pedestrian-channelization-public-spaces (rewrite-candidate): 19
- veterans-crosswalk-kitchener (improve): 19
- branded-crosswalks-vancouver-richmond (rewrite-candidate): 18
- transportation-infrastructure-guide (rewrite-candidate): 18
- cycling-transit-integration-surface-solutions (rewrite-candidate): 17
- durable-transit-lanes-crossings (rewrite-candidate): 17
- simcoe-rainbow-crosswalk (rewrite-candidate): 17
- multimodal-connectivity-york-region (rewrite-candidate): 17
- residential-driveways-stamped-asphalt (rewrite-candidate): 16
- vision-zero-thermoplastic-crosswalks (rewrite-candidate): 16
- white-paper-transportation-urban-design (rewrite-candidate): 16
- decorative-crosswalks-community-identity (rewrite-candidate): 16
- traffic-calming-surface-design (improve): 16
- community-spaces (improve): 16
- decorative-asphalt-crosswalks (rewrite-candidate): 16
- white-rock-langley-trafficpatterns (improve): 16
- safety-durability-transit-stations (rewrite-candidate): 16
- commercial-spaces-decorative-pavement (improve): 15
- commercial-applications (rewrite-candidate): 15
- richmond-brighouse-crosswalk (rewrite-candidate): 15
- community-identity-surface-design (improve): 15
- surface-signage-wayfinding (rewrite-candidate): 15
- pedestrian-safety-solutions (improve): 15
- educational-facilities (improve): 14
- playgrounds-recreation (rewrite-candidate): 14
- best-crosswalks-canada (rewrite-candidate): 14
- ubc-musqueam-crosswalk (improve): 13
- pedestrian-walkways-surface-systems (rewrite-candidate): 13
- university-campus-surface-branding (improve): 13
- asphalt-concrete-renewal (improve): 13
- residential-driveways-stamped-asphalt-upgrade (rewrite-candidate): 12
- thermoplastic-colour-selection (improve): 12
- snowplow-safe-decorative-pavement (improve): 12
- streetbondsr-solar-reflective-coatings (rewrite-candidate): 12
- municipalities-case-study (improve): 12
- laneway-project (improve): 12
- stamped-asphalt-vs-concrete (improve): 12
- community-branding-case-study (rewrite-candidate): 12
- corporate-logos-branded-pavement (rewrite-candidate): 12
- streetbond-leed-urban-heat-island (rewrite-candidate): 11
- pictograph-crosswalk-sechelt (improve): 11
- keeping-pedestrians-safe (improve): 11
- vision-zero-surface-markings (rewrite-candidate): 11
- decorative-crosswalk-meridian (improve): 11
- durable-coatings-waterparks (rewrite-candidate): 11
- london-east-link-brt (improve): 10
- the-street-is-your-canvas (improve): 10
- decorative-crosswalk-commercial-drive (rewrite-candidate): 9
- commercial-parking-reit-specification (improve): 9
- trafficpatternsxd-urban-design (improve): 9
- bowen-island-asphalt-path (improve): 9
- decorative-asphalt-high-traffic (improve): 9
- white-rock-pier-crosswalk (improve): 9
- murrayville-schoolhouse-sidewalk (rewrite-candidate): 9
- spirit-trail-wayfinding-vancouver (improve): 9
- toronto-premium-outlets-14-years (improve): 9
- performance-crosswalks-asphalt-concrete (rewrite-candidate): 9
- bc-childrens-hospital-labyrinth (improve): 8
- parc-riviera-streetbond-walkway (improve): 8
- roadway-accents-natures-walk (rewrite-candidate): 7
- hub-certified-installer-network (improve): 7
- complete-streets-new-westminster (improve): 7
- terry-fox-plaza-coquitlam (improve): 6
- every-child-matters-crosswalk (improve): 6
- geary-works-toronto-park-walkway (improve): 5
- stamped-asphalt-parking-lot (improve): 5
- how-stamped-asphalt-is-installed (improve): 4
- tsain-ko-crosswalk-sechelt (improve): 3
- parking-lot-sealcoating-vs-maintenance-coating (fine): 1
- parking-lot-line-painting-vs-thermoplastic (fine): 1

## What the lint learned

The words the reviewers cut most that lib/style-lint.ts did not know: the singular "solution" as a product, high-performance, ground plane, aesthetics, transform, enduring and long-lasting, vibrant, enhance, "engineered for", "ideal for", "delivers performance". Studio warns on each now and the drafters' style pass reads the same rules (docs/STYLE.md, Words we don't use).

