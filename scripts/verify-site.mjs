#!/usr/bin/env node
/**
 * scripts/verify-site.mjs — the safety net.
 *
 * WHY THIS EXISTS
 *
 * Every bug found on this project so far has the same shape: the code asserts
 * something, reality differs, and nothing checks. Each one shipped, sat on
 * production for weeks or months, and was eventually found by hand, by luck.
 *
 *   the /resources search crashed on the first keystroke, because the Studio
 *   stores `docType` and the query asked for `type`
 *
 *   nine municipal case studies were built, listed in the sitemap, and 308'd
 *   to /gallery by a migration catch-all
 *
 *   three pairs of application pages served each other's photographs
 *
 *   /blog shipped 4.4 MB of images to phones
 *
 * Not one of those needed cleverness to catch. They needed *something to look*.
 * This is that something. Every check below exists because a real bug got past
 * a human, and the comment on each one says which.
 *
 * USAGE
 *   npm run build && npm run verify          # full pass
 *   npm run verify -- --quick                # skip the browser checks
 *   npm run verify -- --base=https://hubss.com   # audit production directly
 *
 * Exits non-zero if anything fails, so CI can gate on it.
 */
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const args = process.argv.slice(2);
const QUICK = args.includes("--quick");
const BASE = (args.find((a) => a.startsWith("--base=")) || "").split("=")[1] || "http://localhost:4173";
const EXTERNAL = !BASE.includes("localhost");
const ROOT = process.cwd();

// Budgets. Deliberately generous — this catches disasters, not imperfection.
const IMAGE_BUDGET_KB = 2000;   // per route, mobile viewport
const MAX_CRITICAL_A11Y = 0;

const results = [];
const record = (name, ok, detail, items = []) => results.push({ name, ok, detail, items });
const kb = (n) => `${Math.round(n / 1024)} KB`;

// ── server ───────────────────────────────────────────────────────────────────
let server = null;
async function ensureServer() {
  if (EXTERNAL) return;
  const port = Number(BASE.split(":").pop());
  try {
    const r = await fetch(BASE + "/", { signal: AbortSignal.timeout(3000) });
    if (r.ok) return;                       // something's already serving
  } catch {}
  server = spawn("npx", ["next", "start", "-p", String(port)], { cwd: ROOT, stdio: "ignore", detached: true });
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    try { if ((await fetch(BASE + "/", { signal: AbortSignal.timeout(2000) })).ok) return; } catch {}
  }
  throw new Error(`server did not start on ${BASE} — did you run 'npm run build'?`);
}
const stopServer = () => { if (server) { try { process.kill(-server.pid); } catch {} } };

// Chromium lives at a fixed path in some sandboxes and wherever Playwright put
// it everywhere else. Hardcoding the former made this script work here and fail
// in CI and on a laptop, which would have quietly disabled the browser checks
// exactly where they matter most.
const launchOpts = () => {
  const sandboxChromium = "/opt/pw-browsers/chromium";
  return fs.existsSync(sandboxChromium)
    ? { executablePath: sandboxChromium, args: ["--no-sandbox"] }
    : { args: ["--no-sandbox"] };
};

const head = async (url) => {
  try { const r = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(20000) }); return r.status; }
  catch { return 0; }
};

// ── 1. every sitemap URL returns 200, not a redirect ─────────────────────────
// EARNED BY: nine project case studies — UBC Musqueam, York Region Hwy7 Viva,
// Toronto priority bus lanes — were prerendered, advertised to Google in the
// sitemap, and 308'd to /gallery by an unguarded /projects/:path* catch-all.
// A sitemap that lists redirects is both a broken promise to crawlers and, in
// this case, nine pieces of unreachable sales content.
async function checkRoutes() {
  const xml = await (await fetch(BASE + "/sitemap.xml")).text();
  const routes = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].replace(/^https?:\/\/[^/]+/, "") || "/"))];
  const bad = [];
  for (const r of routes) {
    const s = await head(BASE + r);
    if (s !== 200) bad.push(`${s || "ERR"}  ${r}`);
  }
  record("sitemap routes return 200", bad.length === 0,
    `${routes.length} routes checked`, bad);
  return routes;
}

