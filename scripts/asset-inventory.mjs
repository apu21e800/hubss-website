/**
 * Asset inventory generator — the "where is everything" report.
 *
 *   npm run assets:inventory
 *
 * Walks /public/images and /public/docs and rewrites docs/ASSET-INVENTORY.md
 * with per-folder counts, sizes, and what consumes each folder. Run it after
 * adding/removing assets so the map stays true.
 */
import * as fs from "fs";
import * as path from "path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "docs", "ASSET-INVENTORY.md");

function walkStats(dir) {
  let files = 0, bytes = 0;
  const abs = path.join(ROOT, "public", dir);
  if (!fs.existsSync(abs)) return null;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    if (e.isDirectory()) continue;
    const st = fs.statSync(path.join(abs, e.name));
    files++; bytes += st.size;
  }
  return { files, mb: (bytes / 1048576).toFixed(1) };
}

function subdirs(dir) {
  const abs = path.join(ROOT, "public", dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => `${dir}/${e.name}`)
    .sort();
}

const CONSUMERS = {
  "images/products": "Product pages — hero from lib/products.ts imageUrl; gallery = folder scan (lib/asset-scan.ts)",
  "images/applications": "Application pages — hero from lib/applications.ts; gallery = folder scan",
  "images/blog": "Blog posts — featuredImage frontmatter + inline MDX refs (one folder per post slug)",
  "images/patterns": "/patterns library + StreetPrint templates section (lib/pattern-templates.ts)",
  "images/hero": "Homepage hero slideshow",
  "images/logos": "Brand + partner logos",
  "images/partners": "TrustedBy marquee",
  "images/lunch-learn": "Lunch & Learn funnel (moose mascot etc.)",
  "images/about": "About page",
  "images/instagram": "Instagram strip",
  "images/textures": "Section background textures",
  "images/icons": "UI icons",
  "images/flags": "Locale flags",
  "images/_featured": "Featured-image overrides (lib/featured-images.ts)",
  "images/assets": "Misc legacy assets (logos, installation exports) — prune candidate",
  "images/projects": "Map + project entries (lib/map-projects.ts)",
  "images/catalogue-figma": "Downscaled photo set streamed by the Figma catalogue plugin",
  "docs": "Resource library PDFs — one folder per product line (app/resources)",
};

let md = `# Asset Inventory — hubss-website

_Regenerate with \`npm run assets:inventory\`. Generated into docs/ASSET-INVENTORY.md._

Folder-driven galleries: product + application galleries are the contents of
their folders (see \`docs/ASSETS.md\`). Add/delete files there; heroes are set
in \`lib/products.ts\` / \`lib/applications.ts\`.

| Folder | Files | MB | Used by |
|---|---:|---:|---|
`;

const rows = [];
for (const top of ["images", "docs"]) {
  for (const dir of subdirs(top)) {
    const st = walkStats(dir);
    if (!st) continue;
    const key = Object.keys(CONSUMERS).find((k) => dir === k || dir.startsWith(k + "/"));
    const consumer = dir === key ? CONSUMERS[key] : (key ? "" : "");
    rows.push({ dir, ...st, consumer });
    // one level deeper for images/products + images/applications + docs
    if (["images/products", "images/applications", "images/blog", "docs"].includes(dir)) {
      for (const sub of subdirs(dir)) {
        const s2 = walkStats(sub);
        if (s2) rows.push({ dir: "&nbsp;&nbsp;└ " + sub, ...s2, consumer: "" });
      }
    }
  }
}
for (const r of rows) md += `| ${r.dir} | ${r.files} | ${r.mb} | ${r.consumer} |\n`;

const totalImgs = walkStats("images");
md += `\n_Top-level loose files in /public/images: ${totalImgs?.files ?? 0} (${totalImgs?.mb ?? 0} MB)._\n`;
md += `\nGenerated: ${new Date().toISOString().slice(0, 10)}\n`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, md);
console.log("Wrote docs/ASSET-INVENTORY.md —", rows.length, "rows");
