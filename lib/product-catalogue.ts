/**
 * Product editorial: the system pages of the HUB Product Portfolio Book,
 * Volume 5, as printed, for the web product pages.
 *
 * WHY THIS EXISTS: the web product pages had no positioning line at all. The
 * H1 read "StreetBond" and the next thing a specifier met was a heading that
 * said "About StreetBond", a CMS label, not a sentence. Meanwhile Vernon had
 * already written, and the client had already approved, a precise one-line
 * positioning statement for every product in the book Vernon designed.
 *
 * So this is not new copy. It is the book's own words, so that print and web
 * tell an identical story in identical language. That is what makes it safe
 * to ship the night before a client review: there is nothing here Doug has
 * not already seen on a page.
 *
 * THE BOOK'S GRAMMAR, which the web page mirrors:
 *
 *     HUB SURFACE SYSTEMS          eyebrow, orange, letterspaced
 *     StreetBond                   product name
 *     ───                          orange signature dash
 *
 *     The colour.                  title — the positioning line
 *     Engineered for life…         subhead
 *     Designed to move with…       description
 *
 *     TYPE         SURFACES        four-cell spec grid
 *     COLOURS      SERVICE LIFE
 *
 *     PARKS · PLAYGROUNDS · …      uses strip
 *
 * WHERE THE WORDS COME FROM (17 Oct 2026). Until this date the entries were
 * transcribed from the Figma master ("Catalogue 2027", 7 Sep 2026), and the
 * book went to press with different wording on most pages. Doug's rule is
 * that the printed page wins, so the entries are now built from
 * lib/idea-book-print.ts, the printed page read from the PDF's text layer,
 * and this file adds only what the web needs: the cross-sell strip PreMark's
 * page carries, and the edits in WEB_EDITS below. Each edit names the printed
 * text it replaces and why (a maker's sheet, docs/GLOSSARY.md), and fails the
 * build if the printed text is no longer there, so a re-transcription cannot
 * silently keep an edit that no longer applies. Everything else is verbatim,
 * including the Canadian spellings and Vernon's "eh?".
 *
 * Render-time slips (hyphens, "LEED v5", the double colon) stay in
 * components/products/ProductSpecCard.tsx (PRINT_FIXES): they are typesetting,
 * not wording.
 */

import { PRINT_SYSTEMS, type PrintSystem } from "./idea-book-print";

export interface CatalogueSpec {
  label: string;
  value: string;
}

export interface CatalogueEntry {
  /** The positioning line. Sits under the product name, where nothing was. */
  title: string;
  /** One line of qualification under the title. */
  subhead: string;
  /** The paragraph that earns the claim. */
  description: string;
  /** Four label/value pairs. The book never runs more; neither do we. */
  specs: [CatalogueSpec, CatalogueSpec, CatalogueSpec, CatalogueSpec];
  /** The footer strip — where this system goes, in the book's own caps. */
  uses: string[];
  /** Cross-sell strip, where the printed page carries one. */
  alsoNeed?: { heading: string; items: string[] };
  /** The printed page the system's words are on, so a reader can find the same page in the book. */
  page: number;
}

/**
 * The web's departures from the printed page, one line each. `printed` is the
 * exact text on the page; `web` replaces it. Flagged for the print file's next
 * run where the reason is a fact, not a house rule.
 */
export const WEB_EDITS: { slug: string; field: "title" | "subhead" | "description" | "spec" | "uses"; printed: string; web: string; why: string }[] = [
  {
    slug: "streetbond", field: "spec", printed: "Life cycle", web: "Service life",
    why: "One term for how long a system lasts across the site (docs/GLOSSARY.md); the book's own TrafficPatterns, StreetPrint and PreMark pages say \"Service life\".",
  },
  {
    slug: "streetbondsr", field: "spec", printed: "Life cycle", web: "Service life",
    why: "As StreetBond.",
  },
  {
    slug: "duratherm", field: "uses", printed: "Speed bumps", web: "Speed tables",
    why: "A speed bump is a parking-lot device; the traffic-calming device the book's own Traffic Calming page names is the speed table (docs/GLOSSARY.md). For the print file.",
  },
  {
    slug: "premark", field: "description", printed: " Provincially approved across Canada.", web: "",
    why: "No HUB document names a provincial approved-products list (17 Oct 2026 review). Cut until one is cited; for the print file.",
  },
];