/** External mode: read links from the DEPLOYED html, not the local build. */
async function checkLinksLive(routes) {
  const hrefs = new Set();
  const sample = routes.slice(0, 40);
  for (const r of sample) {
    try {
      const html = await (await fetch(BASE + r, { signal: AbortSignal.timeout(20000) })).text();
      for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) hrefs.add(m[1]);
    } catch {}
  }
  const pages = [...hrefs].filter((h) => !/\.(jpe?g|png|webp|svg|ico|xml|txt|css|js)$/i.test(h) && !h.startsWith("/_next"));
  const bad = [];
  for (const p of pages) {
    const st = await head(BASE + p);
    if (![200, 301, 307, 308].includes(st)) bad.push(`${st || "ERR"}  ${p}`);
  }
  record("internal links resolve", bad.length === 0,
    `${pages.length} links found on ${sample.length} live pages`, bad);
}

// ── 2. every internal link, PDF and image resolves ───────────────────────────
// EARNED BY: PDFs renamed during the colour-card work, where the old filename
// stayed referenced. Cheap to check, silently embarrassing to miss.
async function checkLinks(routes) {
  // In EXTERNAL mode the local build is a DIFFERENT VERSION of the site, so
  // link targets and asset hashes lifted from it are meaningless against the
  // deployed one — it reports /patterns as broken simply because that page
  // exists on this branch and not yet in production. Crawl the live HTML
  // instead, and skip the on-disk asset check entirely since there's no disk
  // to check against.
  if (EXTERNAL) return checkLinksLive(routes);

  const dir = path.join(ROOT, ".next", "server", "app");
  if (!fs.existsSync(dir)) { record("internal links resolve", false, "no build output — run npm run build"); return; }
  const html = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p); else if (e.name.endsWith(".html")) html.push(p);
    }
  })(dir);

  const hrefs = new Set(), assets = new Set();
  for (const f of html) {
    const s = fs.readFileSync(f, "utf8");
    for (const m of s.matchAll(/href="(\/[^"#?]*)"/g)) hrefs.add(m[1]);
    for (const m of s.matchAll(/src="(\/(?:images|docs)\/[^"?]*)"/g)) assets.add(m[1]);
    for (const m of s.matchAll(/href="(\/docs\/[^"?]*\.pdf)"/gi)) assets.add(m[1]);
  }
  // assets are files on disk — check the filesystem, not the network
  const missingAssets = [...assets].filter((a) => {
    try { return !fs.existsSync(path.join(ROOT, "public", decodeURIComponent(a))); }
    catch { return true; }
  });
  record("referenced files exist on disk", missingAssets.length === 0,
    `${assets.size} images + PDFs referenced`, missingAssets);

  const pages = [...hrefs].filter((h) => !/\.(pdf|jpe?g|png|webp|svg|ico|xml|txt)$/i.test(h));
  const bad = [];
  for (const p of pages) {
    const s = await head(BASE + p);
    if (![200, 301, 307, 308].includes(s)) bad.push(`${s || "ERR"}  ${p}`);
  }
  record("internal links resolve", bad.length === 0, `${pages.length} distinct links`, bad);
}

// ── 2b. everything the site BUILDS is reachable ──────────────────────────────
// EARNED BY: the nine project pages, generalised. The sitemap check above
// catches routes the sitemap advertises — but a page can be built, linked from
// the nav, and shadowed by a redirect without ever appearing in a sitemap. The
// invariant that actually matters is simpler and broader:
//
//     if the build produced a page, a visitor must be able to reach it.
//
// Anything that violates that is either a redirect swallowing a real route, or
// a page nobody meant to ship. Both are worth knowing about, and neither shows
// up in a build log — Next reports the nine project pages as successfully
// prerendered whether or not a redirect eats them a millisecond later.
async function checkBuiltPagesReachable() {
  if (EXTERNAL) return;   // no local build to compare a deployed site against
  const dir = path.join(ROOT, ".next", "server", "app");
  if (!fs.existsSync(dir)) { record("built pages are reachable", false, "no build output"); return; }

  const routes = [];
  (function walk(d, prefix = "") {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory()) { walk(path.join(d, e.name), `${prefix}/${e.name}`); continue; }
      if (!e.name.endsWith(".html")) continue;
      const base = e.name.replace(/\.html$/, "");
      // route groups and internals aren't visitor-facing
      if (base.startsWith("_") || prefix.includes("/_")) continue;
      routes.push(base === "index" ? (prefix || "/") : `${prefix}/${base}`);
    }
  })(dir);

  // A page can be legitimately unreachable to the public: /admin is behind Basic
  // Auth, and the middleware deliberately fails CLOSED with 503 when
  // ADMIN_USER/ADMIN_PASSWORD aren't configured, rather than leaving admin open.
  // Locally that's a 503, in production a 401 — both are the gate working.
  //
  // What must never happen is a built page being silently 3xx'd away or 404ing.
  // That's the /projects failure mode, and it's the one this check is for.
  const GATED_OK = new Set([401, 403, 503]);
  const bad = [], gated = [];
  for (const r of [...new Set(routes)]) {
    const st = await head(BASE + r);
    if (st === 200) continue;
    if (GATED_OK.has(st)) { gated.push(r); continue; }
    const why = st >= 300 && st < 400 ? "redirected away — is a catch-all shadowing it?" : "built, but not reachable";
    bad.push(`${st || "ERR"}  ${r}   (${why})`);
  }
  record("built pages are reachable", bad.length === 0,
    `${new Set(routes).size} prerendered${gated.length ? `, ${gated.length} auth-gated` : ""}`, bad);
}

