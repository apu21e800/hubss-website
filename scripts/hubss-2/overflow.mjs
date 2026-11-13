// HUBSS 2.0: nothing runs past the screen's edge on the slice pages, 320 to 1440.
//   node scripts/hubss-2/overflow.mjs http://localhost:4310 [paths...]
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const [base, ...extra] = process.argv.slice(2);
const PAGES = extra.length ? extra : ["/", "/products/traffic-patterns-xd", "/applications/crosswalks", "/blog", "/blog/railway-lands-crosswalks-toronto"];
const WIDTHS = [320, 360, 375, 390, 414, 768, 1024, 1280, 1440];
const browser = await chromium.launch();
let bad = 0;
for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 800 }, isMobile: w < 500, hasTouch: w < 500 });
  const page = await ctx.newPage();
  for (const path of PAGES) {
    await page.goto(base + path, { waitUntil: "load", timeout: 120000 });
    await page.waitForTimeout(900);
    const r = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const doc = document.documentElement.scrollWidth, body = document.body.scrollWidth;
      const out = [];
      for (const el of document.querySelectorAll("main h1, main h2, main h3, main p, main a, main button, main li, header *, nav a, nav button, footer a, footer p")) {
        const cs = getComputedStyle(el); if (cs.display === "none" || cs.visibility === "hidden") continue;
        const b = el.getBoundingClientRect(); if (!b.width || !b.height) continue;
        // inside a sideways scroller or a clipped carousel is fine
        let p = el.parentElement, scroller = false; while (p && p !== document.body) { const o = getComputedStyle(p).overflowX; if (o === "auto" || o === "scroll" || o === "hidden" || o === "clip") { const pb = p.getBoundingClientRect(); if (pb.right <= vw + 1 && pb.left >= -1) { scroller = true; break; } } p = p.parentElement; }
        if (scroller) continue;
        if (b.right > vw + 1.5 || b.left < -1.5) out.push(`${el.tagName.toLowerCase()}.${(typeof el.className === "string" ? el.className : "").split(" ").slice(0, 2).join(".")} "${(el.innerText || "").replace(/\s+/g, " ").slice(0, 34)}" right=${Math.round(b.right)} left=${Math.round(b.left)}`);
      }
      return { vw, doc, body, out: [...new Set(out)].slice(0, 4) };
    });
    if (r.doc > r.vw + 1 || r.out.length) { bad++; console.log(`${String(w).padStart(5)} ${path.padEnd(42)} doc=${r.doc} vw=${r.vw}`); r.out.forEach((o) => console.log("        ", o)); }
  }
  await ctx.close();
}
await browser.close();
console.log(bad ? `${bad} page-widths with something past the edge` : `clean: ${PAGES.length} pages x ${WIDTHS.length} widths, nothing past the edge`);