function edited(slug: string, print: PrintSystem): Omit<CatalogueEntry, "alsoNeed"> {
  let { title, subhead, description } = print;
  const specs = print.specs.map((s) => ({ ...s })) as CatalogueEntry["specs"];
  let uses = [...print.uses];
  for (const e of WEB_EDITS) {
    if (e.slug !== slug) continue;
    const miss = () => new Error(`lib/product-catalogue.ts: the printed ${slug} ${e.field} no longer contains "${e.printed}"; update WEB_EDITS`);
    if (e.field === "spec") {
      const spec = specs.find((s) => s.label === e.printed || s.value === e.printed);
      if (!spec) throw miss();
      if (spec.label === e.printed) spec.label = e.web; else spec.value = e.web;
    } else if (e.field === "uses") {
      const i = uses.indexOf(e.printed);
      if (i < 0) throw miss();
      uses = uses.map((u, j) => (j === i ? e.web : u));
    } else {
      const current = { title, subhead, description }[e.field];
      if (!current.includes(e.printed)) throw miss();
      const next = current.replace(e.printed, e.web);
      if (e.field === "title") title = next; else if (e.field === "subhead") subhead = next; else description = next;
    }
  }
  return { title, subhead, description, specs, uses, page: print.page };
}

/**
 * What the web adds to a printed page: the cross-sell strip on PreMark's page
 * (page 39 carries it; the other nine do not).
 */
const WEB_EXTRAS: Record<string, Pick<CatalogueEntry, "alsoNeed">> = {
  premark: {
    alsoNeed: {
      heading: "Surface repair and maintenance",
      items: ["AirMark", "ChipFill", "AggreFill", "Fast Patch DPR"],
    },
  },
};

export const PRODUCT_CATALOGUE: Record<string, CatalogueEntry> = Object.fromEntries(
  Object.entries(PRINT_SYSTEMS).map(([slug, print]) => [slug, { ...edited(slug, print), ...WEB_EXTRAS[slug] }]),
);

export function catalogueFor(slug: string): CatalogueEntry | undefined {
  return PRODUCT_CATALOGUE[slug];
}

/**
 * The book's own index — page 8 of the 2026-27 master, "Ten systems / Our
 * systems, how they work, and where to find them." One line per system, in the
 * order the page prints them. Transcribed from public/catalogue/2026-27/
 * p008-1400.webp on 22 Sep 2026, verbatim — including the lines that end
 * without a full stop, because that is how the printed page sets them.
 *
 * The /products index uses these as its card lines: it is the only place the
 * book describes every system in one breath, so it is the closest thing the
 * book has to an index card. The four systems the book does not cover
 * (AirMark, ChipFill, AggreFill, Fast Patch DPR) have no line here, on purpose.
 */
export const SYSTEMS_INDEX: Record<string, string> = {
  "traffic-patterns": "Using colour, your design, heat-fused onto asphalt or concrete.",
  "traffic-patterns-xd": "Using patterns, colour and aggregate, heat fused and stamped on asphalt",
  streetprint: "The original stamped asphalt system.",
  streetbond: "Performance coatings that add colour and preservation to your projects.",
  streetbondsr: "Solar reflective coatings",
  decomark: "Wayfinding, messaging, graphics, public art, heat-fused to asphalt or concrete",
  mmax: "Industry leading MMA, transit lanes and area markings",
  duratherm: "Inlaid, flush mounted thermoplastic markings",
  durashield: "Maintenance coating for asphalt.",
  premark: "Pre-cut, heat-applied thermoplastic markings",
};
