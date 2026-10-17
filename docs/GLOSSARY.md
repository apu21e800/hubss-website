# Glossary: how hubss.com talks about the systems

One page, for everyone who writes a word that reaches the site. Written for Doug's
copy round, 17 Oct 2026 ("get the phraseology right, about the systems technology
that's accurate but not over technical"). The AI writers read the same rules
(`lib/glossary.ts`); Studio warns on the words to avoid (`lib/style-lint.ts`, rule
`glossary`; `npm run test:copy`).

The rule behind every line: say what the material is and what it does, in the
maker's words where the maker has them, in the printed Product Portfolio Book's
words where the book has them, and in plain English everywhere else. A term the
reader would have to look up is explained once, then used.

Sources, in the order they win: the printed Product Portfolio Book, Volume 5
(`lib/product-catalogue.ts`, `lib/application-catalogue.ts`, `lib/idea-book-print.ts`);
the makers' sheets (GAF/StreetBond for StreetPrint, StreetBond, StreetBondSR and
DuraShield; PPG Ennis-Flint for TrafficPatterns, TrafficPatternsXD, DecoMark,
DuraTherm, PreMark, AirMark and MMAX; Geveko Markings for ChipFill and AggreFill;
WVCO for Fast Patch DPR; the copies in `public/docs`); Canadian practice (Toronto's
crosswalk marking policy, Peterborough's pavement marking specification on OPSS 710,
CSA/ASC B651:23); then `docs/STYLE.md`.

## The materials and how they go in

