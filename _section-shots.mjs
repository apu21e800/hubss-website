import { chromium } from "playwright";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
const page = await ctx.newPage();
const shots = [
  ["/products/streetbond", "The colour system.", "/tmp/colour-streetbond.png"],
  ["/products/streetbondsr", "Solar-reflective colours.", "/tmp/colour-sr.png"],
  ["/products/streetprint", "Standard templates.", "/tmp/patterns-streetprint.png"],
];
for (const [path_, text, out] of shots) {
  await page.goto("http://localhost:3000" + path_, { waitUntil: "networkidle", timeout: 45000 });
  const h = page.locator(`h2:has-text("${text}")`);
  await h.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, -80));
  await page.waitForTimeout(500);
  await page.screenshot({ path: out });
}
await browser.close();
console.log("ok");
