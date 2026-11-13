// HUBSS 2.0: the accessibility checker (axe, WCAG 2.1 A and AA, every impact, not only
// "critical" as npm run verify reads it) and the tap targets, on the slice pages and the
// three pinned blocks, at 1440 and 390. Give two bases to see them side by side:
//   node scripts/hubss-2/a11y.mjs https://hubss.com http://localhost:4311
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").default;
const bases = process.argv.slice(2).filter((a) => a.startsWith("http"));
const PAGES = ["/", "/products/traffic-patterns-xd", "/applications/crosswalks", "/blog", "/blog/railway-lands-crosswalks-toronto", "/lunch-learn", "/contact", "/product-book", "/about", "/products", "/applications"];
const browser = await chromium.launch();
const totals = {};
for (const base of bases) {
  totals[base] = { axe: 0, taps: 0 };
  for (const w of [1440, 390]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 500 ? 844 : 900 }, isMobile: w < 500, hasTouch: w < 500 });
    const page = await ctx.newPage();
    for (const path of PAGES) {
      await page.goto(base + path, { waitUntil: "load", timeout: 120000 });
      await page.mouse.move(w / 2, 600).catch(() => {});
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < total; y += 700) { await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y); await page.waitForTimeout(70); }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" })); await page.waitForTimeout(900);
      const res = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).exclude(".maplibregl-canvas-container").analyze();
      const v = res.violations.map((x) => `${x.id}(${x.impact}) x${x.nodes.length}`);
      const n = res.violations.reduce((a, x) => a + x.nodes.length, 0); totals[base].axe += n;
      let taps = [];
      if (w < 500) {
        taps = await page.evaluate(() => {
          const out = [];
          for (const el of document.querySelectorAll("a[href], button, input:not([type=hidden]), select, textarea, summary, [role='button'], [role='tab']")) {
            const cs = getComputedStyle(el); if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0 || cs.pointerEvents === "none") continue;
            if (el.closest("[aria-hidden='true'], [inert], .sr-only, .skip-link, .maplibregl-map")) continue;
            const b = el.getBoundingClientRect(); if (b.width < 2 || b.height < 2) continue;
            // a link in running copy is exempt (WCAG 2.5.8, inline)
            if (el.tagName === "A" && cs.display === "inline" && el.closest("p, li, figcaption, dd, td")) continue;
            if (Math.min(b.width, b.height) < 43.5) out.push(`${el.tagName.toLowerCase()} "${(el.innerText || el.getAttribute("aria-label") || el.getAttribute("name") || "").trim().replace(/\s+/g, " ").slice(0, 28)}" ${Math.round(b.width)}x${Math.round(b.height)}`);
          }
          return [...new Set(out)];
        });
        totals[base].taps += taps.length;
      }
      if (v.length || taps.length) console.log(`${base.replace(/^https?:\/\//, "").slice(0, 22).padEnd(22)} ${String(w).padStart(4)} ${path.padEnd(40)} axe: ${v.join(", ") || "none"}${w < 500 ? ` | small taps: ${taps.length}${taps.length ? " " + taps.slice(0, 4).join("; ") : ""}` : ""}`);
    }
    await ctx.close();
  }
}
await browser.close();
for (const [b, t] of Object.entries(totals)) console.log(`${b}: ${t.axe} axe findings, ${t.taps} tap targets under 44px, on ${PAGES.length} pages at two widths`);
