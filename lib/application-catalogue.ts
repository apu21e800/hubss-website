/**
 * Application editorial: the application spreads of the HUB Product Portfolio
 * Book, Volume 5, as printed, for the web application pages.
 *
 * WHY THIS EXISTS: the same reason lib/product-catalogue.ts exists, one level
 * up. Every application spread in the book carries three things the web
 * page did not have — a headline, a one-line statement, and a SPECIFY list
 * naming which systems go in that application and why. That list is the most
 * useful sentence on the page for a specifier, and it is the client's own
 * product selection: Doug has signed off on the printed page.
 *
 * THE BOOK'S GRAMMAR, which the web page mirrors:
 *
 *     APPLICATION 01                eyebrow, orange, letterspaced
 *     CROSSWALKS                    application name
 *
 *     Crosswalks that hold their    title — the headline
 *       colour and their grip.
 *     Providing increased           statement — the pull line
 *       visibility and safety…
 *     Preformed thermoplastic       body — the paragraph that earns it
 *       holds its skid…
 *
 *     SPECIFY                       the systems, and why each one
 *       TrafficPatternsXD  150 mil, aggregate-reinforced
 *
 * WHERE THE WORDS COME FROM (17 Oct 2026). Until this date the entries were
 * transcribed from the Figma master ("Catalogue 2027", 7 Sep 2026), and the
 * book went to press with different wording on most spreads. Doug's rule is
 * that the printed page wins, so the entries are now built from
 * lib/idea-book-print.ts, the printed spread read from the PDF's text layer,
 * for the fifteen spreads that are pages on this site (the book's Creative
 * Design and Durability spreads have no page of their own). This file adds
 * only what the web needs: the spread's printed name where it differs from
 * the page's, and the edits in WEB_EDITS below. Each edit names the printed
 * text it replaces and why, and fails the build if that text is no longer
 * there. Everything else is verbatim, including the Canadian spellings.
 *
 * WHERE A SPREAD'S NAME DIFFERS FROM THE PAGE'S: the book's Private Driveways
 * spread is the site's Residential Driveways page (one page since 30 Sep 2026;
 * it used to be listed twice); Play Surfaces is the Playgrounds page; the
 * site's Bus Lanes page carries the book's High-Traffic Corridors spread
 * (p52), the spread that covers transit corridors, and says so.
 */

import { PRINT_APPLICATIONS, type PrintApplication } from "./idea-book-print";
import { applications } from "./applications";

export interface ApplicationSpecify {
  /** Product slug on this site, so the strip can link. */
  slug: string;
  /** The book's own reason for specifying it here. */
  note: string;
}

export interface ApplicationCatalogueEntry {
  /** The headline from the printed spread. */
  title: string;
  /** The pull line under it. */
  statement: string;
  /** The paragraph that earns the claim. */
  body: string;
  /** The SPECIFY strip — which systems, and why, in the book's order. */
  specify: ApplicationSpecify[];
  /** The printed page the spread's words are on, so a reader can find the same spread in the book. */
  page: number;
  /** Set when the spread's printed title differs from this page's name. */
  spreadName?: string;
}

/** The web's departures from the printed spread, one line each (see lib/product-catalogue.ts). */
export const WEB_EDITS: { slug: string; field: "title" | "statement" | "body"; printed: string; web: string; why: string }[] = [
  {
    slug: "crosswalks", field: "body", printed: "holds ASTM-rated skid resistance", web: "holds its skid resistance",
    why: "\"ASTM-rated\" names no test (docs/GLOSSARY.md); the test and the number, 60 BPN to ASTM E303, are on the TrafficPatterns and TrafficPatternsXD pages the SPECIFY strip links to.",
  },
  {
    slug: "playgrounds", field: "title", printed: "built for FUN.", web: "built for fun.",
    why: "Capitals for emphasis set in print read as shouting on a screen; the word is the book's.",
  },
];

/** The spread's printed name, where the page is called something else. */
const SPREAD_NAMES: Record<string, string> = {
  "bus-lanes": "High-Traffic Corridors",
  playgrounds: "Play Surfaces",
  "residential-driveways": "Private Driveways",
};

function edited(slug: string, print: PrintApplication): ApplicationCatalogueEntry {
  const text = { title: print.title, statement: print.statement, body: print.body };
  for (const e of WEB_EDITS) {
    if (e.slug !== slug) continue;
    if (!text[e.field].includes(e.printed)) {
      throw new Error(`lib/application-catalogue.ts: the printed ${slug} ${e.field} no longer contains "${e.printed}"; update WEB_EDITS`);
    }
    text[e.field] = text[e.field].replace(e.printed, e.web);
  }
  const spreadName = SPREAD_NAMES[slug];
  return {
    ...text,
    specify: print.specify.map((s) => ({ ...s })),
    page: print.page,
    ...(spreadName ? { spreadName } : {}),
  };
}

const onTheSite = new Set(applications.map((a) => a.slug));

export const APPLICATION_CATALOGUE: Record<string, ApplicationCatalogueEntry> = Object.fromEntries(
  Object.entries(PRINT_APPLICATIONS)
    .filter(([slug]) => onTheSite.has(slug))
    .map(([slug, print]) => [slug, edited(slug, print)]),
);

export function applicationCatalogueFor(slug: string): ApplicationCatalogueEntry | undefined {
  return APPLICATION_CATALOGUE[slug];
}
