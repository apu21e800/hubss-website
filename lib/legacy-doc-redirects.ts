/**
 * Old spec-sheet addresses → the same sheet on today's site.
 *
 * WHY (15 Oct 2026). Doug asked why the site's traffic fell. Search Console
 * shows the WordPress site's PDFs were found and opened from Google: from
 * June 2025 to October 2026, 102 old PDF addresses earned clicks, led by
 * MMAX-Product-Data.pdf (80), the StreetBond 150 AL data sheet (75) and the
 * TrafficPatternsXD specification (51). Those are specifiers looking for a
 * spec sheet. Since the move to this site every one of them was sent to
 * /resources, the library page, so Google saw a document turn into a page
 * and dropped the document from its results, and the specifier had to find
 * the sheet again.
 *
 * Now an old address goes to the sheet itself when the site still has it:
 *
 *  - by name: every PDF in /public/docs (lib/document-sizes.json, measured
 *    at build) answers at /wp-content/uploads/<year>/<month>/<its name>, and
 *    at the "-1" and "-2" names WordPress gave duplicate uploads;
 *  - by hand (KNOWN below): the old addresses Search Console lists whose
 *    names differ from today's file, where today's file is the same
 *    document or its direct successor (a newer edition of the same data
 *    sheet). Nothing is matched on a guess: an old sheet with no successor
 *    here (the safety data sheets, CemBase, the sealer concentrate) still
 *    goes to /resources.
 *
 * next.config.ts puts these before the /wp-content/uploads → /resources rule.
 * `npm run test:redirects` checks every destination is a real file.
 */
import documentSizes from "./document-sizes.json";

export interface Redirect {
  source: string;
  destination: string;
  permanent: true;
}

/** Today's PDFs, by their public path. */
export const CURRENT_DOCS: string[] = Object.keys(documentSizes as Record<string, string>)
  .filter((p) => p.startsWith("/docs/") && p.toLowerCase().endsWith(".pdf"))
  .sort();

/**
 * Old addresses (from Search Console, Jun 2025 to Oct 2026) whose file is
 * here under another name. Keys are the old path; values today's path.
 */
export const KNOWN: Record<string, string> = {
  // StreetBond: the old two-part data sheets are today's 12.22 data sheets.
  "/wp-content/uploads/2023/03/SB150-AL-Pavement-Coating-Part-A-B-TDS.pdf": "/docs/StreetBond/StreetBond 150/StreetBond-SB150AL-Data-Sheet-12.22-Rev.pdf",
  "/wp-content/uploads/2023/03/SB150-Pavement-Coating-Part-A-B-TDS.pdf": "/docs/StreetBond/StreetBond 150/StreetBond-SB150-Data-Sheet-12.22-Rev.pdf",
  "/wp-content/uploads/2023/03/SB120-Pavement-Coating-Part-A-B.pdf": "/docs/StreetBond/StreetBond 120/StreetBond-SB120-Data-Sheet-12.22-Rev.pdf",
  // StreetBond colour cards: today's is the 2026 card.
  "/wp-content/uploads/2023/03/StreetBond-Colour-Guide.pdf": "/docs/StreetBond/StreetBond/StreetBond-Colour-Card-2026.pdf",
  "/assets/specification-documents/StreetBond-SR/StreetBond-Colour-Card_10-16.pdf": "/docs/StreetBond/StreetBond/StreetBond-Colour-Card-2026.pdf",
  // StreetBond over concrete.
  "/wp-content/uploads/2023/03/StreetBond-concrete-application-specifications.pdf": "/docs/StreetBond/StreetBond 150/StreetBond-SB150-Over-Concrete-Specification.pdf",
  "/assets/specification-documents/StreetBond/StreetBond_concrete_application_specifications.pdf": "/docs/StreetBond/StreetBond 150/StreetBond-SB150-Over-Concrete-Specification.pdf",
  // StreetBondSR flat surfaces.
  "/assets/specification-documents/StreetBond-SR/SB-SBSR-StreetBondSR-Flat-Surface-Specification.pdf": "/docs/StreetBondSR/StreetBond-SR-Flat-Surface-Specification.pdf",
  // StreetPrint: the template catalogue, and its old capitalised names.
  "/assets/specification-documents/StreetPrint/StreetPrint_Template_Catalog_web_version.pdf": "/docs/streetprint/streetprint-template-catalog.pdf",
  "/wp-content/uploads/2023/03/StreetPrint-Template-Catalog.pdf": "/docs/streetprint/streetprint-template-catalog.pdf",
  "/wp-content/uploads/2023/03/StreetPrint-FAQ.pdf": "/docs/streetprint/streetprint-faq.pdf",
  // DuraTherm and DecoMark: the same files, renamed in lower case.
  "/wp-content/uploads/2023/03/DuraTherm-Design-Manual.pdf": "/docs/duratherm/duratherm-design-manual.pdf",
  "/wp-content/uploads/2023/03/Duratherm-Colour-Guide.pdf": "/docs/duratherm/duratherm-colour-guide.pdf",
  "/wp-content/uploads/2023/03/Duratherm-Custom-Design-Guidelines.pdf": "/docs/duratherm/duratherm-custom-design-guidelines.pdf",
  "/wp-content/uploads/2023/03/DecoMark-Application-Instructions.pdf": "/docs/decomark/decomark-application-instructions.pdf",
  "/wp-content/uploads/2023/03/DecoMark-Custom-Design-Guidelines.pdf": "/docs/decomark/decomark-custom-design-guidelines.pdf",
};

/** A path for a redirect's destination: spaces and brackets encoded, like a link to the file. */
export function destinationFor(docPath: string): string {
  return docPath.split("/").map((seg) => encodeURIComponent(seg)).join("/");
}

/** A file name as a literal in a redirect source (path-to-regexp treats these as syntax). */
export function literal(name: string): string {
  return name.replace(/[()*+?:{}\\[\]]/g, (c) => `\\${c}`);
}

export function legacyDocRedirects(): Redirect[] {
  const out: Redirect[] = [];
  const seen = new Set<string>();
  const add = (source: string, doc: string) => {
    if (seen.has(source)) return;
    seen.add(source);
    out.push({ source, destination: destinationFor(doc), permanent: true });
  };
  for (const [from, to] of Object.entries(KNOWN)) add(literal(from), to);
  for (const doc of CURRENT_DOCS) {
    const name = doc.slice(doc.lastIndexOf("/") + 1);
    const stem = name.replace(/\.pdf$/i, "");
    for (const variant of [name, `${stem}-1.pdf`, `${stem}-2.pdf`]) {
      add(`/wp-content/uploads/:year(\\d{4})/:month(\\d{2})/${literal(variant)}`, doc);
    }
  }
  return out;
}
