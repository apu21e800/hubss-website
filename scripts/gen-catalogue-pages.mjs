/**
 * Rasterises the print catalogue into web page images, and writes the one
 * manifest the viewer reads.
 *
 * WHY A GENERATOR AND NOT A CHECKED-IN FOLDER OF IMAGES
 * The previous flipbook shipped `public/catalogue/v58/` — 140 pages of a
 * catalogue whose cover says "Catalogue 2026", rendered by a Python script
 * that hunted for `HUBSS_Catalogue_2026_vNN.pdf` in a directory that holds no
 * PDFs at all. Nobody could tell, from the repo, which PDF those pages came
 * from or whether they were current. They were not: the approved book is
 * "DECORATIVE PAVEMENT SOLUTIONS VOLUME 5", 144 pages, 2026-27. So the pages
 * are now derived, the source is named in the manifest, and a mismatch is
 * visible instead of invisible.
 *
 * WHY IT IS SAFE TO PUT IN `npm run build`
 * The master PDF is 28 MB and is NOT in the repo, so on Vercel this script
 * finds a complete manifest, verifies every file it names is on disk, and
 * exits in a few milliseconds. It rasterises only on a machine that has both
 * the master PDF and poppler — i.e. Vern's. It never throws: a build must not
 * fail because an asset source is absent, and it must not silently ship a
 * manifest pointing at files that are not there either. Hence: verify, then
 * decide.
 *
 * WHY NOT next/image
 * In August 2026 this project exhausted its Vercel image-optimization
 * allowance and every optimised image on the site answered 402 Payment
 * Required — sitewide, not just here. 144 pages at three widths would be 432
 * more optimisation sources for images that are already the exact sizes they
 * will be displayed at. So the widths are baked here, served as plain static
 * files, and the viewer uses a bare <img srcset>. Nothing routes through
 * /_next/image.
 *
 * WHY THREE WIDTHS AND NO CROP
 * 800 is a phone at 2x, 1400 a laptop, 2000 the zoomed-in read. The master is
 * already trimmed — 432x432pt, exactly 6.00 x 6.00in, no bleed — so it is
 * rasterised whole. The old Python renderer assumed a 5.25in page with 0.125in
 * bleed and clipped the central 5in, which against this master would have
 * shaved ~2.4% off all four edges of every page, quietly.
 *
 * Run by hand:  npm run gen:catalogue          (and --force to re-render)
 */
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const PUB = path.join(ROOT, "public", "catalogue");
const MANIFEST = path.join(ROOT, "lib", "catalogue-manifest.json");
/**
 * The same facts minus the 144-entry page array. It exists because the nav,
 * the Resources list and the search index all need the edition name, the page
 * count and the download - and all three end up inside a client bundle. Making
 * them import the full manifest would ship 144 alt strings to every visitor who
 * opens the search overlay. Only the reader itself needs the pages.
 */
const EDITION_FILE = path.join(ROOT, "lib", "catalogue-edition.json");

/** Display widths, in CSS pixels. The largest is what a zoom reads from. */
const WIDTHS = [800, 1400, 2000];
const QUALITY = 82;
const FORCE = process.argv.includes("--force");
/** Redo the alt text and both manifests without re-rasterising anything. */
const REMANIFEST = process.argv.includes("--remanifest");

const log = (...a) => console.log("[catalogue]", ...a);
const warn = (...a) => console.warn("[catalogue]", ...a);

function run(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { ...opts });
    let out = "";
    let err = "";
    p.stdout?.on("data", (d) => (out += d));
    p.stderr?.on("data", (d) => (err += d));
    p.on("error", () => resolve({ code: 127, out: "", err: "spawn failed" }));
    p.on("close", (code) => resolve({ code: code ?? 1, out, err }));
  });
}

const have = async (bin) => (await run(bin, ["-v"])).code !== 127;

/**
 * Where the master might be. Env var wins so nothing here is load-bearing;
 * the rest are the real locations on the machine that owns the book.
 */
function candidateSources() {
  const out = [];
  if (process.env.CATALOGUE_MASTER_PDF) out.push(process.env.CATALOGUE_MASTER_PDF);
  const roots = [
    path.join(ROOT, "catalogue-source"),
    path.resolve(ROOT, "..", "..", "..", "hubss-catalog"),
    path.resolve(ROOT, "..", "..", "..", "..", "hubss-catalog"),
  ];
  for (const r of roots) {
    for (const f of walk(r, 3)) {
      if (/FLIPBOOK-MASTER\.pdf$/i.test(f)) out.push(f);
    }
  }
  return out.filter((f) => {
    try { return fs.statSync(f).isFile(); } catch { return false; }
  });
}

