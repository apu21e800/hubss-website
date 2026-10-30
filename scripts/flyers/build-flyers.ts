/**
 * `npx tsx scripts/flyers/build-flyers.ts [--only=<slug>] [--check]`: the
 * fourteen product flyers (28 Oct 2026; Vern: the May flyers "look like not
 * much effort was put into them"), two Letter pages each, into
 * public/resources/flyers under the May names, so every link to them holds:
 *   HUBSS-Flyer-<slug>-v01.pdf  the flyer
 *   <slug>-preview.webp         page 1, 1200px wide (the /resources card)
 *   <slug>-share.jpg            1200 x 630 (a link's preview image)
 *
 * The words and photographs are scripts/flyers/flyer-content.ts, the page is
 * scripts/flyers/flyer-template.ts. The offices are Site Settings as the site
 * prints them (Studio, else the code's copy). Photographs are cropped around
 * their focus to each box at up to 300 dpi; a Sanity photo is fetched once
 * into FLYER_CACHE (default: the system's temp folder). Inter is embedded as
 * TrueType (scripts/flyers/fonts: Inter 4.1, OFL), never Type 3.
 *
 * --check builds nothing: it reports what would not fit (a page's words
 * running into its foot) for every flyer. A build fails on the same.
 * Needs qrcode (a dev dependency) and Playwright's Chromium.
 */
import fs from "fs";
import os from "os";
import path from "path";
import { createRequire } from "module";
import sharp from "sharp";
import { chromium, type BrowserContext } from "playwright";
import { FLYERS, completeFlyer, type FlyerPhoto, type PhotoSource } from "./flyer-content";
import { BOX, flyerHtml, shareHtml, type FlyerAssets } from "./flyer-template";
import { mergeSiteSettings, type SanitySiteSettings } from "../../lib/site-settings";

const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "public/resources/flyers");
const FONTS = path.join(__dirname, "fonts");
const LOGO = path.join(ROOT, "public/images/assets/logos/hubss-logos/logo-with-white-text.png");
const BOOK = (n: number) => path.join(ROOT, `public/catalogue/2026-27/p${String(n).padStart(3, "0")}-2000.webp`);
const CACHE = process.env.FLYER_CACHE || path.join(os.tmpdir(), "hubss-flyer-photos");
const WORK = fs.mkdtempSync(path.join(os.tmpdir(), "hubss-flyers-"));
const SANITY = "https://cdn.sanity.io/images/9dbro2m1/production/";
const DPI = 300;
/** A printed page's caption starts about 93% down (lib/idea-book-edition.ts SITE_PAGE_CAPTION). */
const PAGE_CAPTION = 0.92;

const args = process.argv.slice(2);
const only = args.find((a) => a.startsWith("--only="))?.split("=")[1];
const CHECK = args.includes("--check");
/** --draft=<folder>: both pages of every flyer as PNGs there, fitting or not, and nothing else. */
const DRAFT = args.find((a) => a.startsWith("--draft="))?.split("=")[1];

// qrcode has no types of its own; this is the one call used.
const QRCode = createRequire(__filename)("qrcode") as {
  toString(text: string, opts: { type: "svg"; margin: number; errorCorrectionLevel: "M"; color: { dark: string; light: string } }): Promise<string>;
};

const px = (cssPx: number) => Math.round((cssPx / 96) * DPI);
const fileUrl = (f: string) => "file://" + f;

