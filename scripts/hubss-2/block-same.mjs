// A block that must not change, in either look: this reads the computed colours, type
// and box of everything inside one selector on two sites and lists what differs.
// (The homepage map has its own, map-same.mjs, which also waits for the map.)
//   node scripts/hubss-2/block-same.mjs https://hubss.com http://localhost:4311 /lunch-learn ".ll-hero" [blue|grey]
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const [a, b, path, sel, tone] = process.argv.slice(2);
const PROPS = ["color", "backgroundColor", "backgroundImage", "borderTopColor", "borderTopWidth", "fontSize", "fontWeight", "letterSpacing", "lineHeight", "fontFamily", "paddingTop", "paddingBottom", "borderRadius", "boxShadow", "opacity"];
const browser = await chromium.launch();
let total = 0;
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const read = async (base, withTone) => {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 500, hasTouch: w < 500 });
    const page = await ctx.newPage();
    let ok = false;
    for (let t = 0; t < 4 && !ok; t++) { try { await page.goto(base + path + (withTone && tone ? `${path.includes("?") ? "&" : "?"}tone=${tone}` : ""), { waitUntil: "load", timeout: 90000 }); ok = true; } catch { await page.waitForTimeout(4000); } }
    if (w > 500) await page.mouse.move(8, 400);
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += 700) { await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y); await page.waitForTimeout(80); }
    await page.locator(sel).first().scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(2500);
    await page.waitForFunction((s) => [...(document.querySelector(s)?.querySelectorAll("img") ?? [])].filter((i) => i.getBoundingClientRect().width > 0).every((i) => i.complete), sel, { timeout: 15000 }).catch(() => {});
    const out = await page.evaluate(({ props, s }) => {
      const root = document.querySelector(s); if (!root) return { "(the block)": "missing" };
      const rows = {}; const seen = {};
      for (const el of [root, ...root.querySelectorAll("*")]) {
        if (el.closest("canvas, svg, [data-tone-switch]") && el.tagName !== "svg") continue;
        const bx = el.getBoundingClientRect(); if (!bx.width || !bx.height) continue;
        const cls = typeof el.className === "string" ? el.className.split(/\s+/).slice(0, 3).join(".") : "";
        let key = `${el.tagName.toLowerCase()}.${cls}|${(el.childElementCount ? "" : (el.textContent || "").trim().slice(0, 24))}`;
        seen[key] = (seen[key] || 0) + 1; key += "#" + seen[key];
        const cs = getComputedStyle(el); rows[key] = props.map((p) => cs[p]).join(" ; ") + ` ; ${Math.round(bx.width)}x${Math.round(bx.height)}`;
      }
      return rows;
    }, { props: PROPS, s: sel });
    await ctx.close();
    return out;
  };
  const [A, B] = [await read(a, false), await read(b, true)];
  const keys = new Set([...Object.keys(A), ...Object.keys(B)]);
  const diffs = [...keys].filter((k) => A[k] !== B[k]);
  total += diffs.length;
  console.log(`${w}px: ${keys.size} elements compared, ${diffs.length} differ`);
  for (const k of diffs.slice(0, 10)) { const x = (A[k] || "(missing)").split(" ; "), y = (B[k] || "(missing)").split(" ; "); const which = x.map((v, i) => (v !== y[i] ? `${PROPS[i] ?? "box"}: ${v} -> ${y[i]}` : null)).filter(Boolean).slice(0, 3); console.log("   ", k.slice(0, 60), "|", which.join(" | ").slice(0, 220)); }
}
await browser.close();
console.log(total ? `${total} differences in ${sel} on ${path}${tone ? " (" + tone + ")" : ""}` : `${sel} on ${path} is the same on both${tone ? " (" + tone + ")" : ""}`);
