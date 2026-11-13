// HUBSS 2.0: what a page costs a phone (390x844 at DPR 3), on load and after reading
// to the foot. Run it the same way on main's build and the branch's: no page may
// get heavier on a phone than it is today.
//   node scripts/hubss-2/weigh.mjs http://localhost:4310 /tmp/weight.json
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");
const [base, out] = process.argv.slice(2);
const PAGES = { home: "/", product: "/products/traffic-patterns-xd", application: "/applications/crosswalks", projects: "/blog", post: "/blog/railway-lands-crosswalks-toronto", "lunch-learn": "/lunch-learn", "product-book": "/product-book" };
const browser = await chromium.launch();
const result = {};
for (const [name, path] of Object.entries(PAGES)) {
  const ctx = await browser.newContext({ ...devices["iPhone 14"], viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  const types = new Map(); const sizes = {};
  cdp.on("Network.responseReceived", (e) => types.set(e.requestId, e.type));
  cdp.on("Network.loadingFinished", (e) => { const t = types.get(e.requestId) || "Other"; sizes[t] = (sizes[t] || 0) + e.encodedDataLength; });
  await page.goto(base + path, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(4500);
  const onLoad = { ...sizes };
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += 600) { await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y); await page.waitForTimeout(160); }
  await page.waitForTimeout(2500);
  const kb = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Math.round(v / 1024)]));
  const sum = (o) => Math.round(Object.values(o).reduce((a, b) => a + b, 0) / 1024);
  result[name] = { loadKB: sum(onLoad), scrolledKB: sum(sizes), height: total, load: kb(onLoad), scrolled: kb(sizes), nodes: await page.evaluate(() => document.querySelectorAll("*").length) };
  await ctx.close();
}
await browser.close();
writeFileSync(out, JSON.stringify(result, null, 1));
for (const [k, v] of Object.entries(result)) console.log(k.padEnd(13), "load", String(v.loadKB).padStart(5), "KB  scrolled", String(v.scrolledKB).padStart(5), "KB  height", v.height, " nodes", v.nodes, " img", v.load.Image ?? 0, "js", v.load.Script ?? 0, "css", v.load.Stylesheet ?? 0, "font", v.load.Font ?? 0, "doc", v.load.Document ?? 0);
