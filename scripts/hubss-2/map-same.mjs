// HUBSS 2.0: the homepage map must not change ("don't mess with the map"). This reads
// the computed colours, type and box of everything inside #map on two builds and lists
// what differs. The map's own canvas is not compared.
//   node scripts/hubss-2/map-same.mjs https://hubss.com http://localhost:4311
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const [a, b] = process.argv.slice(2);
const PROPS = ["color", "backgroundColor", "backgroundImage", "borderTopColor", "borderTopWidth", "fontSize", "fontWeight", "letterSpacing", "lineHeight", "fontFamily", "paddingTop", "paddingBottom", "borderRadius", "boxShadow", "opacity"];
const browser = await chromium.launch();
let total = 0;
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const read = async (base) => {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 500, hasTouch: w < 500 });
    const page = await ctx.newPage();
    await page.goto(base + "/", { waitUntil: "load", timeout: 90000 });
    await page.locator("#map").scrollIntoViewIfNeeded();
    // Read both at the same moment in the map's life: once it says it is ready
    // (CanadaMap sets window.__hubssMapReady on its first idle), and after the
    // opening hint has faded. Read sooner, a slow network leaves the loading
    // shield up on one side and the hint mid-fade, and they count as differences.
    await page.waitForFunction(() => window.__hubssMapReady === true, null, { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(6500);
    // ...and once the list's photographs are in: a photo still on its way reads
    // differently from one that has arrived (one run in four on 13 Nov 2026).
    await page.waitForFunction(() => [...document.querySelectorAll("#map img")].filter((i) => i.getBoundingClientRect().width > 0).every((i) => i.complete), null, { timeout: 15000 }).catch(() => {});
    const out = await page.evaluate((props) => {
      const root = document.querySelector("#map"); const rows = {}; const seen = {};
      for (const el of root.querySelectorAll("*")) {
        if (el.closest("canvas, .maplibregl-canvas-container, .maplibregl-marker, [class*='maplibregl-ctrl-attrib']") || el.tagName === "CANVAS") continue;
        const b = el.getBoundingClientRect(); if (!b.width || !b.height) continue;
        const cls = typeof el.className === "string" ? el.className.split(/\s+/).slice(0, 3).join(".") : "";
        let key = `${el.tagName.toLowerCase()}.${cls}|${(el.childElementCount ? "" : (el.textContent || "").trim().slice(0, 24))}`;
        seen[key] = (seen[key] || 0) + 1; key += "#" + seen[key];
        const cs = getComputedStyle(el); rows[key] = props.map((p) => cs[p]).join(" ; ") + ` ; ${Math.round(b.width)}x${Math.round(b.height)}`;
      }
      const r = root.getBoundingClientRect(); rows["#map box"] = `${Math.round(r.width)}x${Math.round(r.height)}`;
      return rows;
    }, PROPS);
    await ctx.close();
    return out;
  };
  const [A, B] = [await read(a), await read(b)];
  const keys = new Set([...Object.keys(A), ...Object.keys(B)]);
  const diffs = [...keys].filter((k) => A[k] !== B[k]);
  total += diffs.length;
  console.log(`${w}px: ${keys.size} elements compared, ${diffs.length} differ`);
  for (const k of diffs.slice(0, 8)) { const x = (A[k] || "(missing)").split(" ; "), y = (B[k] || "(missing)").split(" ; "); const which = x.map((v, i) => (v !== y[i] ? `${PROPS[i] ?? "box"}: ${v} -> ${y[i]}` : null)).filter(Boolean).slice(0, 3); console.log("   ", k.slice(0, 60), "|", which.join(" | ").slice(0, 200)); }
}
await browser.close();
console.log(total ? `${total} differences` : "the map block is the same on both");
