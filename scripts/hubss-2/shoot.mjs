// HUBSS 2.0: the before-and-after pictures. First screens and whole-page strips of the
// slice pages at 1440 and 390, the menus with --menus. Only ever pointed at a local
// build: it loads pages and sends nothing.
//   node scripts/hubss-2/shoot.mjs http://localhost:4310 /tmp/shots --menus
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const sharp = require("sharp");
const [base, out, pagesArg] = process.argv.slice(2);
const MENUS = process.argv.includes("--menus");
const PAGES = {
  home: "/",
  product: "/products/traffic-patterns-xd",
  application: "/applications/crosswalks",
  projects: "/blog",
  post: "/blog/railway-lands-crosswalks-toronto",
};
const want = pagesArg && !pagesArg.startsWith("--") ? pagesArg.split(",") : Object.keys(PAGES);
const VIEWS = [{ w: 1440, h: 900, strip: 480 }, { w: 390, h: 844, strip: 300 }];
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const heights = {};
for (const v of VIEWS) {
  const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: 1, isMobile: v.w < 500, hasTouch: v.w < 500 });
  const page = await ctx.newPage();
  for (const name of want) {
    const url = base + (PAGES[name] ?? name);
    await page.goto(url, { waitUntil: "load", timeout: 60000 });
    await page.mouse.move(v.w / 2, v.h - 40);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${out}/${name}-${v.w}-top.png` });
    // Walk the page so lazy photos load and entrances play, then come back up.
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    heights[`${name}-${v.w}`] = total;
    for (let y = 0; y < total; y += Math.round(v.h * 0.8)) { await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y); await page.waitForTimeout(140); }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(3600);
    const full = await page.screenshot({ fullPage: true });
    const img = sharp(full).resize({ width: v.strip });
    const buf = await img.png().toBuffer();
    const meta = await sharp(buf).metadata();
    const TILE = 1500;
    for (let i = 0, top = 0; top < meta.height; i++, top += TILE) {
      await sharp(buf).extract({ left: 0, top, width: meta.width, height: Math.min(TILE, meta.height - top) }).jpeg({ quality: 78 }).toFile(`${out}/${name}-${v.w}-strip${i}.jpg`);
    }
  }
  if (MENUS) {
    await page.goto(base + "/", { waitUntil: "load" });
    await page.waitForTimeout(1200);
    if (v.w >= 1024) {
      for (const label of ["Products", "Applications", "Projects"]) {
        const trigger = page.locator("nav button, nav a").filter({ hasText: new RegExp(`^${label}$`) }).first();
        await trigger.hover();
        await page.waitForTimeout(900);
        await page.screenshot({ path: `${out}/menu-${label.toLowerCase()}-${v.w}.png` });
        await page.mouse.move(v.w / 2, v.h - 30);
        await page.waitForTimeout(500);
      }
    } else {
      const burger = page.locator('button[aria-label*="menu" i]').first();
      await burger.tap();
      await page.waitForTimeout(900);
      await page.screenshot({ path: `${out}/menu-phone-${v.w}.png` });
    }
  }
  await ctx.close();
}
await browser.close();
writeFileSync(`${out}/heights.json`, JSON.stringify(heights, null, 1));
console.log(JSON.stringify(heights));
