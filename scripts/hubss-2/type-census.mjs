// HUBSS 2.0: every heading's size and line count on the slice pages, at eight widths
// from 320 to 1920. The type scale in app/globals.css was measured with it.
//   npm run build && npx next start -p 4310 &
//   node scripts/hubss-2/type-census.mjs http://localhost:4310 /tmp/type.json
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const [base, out] = process.argv.slice(2);
const PAGES = { home: "/", product: "/products/traffic-patterns-xd", application: "/applications/crosswalks", projects: "/blog", post: "/blog/railway-lands-crosswalks-toronto" };
const WIDTHS = [320, 360, 390, 768, 1024, 1280, 1440, 1920];
const browser = await chromium.launch();
const data = {};
for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 500 ? 780 : 900 } });
  const page = await ctx.newPage();
  for (const [name, path] of Object.entries(PAGES)) {
    await page.goto(base + path, { waitUntil: "load" });
    await page.waitForTimeout(700);
    const rows = await page.evaluate(() => {
      const res = [];
      const vw = document.documentElement.clientWidth;
      for (const el of document.querySelectorAll("main h1, main h2, main h3, footer h2, footer h3")) {
        const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
        if (!r.width || !r.height || cs.visibility === "hidden") continue;
        const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.15;
        const text = el.innerText.replace(/\s+/g, " ").trim();
        if (!text) continue;
        // last line's width share, to spot a widow
        const range = document.createRange(); range.selectNodeContents(el);
        const rects = [...range.getClientRects()].filter((x) => x.width > 1);
        const lines = []; for (const x of rects) { const l = lines.find((y) => Math.abs(y.top - x.top) < lh * 0.5); if (l) { l.left = Math.min(l.left, x.left); l.right = Math.max(l.right, x.right); } else lines.push({ top: x.top, left: x.left, right: x.right }); }
        lines.sort((a, b) => a.top - b.top);
        const widths = lines.map((l) => Math.round(l.right - l.left));
        res.push({ tag: el.tagName.toLowerCase(), cls: (el.className && typeof el.className === "string" ? el.className : "").split(/\s+/).filter((c) => /^(h1-|h2-|eyebrow|hero|text-\[|text-(xs|sm|base|lg|xl|[2-9]xl)|sm:text|lg:text|md:text)/.test(c)).join(" "), size: parseFloat(cs.fontSize), lh: +(lh / parseFloat(cs.fontSize)).toFixed(2), wt: cs.fontWeight, ls: cs.letterSpacing, lines: lines.length, widths, over: r.right > vw + 1 || el.scrollWidth > el.clientWidth + 1, text: text.slice(0, 60) });
      }
      return res;
    });
    data[`${name}@${w}`] = rows;
  }
  await ctx.close();
}
await browser.close();
writeFileSync(out, JSON.stringify(data));
// Brief: per heading text, size and lines by width.
const byText = new Map();
for (const [key, rows] of Object.entries(data)) { const [pg, w] = key.split("@"); for (const r of rows) { const k = `${pg} | ${r.tag}${r.cls ? "." + r.cls.replace(/ /g, ".") : ""} | ${r.text}`; if (!byText.has(k)) byText.set(k, {}); byText.get(k)[w] = `${Math.round(r.size)}/${r.lines}${r.over ? "!" : ""}`; } }
const only = process.argv.includes("--h3") ? /./ : / \| h[12]/;
for (const [k, v] of byText) { if (!only.test(k)) continue; console.log(k.slice(0, 100).padEnd(100), WIDTHS.map((w) => (v[w] ?? "-").padStart(6)).join("")); }
console.log("widths:".padEnd(100), WIDTHS.map((w) => String(w).padStart(6)).join(""), "  (px size / lines, ! = overflows)");
