// HUBSS 2.0: one rule for the small capitals. A small-capitals label is grey, or
// cream on a photograph; it is never orange. Orange is the colour of action.
// Two things keep their colour: the classic blocks (the map, Lunch & Learn's
// card, the book's reader), and a story's kicker, which names its section.
//   node scripts/hubss-2/labels.mjs http://localhost:4311 [paths...]
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const [base, ...extra] = process.argv.slice(2);
const PAGES = extra.length ? extra : [
  "/", "/products", "/products/traffic-patterns-xd", "/products/streetprint", "/products/streetbond", "/applications", "/applications/crosswalks",
  "/applications/bike-lanes", "/blog", "/blog/projects", "/blog/guides", "/blog/railway-lands-crosswalks-toronto", "/about", "/contact", "/lunch-learn",
  "/resources", "/gallery", "/patterns", "/request-product-book", "/privacy", "/this-page-does-not-exist",
];
const browser = await chromium.launch();
let bad = 0;
for (const w of [1440, 390]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 500, hasTouch: w < 500 });
  const page = await ctx.newPage();
  for (const path of PAGES) {
    await page.goto(base + path, { waitUntil: "load", timeout: 120000 });
    await page.waitForTimeout(700);
    const found = await page.evaluate(() => {
      const out = [];
      const orange = (c) => { const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/); if (!m) return false; const [r, g, b] = [+m[1], +m[2], +m[3]]; return r >= 170 && g >= 50 && g <= 175 && b <= 90 && r - b >= 110; };
      for (const el of document.querySelectorAll("body *")) {
        if (el.closest('[data-surface="classic"], [data-catalogue-route], #map, [aria-hidden="true"], svg')) continue;
        // A story's kicker names its section in the section's own colour
        // (components/blog/BlogCard.tsx StoryKicker): that colour is its job.
        if (el.closest(".kicker-parts, [data-kicker]")) continue;
        const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1); if (!own) continue;
        const cs = getComputedStyle(el); if (cs.textTransform !== "uppercase") continue;
        const fs = parseFloat(cs.fontSize); const ls = parseFloat(cs.letterSpacing) || 0; if (fs > 14.5 || ls / fs < 0.07) continue;
        if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) continue;
        if (!orange(cs.color)) continue;
        // A link's or a button's own words may be orange: orange is the colour of
        // action. A label inside a card that happens to be a link is still a label.
        const act = el.closest("a, button, [role='button'], summary");
        if (act && act.textContent.trim().replace(/\s+/g, " ") === el.textContent.trim().replace(/\s+/g, " ")) continue;
        const b = el.getBoundingClientRect(); if (!b.width) continue;
        out.push(`"${el.textContent.trim().replace(/\s+/g, " ").slice(0, 44)}" ${el.tagName.toLowerCase()}.${(typeof el.className === "string" ? el.className : "").split(" ").slice(0, 3).join(".")} ${cs.color} ${fs}px`);
      }
      return [...new Set(out)];
    });
    if (found.length) { bad += found.length; console.log(`${String(w).padStart(5)} ${path}`); found.forEach((f) => console.log("        ", f)); }
  }
  await ctx.close();
}
await browser.close();
console.log(bad ? `${bad} orange labels` : `clean: no orange small-capitals label on ${PAGES.length} pages at 1440 and 390`);