// ── 3. the CMS contract — the bug class that keeps recurring ─────────────────
// EARNED BY: FOUR separate instances of the same defect.
//   docType vs type                  -> crashed /resources on the first keystroke
//   heroImageUrl vs heroImage        -> null on 14/14 products
//   galleryUrls vs gallery           -> field never existed
//   relatedApplicationSlugs vs relatedApplications
//
// Root cause is always identical: client.fetch<T>() is an UNCHECKED CAST.
// TypeScript happily promises fields the query never returns, the merge layer
// silently falls back forever, and nobody notices for months. TypeScript cannot
// catch this — only asking the live dataset can.
async function checkSanityContract() {
  const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "9dbro2m1";
  const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const q = async (query) => {
    const url = `https://${PROJECT}.apicdn.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(query)}`;
    const r = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!r.ok) throw new Error(`sanity ${r.status}`);
    return (await r.json()).result;
  };

  const src = fs.readFileSync(path.join(ROOT, "lib", "sanity.queries.ts"), "utf8");
  // fields a projection block asks for, ignoring aliased ones ("x": y) since
  // those are explicitly mapped and therefore already correct
  const askedIn = (block) => {
    const m = src.match(new RegExp(block + "\\s*=\\s*`([^`]*)`", "s"));
    if (!m) return [];
    return m[1].split(",").map((l) => l.trim())
      .filter((l) => l && !l.startsWith("_") && !/^"/.test(l))
      .map((l) => l.split(/[.\s]/)[0])
      .filter(Boolean);
  };

  const problems = [];
  for (const [block, type] of [["PRODUCT_FIELDS", "product"], ["APPLICATION_FIELDS", "application"]]) {
    const asked = askedIn(block);
    if (!asked.length) continue;
    const docs = await q(`*[_type=="${type}"][0...8]`);
    if (!docs?.length) { problems.push(`${type}: no documents in dataset`); continue; }
    const present = new Set(docs.flatMap((d) => Object.keys(d)));
    for (const f of asked) {
      if (f === "slug") continue;
      if (!present.has(f)) { problems.push(`${type}.${f} — queried, but NOT A FIELD in Sanity`); continue; }
      const nonNull = docs.filter((d) => d[f] !== null && d[f] !== undefined).length;
      if (nonNull === 0) problems.push(`${type}.${f} — exists but NULL on all ${docs.length} sampled documents`);
    }
  }

  // resourceDocuments is an inline array on siteSettings, checked against the
  // interface the client actually consumes
  const rd = await q(`*[_type=="siteSettings"][0].resourceDocuments[0...80]`);
  if (Array.isArray(rd) && rd.length) {
    // Check the field the code ENDS UP WITH, not the raw name. The query
    // coalesces docType -> type, so a raw check on `type` reports a failure for
    // something already handled — and a check that cries wolf gets ignored,
    // which is worse than no check. Aliases are read out of the GROQ itself so
    // this can't drift from the query.
    const aliases = {};
    for (const m of src.matchAll(/"(\w+)":\s*coalesce\(([^)]*)\)/g)) {
      aliases[m[1]] = m[2].split(",").map((x) => x.trim()).filter((x) => /^\w+$/.test(x));
    }
    const required = ["id", "title", "type", "product", "productName", "fileUrl"];
    for (const f of required) {
      const sources = aliases[f]?.length ? aliases[f] : [f];
      const missing = rd.filter((d) => !sources.some((sf) => typeof d[sf] === "string" && d[sf])).length;
      if (missing) {
        const via = sources.length > 1 ? ` (tried ${sources.join(" / ")})` : "";
        problems.push(`resourceDocuments.${f} — missing/blank on ${missing}/${rd.length} records${via}`);
      }
    }
  }

  record("CMS fields match what the code queries", problems.length === 0,
    "GROQ projections vs the live dataset", problems);
}

