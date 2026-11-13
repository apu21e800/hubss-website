// HUBSS 2.0: what the home page fetches for pages the visitor has not opened (route
// data, plus the photographs those routes ask for), as the page opens and after a
// first 400px flick. The windows are the size real browsers give, not the size of
// the screen: a 390x844 phone shows 664 to 745px of page. Reads only, sends nothing.
//   node scripts/hubss-2/fetch-ahead.mjs https://hubss.com http://localhost:4311
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const bases = process.argv.slice(2);
const WINDOWS = [
  ["iPhone 14, Safari's bars showing", 390, 664, 3, true],
  ["iPhone 14, bars tucked", 390, 745, 3, true],
  ["Pixel 8, Chrome", 412, 785, 2.625, true],
  ["iPhone Pro Max, bars tucked", 430, 833, 3, true],
  ["iPad, portrait", 768, 954, 2, true],
  ["Laptop, a 1440x900 screen", 1440, 789, 1, false],
];
const browser = await chromium.launch();
for (const base of bases) {
  console.log("==", base);
  for (const [name, w, h, dpr, touch] of WINDOWS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: touch && w < 500, hasTouch: touch });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page); await cdp.send("Network.enable");
    const req = new Map(); const rows = [];
    cdp.on("Network.requestWillBeSent", (e) => req.set(e.requestId, { url: e.request.url, init: e.initiator.type, type: e.type }));
    cdp.on("Network.loadingFinished", (e) => { const r = req.get(e.requestId); if (r) rows.push({ ...r, kb: e.encodedDataLength / 1024 }); });
    let ok = false;
    for (let t = 0; t < 4 && !ok; t++) { try { await page.goto(base + "/", { waitUntil: "load", timeout: 60000 }); ok = true; } catch { rows.length = 0; await page.waitForTimeout(4000); } }
    if (!ok) { console.log(`  ${name.padEnd(34)} could not be reached`); await ctx.close(); continue; }
    if (!touch) await page.mouse.move(700, 300);
    await page.waitForTimeout(4500);
    // A photograph a script asked for is one a fetched route brought with it.
    const other = () => { const ph = rows.filter((r) => r.type === "Image" && r.init === "script"); const rs = rows.filter((r) => r.url.includes("_rsc=")); const kb = (a) => a.reduce((x, r) => x + r.kb, 0); return `${(kb(ph) + kb(rs)).toFixed(0)} KB (${ph.length} photos ${kb(ph).toFixed(0)} KB, ${rs.length} route fetches)`; };
    const atLoad = other();
    await page.evaluate(() => window.scrollTo({ top: 400, behavior: "instant" })); await page.waitForTimeout(3500);
    console.log(`  ${name.padEnd(34)} ${w}x${h} at ${dpr}x | as it opens: ${atLoad.padEnd(46)} | after a 400px flick: ${other()}`);
    await ctx.close();
  }
}
await browser.close();
