// HUBSS 2.0: the first-screen rules the ad pages and /lunch-learn must keep
// (CLAUDE.md, Conversion Goals and Lunch & Learn page). Run it on main's build
// or hubss.com and on the branch's build, and compare: a cell that passes on
// one must pass on the other. It only loads pages.
//   node scripts/hubss-2/first-screen.mjs http://localhost:4311
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const [base] = process.argv.slice(2);
const PRODUCTS = ["streetprint", "streetbond", "traffic-patterns-xd", "traffic-patterns", "mmax", "decomark"];
const APPS = ["crosswalks", "bike-lanes", "bus-lanes", "regulatory-markings"];
const SIZES = [[360, 640], [375, 667], [390, 844], [768, 1024], [1024, 768], [1440, 900]];
const LL_SIZES = [[1519, 790], [1536, 730], [1440, 789], [1366, 657], [1280, 800], [1024, 768]];
const browser = await chromium.launch();
const rows = [];
let fails = 0;
for (const [w, h] of SIZES) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 500, hasTouch: w < 500 });
  const page = await ctx.newPage();
  for (const [kind, slugs] of [["products", PRODUCTS], ["applications", APPS]]) {
    for (const slug of slugs) {
      const res = await page.goto(`${base}/${kind}/${slug}`, { waitUntil: "load", timeout: 60000 });
      await page.waitForTimeout(600);
      const r = await page.evaluate(() => {
        const vh = window.innerHeight;
        const seen = (el) => { const b = el.getBoundingClientRect(); const cs = getComputedStyle(el); return b.width > 0 && b.height > 0 && cs.visibility !== "hidden" && b.bottom <= vh + 0.5 && b.top >= 0; };
        const inMain = [...document.querySelectorAll("main a")].filter((a) => !a.closest("nav") && !a.closest("footer"));
        const tels = inMain.filter((a) => a.getAttribute("href")?.startsWith("tel:"));
        const east = tels.some((a) => a.href.includes("4165409287") && seen(a));
        const west = tels.some((a) => a.href.includes("6043098212") && seen(a));
        const send = inMain.filter((a) => /send us the project/i.test(a.innerText || ""));
        return { east, west, sendOnScreen: send.some(seen), sendExists: send.length > 0, h1: document.querySelector("h1")?.innerText.replace(/\s+/g, " ").slice(0, 40) };
      });
      // Below lg: both phones and the link inside the first screen. From lg: an
      // application page's phones on the first screen; a product page's line in the ask.
      const ok = res.status() === 200 && (w < 1024 ? r.east && r.west && r.sendOnScreen : kind === "applications" ? r.east && r.west : r.sendExists);
      if (!ok) fails++;
      rows.push(`${ok ? "ok  " : "FAIL"} ${String(w).padStart(4)}x${String(h).padEnd(4)} /${kind}/${slug}  east=${r.east} west=${r.west} send=${r.sendOnScreen}/${r.sendExists}`);
    }
  }
  await ctx.close();
}
for (const [w, h] of LL_SIZES) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  for (const path of ["/lunch-learn", "/lunch-learn?topic=Crosswalks&from=ad"]) {
    await page.goto(base + path, { waitUntil: "load", timeout: 60000 });
    await page.waitForTimeout(1200);
    const r = await page.evaluate(() => { // The booking card itself: #book is the whole first section.
      const card = document.querySelector(".ll-hero [class*='rounded-3xl']") ?? document.querySelector("#book"); if (!card) return null; const b = card.getBoundingClientRect(); return { bottom: Math.round(b.bottom), vh: window.innerHeight }; });
    const ok = !!r && r.bottom <= r.vh;
    if (!ok) fails++;
    rows.push(`${ok ? "ok  " : "FAIL"} ${String(w).padStart(4)}x${String(h).padEnd(4)} ${path}  card bottom ${r?.bottom} of ${r?.vh}`);
  }
  await ctx.close();
}
await browser.close();
const quiet = process.argv.includes("--fails");
for (const row of rows) if (!quiet || row.startsWith("FAIL")) console.log(row);
console.log(`${rows.length - fails} of ${rows.length} pass`);