// ── 4. no two pages serve an identical gallery ───────────────────────────────
// EARNED BY: /applications/private-driveways served the exact same 44 photos as
// /applications/residential-driveways. pedestrian-safety was a pixel-for-pixel
// clone of crosswalks. regulatory-markings was traffic-calming. Six live pages,
// three galleries between them, because galleries resolved from whichever
// folder the HERO image happened to sit in. Every page still showed photos, so
// nothing looked broken — you had to open two tabs side by side to see it.
function checkGalleryDistinctness() {
  const mf = path.join(ROOT, "lib", "gallery-manifest.json");
  if (!fs.existsSync(mf)) { record("galleries are distinct", false, "no gallery manifest"); return; }
  const m = JSON.parse(fs.readFileSync(mf, "utf8"));

  // Known and accepted, with a reason. public-art has no photography of its own
  // anywhere — not on disk, not in Sanity — so it borrows the community-branding
  // set by design until someone shoots it. Everything else duplicating is a bug.
  // Delete the entry the day real public-art photos land.
  const ACCEPTED = new Set(["images/applications/public-art"]);

  const seen = new Map(), dupes = [];
  for (const [key, files] of Object.entries(m)) {
    if (!files?.length) continue;
    const sig = files.join("|");
    if (seen.has(sig)) {
      if (!ACCEPTED.has(key) && !ACCEPTED.has(seen.get(sig))) {
        dupes.push(`${key}  ==  ${seen.get(sig)}  (${files.length} identical images)`);
      }
    } else seen.set(sig, key);
  }
  record("galleries are distinct", dupes.length === 0,
    `${Object.keys(m).length} galleries compared`, dupes);
}