function walk(dir, depth) {
  if (depth < 0) return [];
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return []; }
  const found = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) found.push(...walk(full, depth - 1));
    else if (e.isFile()) found.push(full);
  }
  return found;
}

/** "HUBSS-Catalogue-2026-27_144pp_FLIPBOOK-MASTER.pdf" -> "2026-27" */
function editionFrom(basename) {
  const m = /(\d{4}(?:-\d{2,4})?)/.exec(basename);
  return m ? m[1] : "current";
}

const pageFile = (n, w) => `p${String(n).padStart(3, "0")}-${w}.webp`;

function readManifest() {
  try { return JSON.parse(fs.readFileSync(MANIFEST, "utf8")); } catch { return null; }
}

/**
 * A manifest is only believed if every file it promises exists and is not
 * empty. This is the whole reason the build step is cheap AND honest: it is a
 * verification against disk, not a trust of a document.
 */
function manifestIsSatisfied(m) {
  if (!m || !Array.isArray(m.pages) || m.pages.length === 0) return false;
  if (!Array.isArray(m.widths) || m.widths.length === 0) return false;
  // Both files or neither. A manifest without its companion is a half-written
  // state that would build and then fail to name the edition anywhere.
  try { if (!fs.statSync(EDITION_FILE).isFile()) return false; } catch { return false; }
  const dir = path.join(PUB, String(m.edition ?? ""));
  for (const p of m.pages) {
    for (const w of m.widths) {
      const f = path.join(dir, pageFile(p.n, w));
      let st;
      try { st = fs.statSync(f); } catch { return false; }
      if (!st.isFile() || st.size === 0) return false;
    }
  }
  return true;
}

/**
 * Undo letter-spacing that the text layer reports as real spaces.
 *
 * Tracked display type comes out of pdftotext one letter at a time:
 * "G r i m s by, O n t a r i o", "Vo l u m e 5". Left alone that is what a
 * screen reader says out loud, which is worse than saying nothing. Two narrow
 * rules, both requiring evidence before they touch anything:
 *
 *   1. A line where most tokens are a single character is a spaced-out word.
 *      Rejoin it, starting a new word after punctuation or at a change between
 *      letters and digits ("Vo l u m e 5" -> "Volume 5").
 *   2. A lone capital in front of a lowercase word is a letter that lost its
 *      word ("K itchener," -> "Kitchener,"). A and I are excluded, because they
 *      are words.
 */
function unspace(line) {
  const tokens = line.split(" ").filter(Boolean);
  if (tokens.length >= 4) {
    const singles = tokens.filter((t) => t.length === 1).length;
    if (singles / tokens.length >= 0.6) {
      let out = "";
      for (const t of tokens) {
        if (out === "") {
          out = t;
          continue;
        }
        const prev = out[out.length - 1];
        const boundary =
          /[.,;:!?)\]]/.test(prev) ||
          (/[0-9]/.test(prev) !== /[0-9]/.test(t[0]) && /[A-Za-z0-9]/.test(prev) && /[A-Za-z0-9]/.test(t[0]));
        out += boundary ? " " + t : t;
      }
      return out;
    }
  }
  const fixed = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const nxt = tokens[i + 1];
    if (t.length === 1 && /[B-HJ-Z]/.test(t) && nxt && nxt.length > 1 && /^[a-z]/.test(nxt)) {
      fixed.push(t + nxt);
      i++;
      continue;
    }
    fixed.push(t);
  }
  return fixed.join(" ");
}

