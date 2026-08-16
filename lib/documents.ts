// lib/documents.ts
// Canonical document registry for all HUB Surface Systems PDF resources.
// Used by:
//   - DocumentDownloads component (per-product sidebar on individual product pages)
//   - lib/resource-documents.ts  (flat list for the /resources page)

export type DocType =
  | "spec"
  | "tds"
  | "colour"
  | "installation"
  | "brochure"
  | "faq"
  | "design"
  | "application"
  | "certificate"
  | "other";

export interface ProductDocument {
  label: string;
  href: string;
  type: DocType;
  lang?: string;
}

export const docTypeLabel: Record<DocType, string> = {
  spec:         "Specification",
  tds:          "Technical Data Sheet",
  colour:       "Colour Guide",
  installation: "Installation Guide",
  brochure:     "Brochure",
  faq:          "FAQ",
  design:       "Design Manual",
  application:  "Application Guide",
  certificate:  "Certificate",
  other:        "Document",
};

// All product docs keyed by product slug.
// Paths relative to /public — spaces encoded as %20, brackets as %5B/%5D.
const ALL_DOCS: Record<string, ProductDocument[]> = {

  "traffic-patterns-xd": [
    { label: "Specification",                        type: "spec",         href: "/docs/TrafficPatternsXD/TrafficPatternsXD-Specification-Branded.pdf" },
    { label: "Specification",                        type: "spec",         href: "/docs/TrafficPatternsXD/TrafficPatternsXD-Specification.pdf" },
    { label: "Specification",                        type: "spec",  lang: "FR", href: "/docs/TrafficPatternsXD/TrafficPatternsXD-Specification-FR.pdf" },
    { label: "Two-Component Sealer Spec",             type: "spec",         href: "/docs/TrafficPatternsXD/TrafficPatternsXD-Two-Component-Sealer.pdf" },
    { label: "Cross-Section Detail",                 type: "other",        href: "/docs/TrafficPatternsXD/TrafficPatternsXD-CrossSection-Detail.pdf" },
    { label: "Colour Guide",                         type: "colour",       href: "/docs/TrafficPatternsXD/TrafficPatternsXD-Colour-Guide.pdf" },
    { label: "Technical Data Sheet",                 type: "tds",          href: "/docs/TrafficPatternsXD/TS002_TrafficPatternsXD_220204.pdf" },
    { label: "Design Manual",                        type: "design",       href: "/docs/TrafficPatternsXD/TrafficPatternsXD-Design-Manual.pdf" },
  ],

  "traffic-patterns": [
    { label: "Two-Component Sealer Specification",    type: "spec",         href: "/docs/TrafficPatterns/TrafficPatterns-Specification-Two-Component-Sealer.pdf" },
    { label: "Custom Design Guidelines",              type: "design",       href: "/docs/TrafficPatterns/TrafficPatterns-Custom-Design-Guidelines.pdf" },
    { label: "Technical Data Sheet",                 type: "tds",          href: "/docs/TrafficPatterns/TS001_TrafficPatterns_220204.pdf" },
    { label: "Colour Guidelines",                    type: "colour",       href: "/docs/TrafficPatterns/TrafficPatterns-Colour-Guidelines.pdf" },
    { label: "Solid Sheets 125 Specification",        type: "spec",         href: "/docs/TrafficPatterns/TrafficPatterns-Solid-Sheets-125-Specification.pdf" },
    { label: "125 with Self-Adhesive Specification",  type: "spec",         href: "/docs/TrafficPatterns/TrafficPatterns-125-with-SA-Specification.pdf" },
    { label: "Design Manual",                        type: "design",       href: "/docs/TrafficPatterns/TrafficPatterns-Design-Manual.pdf" },
  ],

  "premark": [
    { label: "PreMark XF Brochure",                  type: "brochure",     href: "/docs/PreMark/PreMarkXF-Brochure.pdf" },
    { label: "Technical Data Sheet",                 type: "tds",          href: "/docs/PreMark/TS005_PreMark_220204.pdf" },
  ],

  "duratherm": [
    { label: "Specification",                        type: "spec",         href: "/docs/duratherm/DuraTherm-Specification-Branded.pdf" },
    { label: "Colour Guide",                         type: "colour",       href: "/docs/duratherm/duratherm-colour-guide.pdf" },
    { label: "Technical Data Sheet",                 type: "tds",          href: "/docs/duratherm/TS003_DuraTherm_220204.pdf" },
    { label: "Custom Design Guidelines",              type: "design",       href: "/docs/duratherm/duratherm-custom-design-guidelines.pdf" },
    { label: "Design Manual",                        type: "design",       href: "/docs/duratherm/duratherm-design-manual.pdf" },
  ],

  "decomark": [
    { label: "Application Instructions",             type: "installation", href: "/docs/decomark/decomark-application-instructions.pdf" },
    { label: "Custom Design Guidelines",              type: "design",       href: "/docs/decomark/decomark-custom-design-guidelines.pdf" },
    { label: "Colour Guide",                         type: "colour",       href: "/docs/decomark/decomark-colour-guide.pdf" },
    { label: "Technical Data Sheet",                 type: "tds",          href: "/docs/decomark/TS004_DecoMark_220204.pdf" },
    { label: "Specification",                        type: "spec",         href: "/docs/decomark/DecoMark-Specification.pdf" },
  ],

  "airmark": [
    { label: "AirMark Brochure",                     type: "brochure",     href: "/docs/AirMark/AirMark/AirMark_Brocure.pdf" },
    { label: "AirMark Brochure",                     type: "brochure", lang: "FR", href: "/docs/AirMark/AirMark/AirMark-Brocure-FR.pdf" },
    { label: "PreMark for Airports",                 type: "application",  href: "/docs/AirMark/PreMark%20-%20Groundside/PreMark-for-Airports.pdf" },
    { label: "Airfield Paint Product Data",           type: "tds",          href: "/docs/AirMark/Airfield%20Paint/WB-Airfield-Product-Data.pdf" },
    { label: "Traffic Paint for Airfields",           type: "application",  href: "/docs/AirMark/Airfield%20Paint/TrafficPaint-for-Airfields.pdf" },
    { label: "Traffic Paint for Airfields",           type: "application", lang: "FR", href: "/docs/AirMark/Airfield%20Paint/TrafficPaint-for-Airfields-FR.pdf" },
  ],

  "streetbond": [
    { label: "Brochure",                             type: "brochure",     href: "/docs/StreetBond/StreetBond/StreetBond-Brochure.pdf" },
    { label: "Colour Card — 2026 Edition",           type: "colour",       href: "/docs/StreetBond/StreetBond/StreetBond-Colour-Card-2026.pdf" },
    { label: "Substrate Guide",                      type: "other",        href: "/docs/StreetBond/StreetBond/StreetBond_Substrate_Guide.pdf" },
    { label: "Colorant Technical Data Sheet",        type: "tds",          href: "/docs/StreetBond/StreetBond/StreetBond-Colorant.pdf" },
    { label: "SB120 Technical Data Sheet",           type: "tds",          href: "/docs/StreetBond/StreetBond%20120/StreetBond-SB120-Data-Sheet-12.22-Rev.pdf" },
    { label: "SB120 Specification",                  type: "spec",         href: "/docs/StreetBond/StreetBond%20120/StreetBond_SB120_Specifications.pdf" },
    { label: "SB120 Over Concrete Specification",    type: "spec",         href: "/docs/StreetBond/StreetBond%20120/StreetBond-SB120-Over-Concrete-Specification.pdf" },
    { label: "SB150 Technical Data Sheet",           type: "tds",          href: "/docs/StreetBond/StreetBond%20150/StreetBond-SB150-Data-Sheet-12.22-Rev.pdf" },
    { label: "SB150AL Technical Data Sheet",         type: "tds",          href: "/docs/StreetBond/StreetBond%20150/StreetBond-SB150AL-Data-Sheet-12.22-Rev.pdf" },
    { label: "SB150 Specification",                  type: "spec",         href: "/docs/StreetBond/StreetBond%20150/StreetBond_SB150_Specifications.pdf" },
    { label: "SB150 Over Concrete Specification",    type: "spec",         href: "/docs/StreetBond/StreetBond%20150/StreetBond-SB150-Over-Concrete-Specification.pdf" },
    { label: "Pro 220 Technical Data Sheet",         type: "tds",          href: "/docs/StreetBond/StreetBond%20Pro%20220%20%5BMMA%5D/StreetBond-Pro-220-TDS.pdf" },
    { label: "Pro 220 & 250 Installation Guide",     type: "installation", href: "/docs/StreetBond/StreetBond%20Pro%20220%20%5BMMA%5D/StreetBond-Pro-220-and-250-Intallation.pdf" },
    { label: "Pro 220 & 250 Brochure",               type: "brochure",     href: "/docs/StreetBond/StreetBond%20Pro%20220%20%5BMMA%5D/StreetBond-Pro-220-Pro-250-Brochure-1.pdf" },
    { label: "Pro 250 Technical Data Sheet",         type: "tds",          href: "/docs/StreetBond/StreetBond%20Pro%20250%20%5BMMA%5D/Data-Sheet-StreetBond-Pro-250.pdf" },
    { label: "Concrete Primer QS — Technical Data Sheet", type: "tds",    href: "/docs/StreetBond/StreetBond%20Concrete%20Primer/StreetBond-QS-Concrete-TDS.pdf" },
    { label: "Concrete Primer WB — Technical Data Sheet", type: "tds",    href: "/docs/StreetBond/StreetBond%20Concrete%20Primer/StreetBond-Concrete-Primer-WB-TDS.pdf" },
  ],

  "streetbondsr": [
    { label: "Brochure",                             type: "brochure",     href: "/docs/StreetBondSR/StreetBondSR-Brochure.pdf" },
    { label: "Colour Guide",                         type: "colour",       href: "/docs/StreetBondSR/Colour-Guide-1.pdf" },
    { label: "Friction Certificate of Analysis",     type: "certificate",  href: "/docs/StreetBondSR/StreetBond-SR-Certificate-of-Analysis-Friction.pdf" },
    { label: "Flat Surface Specification",           type: "spec",         href: "/docs/StreetBondSR/StreetBond-SR-Flat-Surface-Specification.pdf" },
  ],

  "mmax": [
    { label: "Product Data Sheet",                   type: "tds",          href: "/docs/MMAX/MMAX-Product-Data.pdf" },
    { label: "Next Gen Brochure",                    type: "brochure",     href: "/docs/MMAX/MMAX-Next-Gen-Brochure_06_09_23-1.pdf" },
    { label: "Extended Season Corundum PDS",         type: "tds",          href: "/docs/MMAX/Extended-Season-MMAX-Corundum-PDS-070723.pdf" },
    { label: "Extended Season Product Data Sheet",   type: "tds",          href: "/docs/MMAX/Extended-Season-MMAX-product-data-sheet.pdf" },
    { label: "Corundum Area Markings — Application Instructions", type: "installation", href: "/docs/MMAX/Application_Instructions_MMAX_Corundum_Area_Markings.pdf" },
  ],

  "durashield": [
    { label: "Part A+B Asphalt — Technical Data Sheet",     type: "tds", href: "/docs/DuraShield/DuraShield-Pavement-Coating-Part-A-B-Color-Asphalt-TDS.pdf" },
    { label: "Part A+B Solar Gray — Technical Data Sheet",  type: "tds", href: "/docs/DuraShield/DuraShield-Pavement-Coating-Part-A-B-Color-Solar-Gray-TDS.pdf" },
  ],

  "streetprint": [
    { label: "FAQ",                                  type: "faq",          href: "/docs/streetprint/streetprint-faq.pdf" },
    { label: "Colour Guide",                         type: "colour",       href: "/docs/streetprint/streetprint-colour-guide.pdf" },
    { label: "Asphalt Texturing Specification",      type: "spec",         href: "/docs/streetprint/StreetPrint-Asphalt-Texturing-Specification.pdf" },
    { label: "Template Catalog",                     type: "other",        href: "/docs/streetprint/streetprint-template-catalog.pdf" },
  ],
};

export function getDocsForProduct(slug: string): ProductDocument[] {
  return ALL_DOCS[slug] ?? [];
}

export { ALL_DOCS };
