import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();
const shots = [
  ["http://localhost:3000/", 'h2:has-text("Proven in the Field")', "/tmp/final-fieldnotes.png"],
  ["http://localhost:3000/", 'h2:has-text("Purpose-Built")', "/tmp/final-products-cards.png"],
  ["http://localhost:3000/products/streetbond", 'h3:has-text("Product Features")', "/tmp/final-product-panel.png"],
  ["http://localhost:3000/products/streetprint", 'h2:has-text("Standard templates.")', "/tmp/final-patterns.png"],
  ["http://localhost:3000/products/streetbond", 'h2:has-text("The colour system.")', "/tmp/final-colours.png"],
];
let last = null;
for (const [url, sel, out] of shots) {
  if (url !== last) { await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    await page.evaluate(async () => { const h = document.body.scrollHeight; for (let y = 0; y <= h; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } });
    last = url; }
  const el = page.locator(sel).first();
  await el.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, -70));
  await page.waitForTimeout(450);
  await page.screenshot({ path: out });
}
await b.close(); console.log("ok");