/** The most useful line of real text on a page, used as alt text. */
async function pageAlt(pdf, n, total) {
  const generic = `HUB Surface Systems catalogue, page ${n} of ${total}`;
  const r = await run("pdftotext", ["-f", String(n), "-l", String(n), "-nopgbrk", pdf, "-"]);
  if (r.code !== 0) return generic;
  // A text layer is not always text. Page 23 of this edition reports its
  // heading as `< E@@"` - a font-encoding artefact - which passed a
  // "has a letter in it" test and would have shipped as the page's alt
  // attribute. Require the line to be mostly alphanumeric before believing it.
  const looksLikeWords = (t) => {
    const letters = (t.match(/[A-Za-z]/g) ?? []).length;
    const alnum = (t.match(/[A-Za-z0-9]/g) ?? []).length;
    if (letters < 2 || alnum / t.length < 0.45) return false;
    // A run of letters longer than any English word is a font whose ToUnicode
    // map is wrong: page 100 reports its heading as
    // "XYVLPOVZVYJOVIOLOVKPNVKPYVOJHHVPOVPOVTV", which is all letters and
    // therefore passes every other test here.
    return !t.split(" ").some((w) => w.length > 24);
  };
  // Running heads appear on most pages and say nothing about any of them.
  const isRunningHead = (t) => /^(hub surface systems|www\.hubss\.com)$/i.test(t);

  const all = r.out
    .split("\n")
    .map((s) => unspace(s.replace(/\s+/g, " ").trim()))
    .filter((s) => s.length >= 3 && looksLikeWords(s));
  // Fall back to the running heads only when a page has nothing else - the
  // back cover really is just the address.
  const distinct = all.filter((s) => !isRunningHead(s));
  const lines = distinct.length > 0 ? distinct : all;
  if (lines.length === 0) return generic;
  // The first line is usually the page's own heading, but on a page whose
  // heading is two words it says very little. Prefer the first line with some
  // substance to it, and fall back to whatever there is.
  let head = lines.find((s) => s.length >= 12) ?? lines[0];
  if (head.length > 90) head = head.slice(0, 87).replace(/\s+\S*$/, "") + "...";
  return `${head} - catalogue page ${n} of ${total}`;
}

async function renderPage(pdf, n, dpi, outDir, tmpDir) {
  const stem = path.join(tmpDir, `pg${n}`);
  const r = await run("pdftoppm", [
    "-f", String(n), "-l", String(n),
    "-r", String(dpi),
    "-png", "-singlefile",
    pdf, stem,
  ]);
  const png = `${stem}.png`;
  if (r.code !== 0 || !fs.existsSync(png)) {
    throw new Error(`pdftoppm failed on page ${n}: ${r.err.trim() || `exit ${r.code}`}`);
  }
  let bytes = 0;
  for (const w of WIDTHS) {
    const dest = path.join(outDir, pageFile(n, w));
    await sharp(png)
      .resize({ width: w, withoutEnlargement: false, kernel: "lanczos3" })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(dest);
    bytes += fs.statSync(dest).size;
  }
  fs.unlinkSync(png);
  return bytes;
}

function writeEmpty() {
  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
  fs.writeFileSync(MANIFEST, JSON.stringify({ edition: null, widths: WIDTHS, pages: [] }, null, 2) + "\n");
  fs.writeFileSync(
    EDITION_FILE,
    JSON.stringify({ edition: null, dir: "", widths: WIDTHS, aspect: 1, total: 0, download: null }, null, 2) + "\n",
  );
}