// ── 5. image weight per route ────────────────────────────────────────────────
// EARNED BY: /blog shipped 4,398 KB of images to a 390px phone, because three
// blog photos were referenced with markdown syntax — which compiles to a plain
// <img> and never touches next/image. Two were untouched 3024x4032 camera files.
async function checkImageWeight(routes, chromium) {
  const sample = ["/", "/blog", "/resources", "/contact", "/products/streetbond", "/applications/crosswalks"]
    .filter((r) => routes.includes(r) || r === "/");
  const B = await chromium.launch(launchOpts());
  const over = [];
  for (const r of sample) {
    const ctx = await B.newContext({ viewport: { width: 390, height: 844 } });
    const p = await ctx.newPage();
    let bytes = 0;
    p.on("response", async (res) => {
      if (res.request().resourceType() !== "image") return;
      try { bytes += Number((await res.allHeaders())["content-length"] || 0); } catch {}
    });
    await p.goto(BASE + r, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
    await p.waitForTimeout(1000);
    if (bytes > IMAGE_BUDGET_KB * 1024) over.push(`${r} — ${kb(bytes)} (budget ${IMAGE_BUDGET_KB} KB)`);
    await ctx.close();
  }
  await B.close();
  record(`image weight under ${IMAGE_BUDGET_KB} KB per route`, over.length === 0,
    `${sample.length} routes at 390px`, over);
}

// ── 6. no critical accessibility violations ──────────────────────────────────
// EARNED BY: unlabelled <select> elements on /resources and /blog, and form
// inputs where a screen reader read the placeholder ("Jane Smith") as the field
// name. This site sells AODA compliance to municipalities; failing WCAG on its
// own forms is a credibility problem, not just a technical one.
async function checkA11y(chromium, AxeBuilder) {
  const sample = ["/", "/products/streetbond", "/resources", "/contact", "/blog", "/lunch-learn"];
  const B = await chromium.launch(launchOpts());
  const bad = [];
  for (const r of sample) {
    const ctx = await B.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(BASE + r, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
    await p.waitForTimeout(700);
    const res = await new AxeBuilder({ page: p }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    for (const v of res.violations.filter((v) => v.impact === "critical")) {
      bad.push(`${r} — ${v.id} (${v.nodes.length} node${v.nodes.length > 1 ? "s" : ""})`);
    }
    await ctx.close();
  }
  await B.close();
  record(`no critical a11y violations`, bad.length <= MAX_CRITICAL_A11Y,
    `${sample.length} routes, WCAG 2.1 AA`, bad);
}

// ── 7. no page renders a literal "undefined" ─────────────────────────────────
// A cheap tripwire for the whole missing-field class: when a field the code
// expects isn't there, it very often ends up interpolated into the page as the
// string "undefined". Ignores $undefined, which is React's own RSC flight-data
// serialisation and entirely normal.
function checkNoUndefined() {
  const dir = path.join(ROOT, ".next", "server", "app");
  if (!fs.existsSync(dir)) { record('no visible "undefined" in output', false, "no build output"); return; }
  const bad = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { walk(p); continue; }
      if (!e.name.endsWith(".html")) continue;
      const s = fs.readFileSync(p, "utf8");
      for (const m of s.matchAll(/>([^<>]{0,40}undefined[^<>]{0,40})</g)) {
        if (m[1].includes("$undefined")) continue;      // React RSC internals
        bad.push(`${path.relative(dir, p)}: "${m[1].trim().slice(0, 60)}"`);
      }
    }
  })(dir);
  record('no visible "undefined" in rendered pages', bad.length === 0,
    "scanned prerendered HTML", [...new Set(bad)].slice(0, 10));
}

// ── run ──────────────────────────────────────────────────────────────────────
(async () => {
  const t0 = Date.now();
  console.log(`\n  verifying ${BASE}${QUICK ? "  (quick — no browser checks)" : ""}\n`);
  try {
    await ensureServer();
    const routes = await checkRoutes();
    await checkLinks(routes);
    await checkBuiltPagesReachable();
    checkGalleryDistinctness();
    checkNoUndefined();
    try { await checkSanityContract(); }
    catch (e) { record("CMS fields match what the code queries", false, `could not reach Sanity: ${e.message}`); }

    if (!QUICK) {
      let chromium, AxeBuilder;
      try {
        ({ chromium } = await import("playwright"));
        AxeBuilder = (await import("@axe-core/playwright")).default;
      } catch {
        record("browser checks", false, "playwright/@axe-core not installed — run with --quick or npm i -D playwright @axe-core/playwright");
      }
      if (chromium) {
        await checkImageWeight(routes, chromium);
        if (AxeBuilder) await checkA11y(chromium, AxeBuilder);
      }
    }
  } catch (e) {
    record("verification run", false, e.message);
  } finally {
    stopServer();
  }

  console.log("  " + "─".repeat(74));
  for (const r of results) {
    console.log(`  ${r.ok ? "PASS" : "FAIL"}  ${r.name.padEnd(46)} ${r.detail}`);
    for (const i of (r.items || []).slice(0, 12)) console.log(`          ${i}`);
    if ((r.items || []).length > 12) console.log(`          … +${r.items.length - 12} more`);
  }
  console.log("  " + "─".repeat(74));
  const failed = results.filter((r) => !r.ok);
  console.log(`  ${results.length - failed.length}/${results.length} passed in ${Math.round((Date.now() - t0) / 1000)}s\n`);
  process.exit(failed.length ? 1 : 0);
})();
