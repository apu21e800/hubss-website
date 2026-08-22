/** TEMP CHARCOAL MOCKUP — not for commit. Renders current vs charcoal-base vs charcoal-neutral. */
import { chromium } from "playwright";
import * as fs from "fs";

const BASE = "http://localhost:3000";
const OUT = "/tmp/charcoal";
fs.mkdirSync(OUT, { recursive: true });

// Variant A — FULL SWAP: charcoal replaces the navy world as the site base.
const MAP_A = {
  "#0f1620": "#20201F", "#0d1117": "#191918", "#111c2d": "#262522",
  "#182436": "#2e2c29", "#080d16": "#1b1a19", "#1a1e28": "#262523",
  "#222838": "#2e2c2a", "#0c1520": "#232221", "#111111": "#1a1918",
  "#1e1e1e": "#232221", "#141414": "#161615",
};
const VARS_A = `:root{
  --bg-primary:#20201F; --bg-dark:#191918; --bg-slate:#262522; --bg-slate-light:#2E2C29;
  --bg-neutral:#161615; --bg-card:#262523; --bg-card-surface:#2E2C2A; --bg-card-hover:#2E2C2A;
  --bg-card-neutral:#232221; --color-blue-deep:#262522; --color-blue-mid:#1B1A19;
}`;

// Variant B — NEUTRAL LAYER: navy stays; only the neutral/utility grey system goes charcoal.
const MAP_B = {
  "#141414": "#20201F", "#1e1e1e": "#232322", "#111111": "#20201F",
};
const VARS_B = `:root{
  --bg-neutral:#20201F; --bg-card-neutral:#232322;
}`;

const VIEWS = [
  ["home-hero", "/", 0],
  ["home-products", "/", 1800],
  ["home-lunchlearn", "/", 99999],
  ["product-hero", "/products/streetbond", 0],
  ["product-specs", "/products/streetbond", 1400],
  ["resources-top", "/resources", 0],
  ["about-top", "/about", 0],
];

async function fullScrollThrough(page) {
  // trigger every whileInView, then settle
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y <= h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
  });
  await page.waitForTimeout(400);
}

async function applyVariant(page, vars, map) {
  if (vars) await page.addStyleTag({ content: vars });
  if (map) {
    await page.evaluate((m) => {
      const lower = (s) => s.toLowerCase();
      for (const el of document.querySelectorAll("[style]")) {
        const st = el.getAttribute("style");
        if (!st) continue;
        let out = st;
        for (const [from, to] of Object.entries(m)) {
          out = out.replace(new RegExp(from, "gi"), to);
        }
        if (out !== st) el.setAttribute("style", out);
      }
    }, map);
  }
  await page.waitForTimeout(250);
}

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });

for (const [variant, vars, map] of [["current", null, null], ["A-base", VARS_A, MAP_A], ["B-neutral", VARS_B, MAP_B]]) {
  const page = await ctx.newPage();
  let lastPath = null;
  for (const [name, path_, scrollY] of VIEWS) {
    if (path_ !== lastPath) {
      await page.goto(BASE + path_, { waitUntil: "networkidle", timeout: 45000 });
      await fullScrollThrough(page);
      await applyVariant(page, vars, map);
      lastPath = path_;
    }
    await page.evaluate((y) => window.scrollTo(0, Math.min(y, document.body.scrollHeight - innerHeight)), scrollY);
    await page.waitForTimeout(350);
    await page.screenshot({ path: `${OUT}/${name}--${variant}.png` });
  }
  await page.close();
}
await browser.close();
console.log("done", fs.readdirSync(OUT).length, "shots");