/** The photograph's bytes: a Sanity file (fetched once), a /public file or a printed page's band. */
async function source(src: PhotoSource): Promise<{ input: Buffer; band?: { top: number; bottom: number } }> {
  if ("cdn" in src) {
    fs.mkdirSync(CACHE, { recursive: true });
    const file = path.join(CACHE, src.cdn);
    if (!fs.existsSync(file)) {
      const res = await fetch(SANITY + src.cdn);
      if (!res.ok) throw new Error(`${src.cdn}: ${res.status} from Sanity`);
      fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    }
    return { input: fs.readFileSync(file) };
  }
  if ("pub" in src) {
    const file = path.join(ROOT, "public", src.pub.replace(/^\//, ""));
    if (!fs.existsSync(file)) throw new Error(`${src.pub}: not in /public`);
    return { input: fs.readFileSync(file) };
  }
  const file = BOOK(src.book);
  if (!fs.existsSync(file)) throw new Error(`page ${src.book}: no 2000px render`);
  return { input: fs.readFileSync(file), band: { top: 0, bottom: src.bottom ?? PAGE_CAPTION } };
}

/** Cropped to the box's shape around its focus, at up to 300 dpi, as a JPEG; its dpi on the page. */
async function prepare(photo: FlyerPhoto, box: { w: number; h: number }, name: string): Promise<{ url: string; dpi: number }> {
  const { input, band } = await source(photo.src);
  let img = sharp(input).rotate();
  let { width: W = 0, height: H = 0 } = await img.metadata();
  if (band) {
    const top = Math.round(band.top * H);
    const height = Math.round((band.bottom - band.top) * H);
    img = sharp(await img.extract({ left: 0, top, width: W, height }).toBuffer());
    H = height;
  }
  const want = box.w / box.h;
  let cw = W;
  let ch = Math.round(W / want);
  if (ch > H) { ch = H; cw = Math.round(H * want); }
  const [fx, fy] = photo.focus ?? [0.5, 0.5];
  const left = Math.min(W - cw, Math.max(0, Math.round(fx * W - cw / 2)));
  const top = Math.min(H - ch, Math.max(0, Math.round(fy * H - ch / 2)));
  const outW = Math.min(cw, px(box.w));
  const file = path.join(WORK, `${name}.jpg`);
  await img.extract({ left, top, width: cw, height: ch }).resize({ width: outW }).jpeg({ quality: 84, mozjpeg: true }).toFile(file);
  return { url: fileUrl(file), dpi: Math.round((outW / box.w) * 96) };
}

/** Site Settings as the site prints them: Studio's, else the code's. */
async function offices() {
  const q = encodeURIComponent(`*[_id == "siteSettings"][0]{offices}`);
  try {
    const res = await fetch(`https://9dbro2m1.api.sanity.io/v2024-01-01/data/query/production?query=${q}`);
    const json = (await res.json()) as { result?: SanitySiteSettings | null };
    return mergeSiteSettings(json.result ?? null).offices;
  } catch {
    console.warn("Site Settings unreachable: the code's offices are used");
    return mergeSiteSettings(null).offices;
  }
}

/** What would not fit: words running into a page's foot, or past a region's edge. */
async function overflow(ctx: BrowserContext, html: string): Promise<string[]> {
  const page = await ctx.newPage();
  await page.setViewportSize({ width: 816, height: 1056 });
  const file = path.join(WORK, `check-${Date.now()}.html`);
  fs.writeFileSync(file, html);
  await page.goto(fileUrl(file), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const problems = await page.evaluate(() => {
    const out: string[] = [];
    const box = (el: Element | null) => el?.getBoundingClientRect();
    const [front, back] = [...document.querySelectorAll(".page")];
    // Front: the words above the uses strip.
    const foot = box(front.querySelector(".front-foot"));
    for (const el of front.querySelectorAll(".front-body > :not(.front-foot)")) {
      const r = el.getBoundingClientRect();
      if (foot && r.bottom > foot.top - 10) out.push(`front: "${(el.textContent ?? "").trim().slice(0, 40)}" runs ${Math.round(r.bottom - foot.top + 10)}px into the uses strip`);
    }
    // Back: the sections inside their column, above the dark close.
    const body = back.querySelector(".back-body") as HTMLElement | null;
    if (body && body.scrollHeight > body.clientHeight + 1) out.push(`back: ${body.scrollHeight - body.clientHeight}px more than the page holds`);
    for (const el of back.querySelectorAll(".close > div:not(.legal)")) {
      // The words' own extent: a grid column stretches to the band's height.
      const range = document.createRange();
      range.selectNodeContents(el);
      const r = range.getBoundingClientRect();
      const legal = box(back.querySelector(".legal"));
      if (legal && r.bottom > legal.top - 6) out.push(`close: "${(el.textContent ?? "").trim().slice(0, 30)}" runs into the legal line`);
    }
    // Nothing wider than its own box (a long word, a spec value).
    for (const el of document.querySelectorAll(".spec .v, .where div, .job .t, .job .s, .office, .qrcap b, .step .b")) {
      if ((el as HTMLElement).scrollWidth > (el as HTMLElement).clientWidth + 1) out.push(`too wide: "${(el.textContent ?? "").trim().slice(0, 40)}"`);
    }
    return out;
  });
  await page.close();
  return problems;
}

async function main() {
  const list = FLYERS.filter((f) => !only || f.slug === only);
  if (!list.length) throw new Error(`no flyer "${only}"`);
  const office = await offices();
  fs.mkdirSync(OUT, { recursive: true });

  const logo = path.join(WORK, "logo-white.png");
  await sharp(LOGO).resize({ width: px(170) }).png().toFile(logo);

  const executablePath = ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].find((p) => fs.existsSync(p));
  const browser = await chromium.launch(executablePath ? { executablePath } : {});
  // tsx names functions with an __name helper the page doesn't have.
  const shim = { content: "window.__name = (f) => f;" };
  const ctx = await browser.newContext({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 1200 / 816 });
  await ctx.addInitScript(shim);
  const shareCtx = await browser.newContext({ viewport: { width: 1200, height: 630 } });
  await shareCtx.addInitScript(shim);
  const failures: string[] = [];
  try {
    for (const spec of list) {
      const f = completeFlyer(spec, office);
      const heroBox = f.hero.layout === "framed" ? (f.hero.small ? BOX.heroFramedSmall : BOX.heroFramed) : BOX.heroFull;
      const jobBox = f.jobs.length === 2 ? BOX.job2 : BOX.job3;
      const hero = await prepare(f.hero, heroBox, `${f.slug}-hero`);
      const jobs = await Promise.all(f.jobs.map((j, i) => prepare(j, jobBox, `${f.slug}-job${i}`)));
      const steps = await Promise.all((f.steps?.items ?? []).map((s, i) => (s.photo ? prepare(s.photo, BOX.step, `${f.slug}-step${i}`) : Promise.resolve(null))));
      const qr = await QRCode.toString(f.qrHref, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#111111", light: "#ffffff" } });
      const assets: FlyerAssets = {
        hero: hero.url,
        jobs: jobs.map((j) => j.url),
        steps: steps.map((s) => s?.url ?? ""),
        logoWhite: fileUrl(logo),
        qr,
        fontDir: fileUrl(FONTS),
      };
      const low = [hero, ...jobs, ...steps].filter((p): p is { url: string; dpi: number } => !!p && p.dpi < 150);
      const html = flyerHtml(f, assets);
      const problems = await overflow(ctx, html);
      const line = `${f.slug}: hero ${hero.dpi} dpi${jobs.length ? `, jobs ${jobs.map((j) => j.dpi).join("/")} dpi` : ""}${low.length ? ` (${low.length} under 150 dpi)` : ""}`;
      if (DRAFT) {
        fs.mkdirSync(DRAFT, { recursive: true });
        const file = path.join(WORK, `${f.slug}.html`);
        fs.writeFileSync(file, html);
        const page = await ctx.newPage();
        await page.goto(fileUrl(file), { waitUntil: "load" });
        await page.evaluate(() => document.fonts.ready);
        const pages = page.locator(".page");
        for (let i = 0; i < 2; i++) await pages.nth(i).screenshot({ path: path.join(DRAFT, `${f.slug}-${i + 1}.png`) });
        await page.close();
        console.log(`${line}${problems.length ? `\n  ${problems.join("\n  ")}` : " · fits"}`);
        continue;
      }
      if (problems.length) {
        failures.push(f.slug);
        console.log(`${line}\n  ${problems.join("\n  ")}`);
        continue;
      }
      if (CHECK) { console.log(`${line} · fits`); continue; }

      const file = path.join(WORK, `${f.slug}.html`);
      fs.writeFileSync(file, html);
      const page = await ctx.newPage();
      await page.goto(fileUrl(file), { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      const pdf = path.join(OUT, `HUBSS-Flyer-${f.slug}-v01.pdf`);
      await page.pdf({ path: pdf, width: "8.5in", height: "11in", printBackground: true, preferCSSPageSize: true });
      const shot = await page.locator(".page").first().screenshot({ type: "png" });
      await sharp(shot).resize({ width: 1200 }).webp({ quality: 82 }).toFile(path.join(OUT, `${f.slug}-preview.webp`));
      await page.close();

      const shareFile = path.join(WORK, `${f.slug}-share.html`);
      const shareHero = await prepare(f.hero, { w: 1200, h: 630 }, `${f.slug}-share-photo`);
      fs.writeFileSync(shareFile, shareHtml(f, { ...assets, hero: shareHero.url }));
      const share = await shareCtx.newPage();
      await share.goto(fileUrl(shareFile), { waitUntil: "load" });
      await share.evaluate(() => document.fonts.ready);
      const png = await share.screenshot({ type: "png" });
      await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(OUT, `${f.slug}-share.jpg`));
      await share.close();
      console.log(`${line} · ${(fs.statSync(pdf).size / 1048576).toFixed(1)} MB`);
    }
  } finally {
    await browser.close();
    fs.rmSync(WORK, { recursive: true, force: true });
  }
  if (failures.length) {
    console.error(`\n${failures.length} flyer(s) do not fit: ${failures.join(", ")}`);
    process.exit(1);
  }
  // The /resources preview shows page images, not the PDF: without fresh
  // ones a phone gets the raw file, blank on Android and zoomed in on an
  // iPhone (30 Oct 2026). The images are made in Python, so it's a second step.
  if (!CHECK && !DRAFT) {
    console.log("\nNext: python scripts/gen-pdf-previews.py --only resources/flyers  (the preview pages /resources shows)");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