async function main() {
  const existing = readManifest();

  if (!FORCE && !REMANIFEST && manifestIsSatisfied(existing)) {
    log(`up to date: ${existing.pages.length} pages, edition ${existing.edition}`);
    return;
  }

  const sources = candidateSources();
  if (sources.length === 0) {
    if (existing && Array.isArray(existing.pages) && existing.pages.length > 0) {
      warn("master PDF not found and rendered pages are incomplete.");
      warn("Leaving the existing manifest alone rather than emptying it.");
      warn("Run `npm run gen:catalogue --force` on a machine that has the master.");
      return;
    }
    warn("no master PDF and no rendered pages - /catalogue will show its empty state.");
    writeEmpty();
    return;
  }

  const pdf = sources[0];
  if (!(await have("pdftoppm"))) {
    warn(`found ${path.basename(pdf)} but poppler (pdftoppm) is not installed - skipping.`);
    if (!existing) writeEmpty();
    return;
  }

  const info = await run("pdfinfo", [pdf]);
  if (info.code !== 0) throw new Error(`pdfinfo failed on ${pdf}`);
  const total = Number(/Pages:\s+(\d+)/.exec(info.out)?.[1] ?? 0);
  const ptsW = Number(/Page size:\s+([\d.]+)\s+x\s+([\d.]+)/.exec(info.out)?.[1] ?? 0);
  const ptsH = Number(/Page size:\s+([\d.]+)\s+x\s+([\d.]+)/.exec(info.out)?.[2] ?? 0);
  if (!total || !ptsW || !ptsH) throw new Error("could not read page count or page size from pdfinfo");

  const src = fs.statSync(pdf);
  const edition = editionFrom(path.basename(pdf));
  const outDir = path.join(PUB, edition);
  fs.mkdirSync(outDir, { recursive: true });

  // Render once, well above the largest display width, then let sharp's
  // Lanczos downscale produce the smaller two. Supersampling beats asking
  // poppler for a small raster: 8pt caption type at 133 DPI is mush.
  const maxW = Math.max(...WIDTHS);
  const dpi = Math.ceil((maxW / (ptsW / 72)) * 1.02);

  log(`source   ${path.basename(pdf)} (${(src.size / 1048576).toFixed(1)} MB)`);
  log(`pages    ${total} at ${(ptsW / 72).toFixed(2)} x ${(ptsH / 72).toFixed(2)} in`);
  log(`render   ${dpi} DPI, no crop, then ${WIDTHS.join("/")} px WebP q${QUALITY}`);
  log(`out      public/catalogue/${edition}/`);

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "hubss-cat-"));
  const todo = [];
  for (let n = 1; n <= total; n++) {
    const done = WIDTHS.every((w) => {
      try { return fs.statSync(path.join(outDir, pageFile(n, w))).size > 0; } catch { return false; }
    });
    if ((FORCE || !done) && !REMANIFEST) todo.push(n);
  }
  if (REMANIFEST) log("remanifest: rasters left alone, re-deriving alt text");
  if (todo.length < total) log(`resuming: ${total - todo.length} pages already rendered`);

  const workers = Math.max(1, Math.min(4, os.cpus().length - 1));
  let cursor = 0;
  let bytes = 0;
  let done = 0;
  const started = Date.now();

  await Promise.all(
    Array.from({ length: workers }, async () => {
      for (;;) {
        const i = cursor++;
        if (i >= todo.length) return;
        const n = todo[i];
        bytes += await renderPage(pdf, n, dpi, outDir, tmpDir);
        done++;
        if (done % 12 === 0 || done === todo.length) {
          const secs = (Date.now() - started) / 1000;
          log(`  ${done}/${todo.length} pages  ${(bytes / 1048576).toFixed(1)} MB  ${secs.toFixed(0)}s`);
        }
      }
    }),
  );

  fs.rmSync(tmpDir, { recursive: true, force: true });

  log("reading page text for alt attributes...");
  const pages = [];
  for (let n = 1; n <= total; n++) {
    pages.push({ n, alt: await pageAlt(pdf, n, total) });
  }
  const withText = pages.filter((p) => !/^HUB Surface Systems catalogue, page/.test(p.alt)).length;
  log(`  ${withText}/${total} pages carry a text layer`);

  // The download is the printer's own web-optimised export when it is sitting
  // next to the master, not a re-export of it.
  let download = null;
  const webPdf = path.join(path.dirname(pdf), path.basename(pdf).replace(/FLIPBOOK-MASTER/i, "WEB-DOWNLOAD"));
  const servedPdf = path.join(PUB, `HUBSS-Catalogue-${edition}.pdf`);
  if (fs.existsSync(webPdf)) {
    fs.copyFileSync(webPdf, servedPdf);
    const b = fs.statSync(servedPdf).size;
    download = {
      href: `/catalogue/HUBSS-Catalogue-${edition}.pdf`,
      bytes: b,
      label: `${(b / 1048576).toFixed(1)} MB`,
    };
    log(`download ${download.href} (${download.label})`);
  } else if (fs.existsSync(servedPdf)) {
    const b = fs.statSync(servedPdf).size;
    download = { href: `/catalogue/HUBSS-Catalogue-${edition}.pdf`, bytes: b, label: `${(b / 1048576).toFixed(1)} MB` };
  }

  const total3 = pages.reduce((sum, p) => {
    for (const w of WIDTHS) sum += fs.statSync(path.join(outDir, pageFile(p.n, w))).size;
    return sum;
  }, 0);

  const manifest = {
    edition,
    dir: `/catalogue/${edition}`,
    widths: WIDTHS,
    aspect: Number((ptsW / ptsH).toFixed(4)),
    source: {
      file: path.basename(pdf),
      bytes: src.size,
      sha256: createHash("sha256").update(fs.readFileSync(pdf)).digest("hex").slice(0, 16),
      pages: total,
    },
    download,
    pages,
  };
  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(
    EDITION_FILE,
    JSON.stringify(
      {
        edition,
        dir: manifest.dir,
        widths: WIDTHS,
        aspect: manifest.aspect,
        total,
        download,
        source: manifest.source,
      },
      null,
      2,
    ) + "\n",
  );

  log(`wrote lib/catalogue-manifest.json + lib/catalogue-edition.json - ${total} pages, ${(total3 / 1048576).toFixed(1)} MB of WebP`);
}

main().catch((e) => {
  console.error("[catalogue] FAILED:", e.message);
  process.exit(1);
});
