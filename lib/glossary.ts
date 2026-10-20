/**
 * The site's glossary, in the form the AI writers read (lib/field-note-drafter.ts,
 * lib/social-drafter.ts, lib/insights-planner.ts). The people's version, with
 * definitions and sources, is docs/GLOSSARY.md; the two say the same things.
 * Written for Doug's copy round, 17 Oct 2026 ("get the phraseology right,
 * about the systems technology that's accurate but not over technical").
 *
 * The lint that warns on the words to avoid is in lib/style-lint.ts (rule
 * "glossary"); `npm run test:copy` checks it.
 */
export const GLOSSARY_FOR_WRITERS = `GLOSSARY (docs/GLOSSARY.md): say what a material is and does in the maker's words or the printed Product Portfolio Book's, then plain English. The terms, and the words that are wrong:
- "preformed thermoplastic" (one word each): factory-made sheets of marking material, laid on the pavement and heated until they bond to it. Never "pre-formed", "thermo-plastic" or "melted on".
- How each system goes in. TrafficPatterns, DecoMark and PreMark are heat-applied to the surface and bond to it (never "heat-fused into the road", "fuses permanently", "becomes part of the road"). TrafficPatternsXD is heated on prepared asphalt and stamped through into the top of the asphalt (asphalt only, never concrete). DuraTherm is inlaid: the asphalt is stamped first and the thermoplastic is set into the impressions, below a plow blade. StreetPrint is stamped asphalt: a pattern pressed into heated asphalt with a steel wire-rope template, then coloured with StreetBond coatings (never "imprinted", "printed asphalt" or "asphalt texturing" in prose).
- Anti-skid aggregate is mixed right through the thermoplastic ("intermixed through the full cross-section"). "Skid resistance" is a tyre on the surface; "slip resistance" a shoe, usually wet. Give a number only where HUB has one (TrafficPatterns and TrafficPatternsXD: 60 BPN, ASTM E303). Never "ASTM-rated" on its own.
- Retroreflective means glass beads bounce a headlight back: true of PreMark and AirMark only. TrafficPatterns, TrafficPatternsXD, DecoMark and DuraTherm are decorative and anti-skid, not retroreflective.
- "125 mil" with a space (a thousandth of an inch; 125 mil is about 3 mm). Thicknesses: TrafficPatterns 125 mil, TrafficPatternsXD 150 mil, DuraTherm 90 mil, PreMark 125 mil (90 mil ViziGrip).
- StreetBond and DuraShield are "pavement coatings": two-part, water-based, epoxy-modified acrylic. Never "paint", "sealer", "sealcoat" or "stain". StreetBondSR is StreetBond formulated to reflect: "solar reflectance (SR) of 0.33 or higher", for the LEED v5 heat-island credit (non-roof). Never mix SR with SRI, never "LEED v4".
- MMAX: "methyl methacrylate (MMA)" once, then MMA; a two-part resin marking that cures cold in 45 to 60 minutes, with hard aggregate. Its uses are "area markings": coloured bike lanes, red bus lanes, transit priority lanes. Never "transit signal priority corridors".
- One term for how long a system lasts: "service life" (never "life cycle" or "lifespan"), per system from the book: StreetPrint 10 to 20 years, TrafficPatternsXD 10+, TrafficPatterns 8+, StreetBond 8+, PreMark 6 to 8. No sitewide "20-year" claim.
- HUB's crews are "certified installers" (never "applicators", the makers' word). The readers are "specifiers"; to "specify" is to name the system in the tender.
- The road: "crosswalk" (never "pedestrian crossing" or "crossover" for a marking; a "pedestrian crossover (PXO)" is an Ontario control type, used only when the project was one); "zebra" and "ladder" are marking types; "stop bar"; "bike lane" and "bus lane" (spell out "bus rapid transit (BRT)" once); "bike box", "green conflict zone"; "traffic calming" means speed tables, raised crosswalks, curb extensions and gateways (never "speed bumps" on a road).
- "accessible" and the standard the project met (CSA B651, AODA in Ontario); a material is not "AODA-compliant" by itself; never "ADA" for a Canadian project. "Vision Zero" and "Complete Streets" are programs a project can support; there is no "Vision Zero standard" and nothing is "Vision Zero aligned".
- Claims with no source are not written: no "provincially approved across Canada", no "safe to fall on", no "jet blast", no "Halifax to Vancouver", no "permanently". The company's numbers are the book's only: since 1999, 27 years, 1,000+ projects, coast to coast.
- Paint is not the subject (Vern, 20 Oct 2026: "don't talk about paint so much"). HUB sells no paint, and an article is about what HUB's systems are and do, never a case against paint: no "beyond paint", "vs paint", "outlasts paint" headlines or sections, no paragraphs on how paint fails. Where the reader's own question is about paint, one plain sentence says what the system is instead, and the article moves on.`;

/** The same rules, one line, for the planner's titles and briefs. */
export const GLOSSARY_FOR_TITLES = `Use the site's glossary words in titles and briefs (docs/GLOSSARY.md): "preformed thermoplastic", "stamped asphalt", "pavement coating", "crosswalk", "bike lane", "bus lane", "service life", "certified installer"; never "pedestrian crossing", "paint" for a coating, "life cycle", "applicator" or "solutions". Paint is never the subject of an article: no "vs paint", "beyond paint" or "why paint fails" titles or briefs (Vern, 20 Oct 2026).`;
