/**
 * Generates lib/document-sizes.json — the measured byte size of every
 * downloadable document under /public, keyed by its public URL path.
 *
 * WHY THIS EXISTS: the sizes shown on /resources were typed by hand, and by
 * September 2026 sixty-two of eighty-five were wrong — most of them three to
 * ten times too large (AirMark's brochure was advertised at 4.3 MB and is
 * 190 KB). Worse, the wrong numbers had been imported into Sanity, so the
 * code and the CMS agreed with each other and disagreed with the files.
 *
 * A figure a visitor reads before deciding whether to download is a claim,
 * and this project does not publish figures nobody measured. Measuring them
 * at build time means they cannot drift again: replace a PDF and the number
 * follows it on the next deploy, with nobody to remember.
 *
 * Statting /public from inside a page is not an option — see the note at the
 * top of gen-gallery-manifest.mjs: a runtime-computed fs read defeats the
 * dependency tracer and pulls the whole 2.4 GB public tree into the
 * serverless function. Hence a build-time JSON, same as the gallery.
 *
 * Runs from the "build" script. Manually: npm run gen:doc-sizes
 */
import * as fs from "fs";
import * as path from "path";

const ROOT = process.cwd();
const PUB = path.join(ROOT, "public");
const OUT = path.join(ROOT, "lib", "document-sizes.json");

/** Trees that hold downloadable documents. */
const SCAN_ROOTS = ["docs", "resources/flyers"];
const DOC_EXT = /\.(pdf|docx?|xlsx?|zip|dwg|dxf)$/i;

/**
 * House style on /resources is "N.N MB". Below 0.1 MB that rounds to "0.0 MB",
 * which reads as a broken link rather than a small file, so those are given in
 * whole KB instead.
 */
function human(bytes) {
  const mb = bytes / 1024 / 1024;
  if (mb < 0.1) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${mb.toFixed(1)} MB`;
}

/** Every document file under `dir`, as [urlPath, bytes]. */
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (entry.isFile() && DOC_EXT.test(entry.name)) {
      // Decoded, POSIX-style, leading slash — the shape a fileUrl takes once
      // decodeURIComponent has been applied to it. Several fileUrls in
      // resource-documents.ts are percent-encoded because the folders have
      // spaces in their names ("StreetBond 120"), so the consumer decodes
      // before looking a path up here.
      const url = "/" + path.relative(PUB, full).split(path.sep).join("/");
      out.push([url, fs.statSync(full).size]);
    }
  }
  return out;
}

const files = SCAN_ROOTS.flatMap((r) => walk(path.join(PUB, r)));
files.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));

const sizes = Object.fromEntries(files.map(([url, bytes]) => [url, human(bytes)]));

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(sizes, null, 1) + "\n");

const total = files.reduce((n, [, b]) => n + b, 0);
console.log(
  `  ✓ lib/document-sizes.json — ${files.length} documents, ` +
    `${(total / 1024 / 1024).toFixed(1)} MB total`,
);