| Term | Use it for, and what it means | Avoid | Source |
| --- | --- | --- | --- |
| preformed thermoplastic | Sheets of thermoplastic marking material made in a factory, cut to shape, laid on the pavement and heated until they bond to it. One word each, no hyphen. The family name on the site is Preformed Thermoplastics. | pre-formed, thermo-plastic, "thermoplastic" alone for a product (it is also the hot-poured road paint), "melted on" | PPG TS001 to TS005 |
| heat-applied | The act: the material is heated with a propane torch or an infrared heater and bonds to the surface. | heat-fused into the road, fuses permanently, welded, baked | PPG: "surface applied ... with a propane heat torch or infrared heater" |
| surface-applied | TrafficPatterns, DecoMark and PreMark sit on the pavement surface (125 mil, about 3 mm) and bond to it. The pavement is not cut or stamped. | "becomes part of the road", "flush to grade" for these three | PPG TS001, TS004: DecoMark "does not alter or impair the substrate" |
| stamped into the asphalt (TrafficPatternsXD) | The sheets are heated on prepared asphalt and a wire-rope grid presses a pattern through the material into the top of the asphalt. Asphalt only. | "heat-fused into asphalt or concrete" | PPG TS002: "positioned on a non-stamped, prepared asphalt surface ... stamps a pattern into the material and the top layer of the asphalt" |
| inlaid (DuraTherm) | The asphalt is heated and stamped first; precut 90 mil thermoplastic "grout lines" are set into the impressions and bonded with the heater. It sits just below the surface, out of a plow's way. | "full-depth"; "zero profile" in body text (the book's subhead keeps it) | PPG TS003 |
| stamped asphalt (StreetPrint) | A pattern pressed into heated asphalt with a steel wire-rope template and a plate compactor, then coloured with StreetBond coatings. HUB's product since 1992. | imprinted asphalt, printed asphalt, asphalt texturing, decorative asphalt (except in the makers' own document titles) | StreetPrint FAQ; GAF stamping templates page |
| anti-skid aggregate | Hard grit mixed right through the thermoplastic, so grip stays as the surface wears. The book's phrase: "intermixed through the full cross-section". | performance aggregates; "corundum" except for MMAX; "not broadcast across the top" | PPG: "anti-skid elements distributed evenly throughout material; as material wears, new anti-skid elements are exposed" |
| skid resistance, slip resistance | Skid: a tyre on the surface. Slip: a shoe on it, usually wet. The book gives TrafficPatterns and TrafficPatternsXD "60 BPN, ASTM E303"; StreetBond and DuraShield "meet ASTM E303". Cite the number only where HUB has it. | ASTM-rated (names nothing), "non-slip" as a promise, BPN with no number | Book pp. 11, 13; GAF SB 150 and DuraShield pages |
| retroreflective, retroreflectivity | Glass beads in the material bounce a headlight back to the driver. True of PreMark and AirMark. Not of TrafficPatterns, TrafficPatternsXD, DecoMark or DuraTherm: those are decorative and anti-skid, not beaded. | "ASTM-rated retroreflectivity" on a decorative crosswalk | PPG TS005, TS007; the May 2026 claims audit |
| mil | A thousandth of an inch. 90 mil is 2.3 mm, 125 mil 3.2 mm, 150 mil 3.8 mm. Write "125 mil" with a space, no "mils". | 125mil; "3 mm thick thermoplastic" (the makers quote mil) | PPG; docs/STYLE.md |
| pavement coating | GAF's word for StreetBond: a two-part water-based, epoxy-modified acrylic coating for asphalt and concrete. DuraShield is a "pavement maintenance coating" of the same chemistry. | paint, sealer, sealcoat, stain; "colour system" in body text (the book's subhead keeps it) | GAF SB 150 and DuraShield pages |
| MMA, methyl methacrylate | A two-part resin marking that cures cold in minutes; MMAX is PPG's MMA area marking with hard aggregate and colourfast pigment. Spell it out once, then MMA. | "MMA resin" and "methyl methacrylate" in the same sentence; cold plastic | PPG MMA page; MMAX brochure |
| area marking | PPG's term for a coloured lane treatment: a bike lane, a bus lane, a box. For the public: "coloured bike lane", "red bus lane". | field marking | PPG MMAX |
| solar reflective, SR, SRI | Solar reflectance (SR, 0 to 1) is what LEED v4 and v5 use: 0.33 or higher counts for the non-roof heat-island credit. SRI (0 to 100) is the older index on the StreetBondSR brochure (29 or higher). Use SR with LEED v5; SRI only when quoting the brochure. | mixing SR and SRI; "high SRI" with no number; LEED v4 | Book p. 29; StreetBondSR brochure; GAF DuraShield page (SR 0.34) |
| urban heat island | The measurable temperature difference between a city and the country around it; dark pavement is a cause. | "heat-island effect" with no explanation | The LEED page's own line |
| service life | How long the surface does its job before recoating or replacement. Per system, from the book: StreetPrint 10 to 20 years, TrafficPatternsXD 10+, TrafficPatterns 8+, StreetBond 8+, PreMark 6 to 8. One term. | life cycle, lifespan, "20-year" sitewide, "multi-year" | Book; CLAUDE.md |
| substrate | The asphalt or concrete under the coating or marking. For the public: "the pavement underneath". | base (means the gravel); "sound pavement" without saying what that is | GAF substrate guide |
| certified installer | HUB trains and certifies the crews that install its systems. One term on the site. | applicator (the makers' word), contractor network, "territory-protected" | HUB; PPG and GAF say "certified applicator" |
| specifier, specify | The engineer, landscape architect or planner who writes the tender; to specify is to name the system in it. Fine on pages for them; not in headings for the public. | "Specify these systems for Crosswalks" as a heading | docs/STYLE.md |

## The road

| Term | Use it for, and what it means | Avoid | Source |
| --- | --- | --- | --- |
| crosswalk | The Canadian word for a marked pedestrian crossing. A "decorative crosswalk" is one with a brick, stone or art surface. | pedestrian crossing (UK), crossing, "crossover" | Toronto crosswalk policy; Peterborough spec |
| pedestrian crossover (PXO) | An Ontario control type with its own signs and rules, not a kind of marking. Use only when the project was one. | PXO as a synonym for crosswalk | Toronto Vision Zero attachment |
| zebra, ladder | Marking types: zebra adds stripes along the crossing; ladder adds them between the two edge lines. Use when describing a real marking. | "ladder lines" as a product | Toronto policy; Peterborough spec (CP 710.01) |
| stop bar, stop line | The white line where vehicles stop. Peterborough and the book say stop bar. | stop stripe | Peterborough spec |
| bike lane, bus lane | The site's words (TAC and OTM write "bicycle lane"). Spell out "bus rapid transit (BRT)" once on a page. | cycle lane (UK); "transit signal priority corridor" | Site; PPG |
| bike box, green conflict zone | Real Ontario terms: the green area ahead of a stop line for cyclists; a green patch where bikes and cars cross. Fine in guides. | | Peterborough spec |
| traffic calming | Measures that slow drivers: speed tables, raised crosswalks, curb extensions, gateways, narrowed lanes. | speed bumps (a parking-lot device); "physical barriers" | PPG "traffic-calming surfaces" |
| accessible, AODA, CSA B651 | Say "accessible" and name the standard the project met. A material is not "AODA-compliant" on its own; a design is. | ADA (US); "wheelchair friendly" as a claim | CSA/ASC B651:23; the PPG sheets say ADA |
| Vision Zero, Complete Streets | Named programs, capitalised. A system can "support" a program; there is no "Vision Zero crosswalk standard". | Vision Zero aligned, Vision Zero standards | CLAUDE.md proof points |
| LEED v5 | The current rating system; the heat-island credit is "Sustainable Sites: Heat Island Reduction (non-roof)". | LEED v4; LEED Silver as a product claim | Book p. 29; docs/STYLE.md |

## HUB's own words

| Term | Use | Avoid |
| --- | --- | --- |
| HUB Surface Systems, then HUB | Always. | Hub, HUBSS in prose |
| the ten systems | StreetPrint, StreetBond, StreetBondSR, TrafficPatterns, TrafficPatternsXD, DecoMark, DuraTherm, DuraShield, PreMark, MMAX. AirMark and the three repair products sit outside the ten. | "14 systems", counts as a boast |
| families | Preformed Thermoplastics, Coatings, Stamped Asphalt, Asphalt & Concrete Repair. | Pavement Markings as a family |
| the Product Portfolio Book · Volume 5 | The printed book and its reader. | Product Book, Idea Book, catalogue |
| Insights | The blog; a piece is a project, a guide or an article. | Field Notes, blog in headings |
| Lunch & Learn | HUB's free session for a design or engineering team. | L&L, lunch and learn |
| Resources | The specification library. | downloads |
| the numbers | Since 1999; 27 years; 1,000+ projects; coast to coast; per-system service life. "10 provinces" is the book's number: it stays where the book says it and goes nowhere new. | 500+; 30+ years for the company (true of StreetPrint only); "Halifax to Vancouver" |

## Claims that need a source before they are written

- "Provincially approved" (name the province's list, or cut).
- "Safe to fall on" (a coating is not an impact surface; CSA Z614 is a different thing).
- "Helipads", "jet blast", "rubber removal" (not on AirMark's sheet).
- "Permanent", "permanently" (every system has a service life).
- Any BPN, SR, cure time or return-to-service time the maker's sheet does not give.
