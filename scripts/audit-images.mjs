import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const publicRoot = path.join(root, 'public');

// ── 1. Collect all /images/... references from source files ─────────────────
const imgRegex = /['"`](\/images\/[^'"`\s\)>]+)['"`]/g;
const referenced = new Map(); // path -> Set<sourceFile>

function addRef(imgPath, sourceLabel) {
  if (!referenced.has(imgPath)) referenced.set(imgPath, new Set());
  referenced.get(imgPath).add(sourceLabel);
}

function scanFile(filePath) {
  const rel = filePath.replace(root + path.sep, '').replace(/\\/g, '/');
  let content;
  try { content = fs.readFileSync(filePath, 'utf8'); } catch { return; }
  let m;
  const re = new RegExp(imgRegex.source, 'g');
  while ((m = re.exec(content)) !== null) {
    const imgPath = m[1].split('?')[0].split('#')[0];
    if (!imgPath.match(/\.(jpg|jpeg|png|webp|gif|svg|avif|ico|pdf)$/i)) continue;
    addRef(imgPath, rel);
  }
}

function walkSrc(dir, depth = 0) {
  if (depth > 8 || !fs.existsSync(dir)) return;
  const skip = new Set(['node_modules', '.next', '.git', '.claude', 'hubss-catalog', 'hubss-power-point']);
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    if (f.isDirectory() && !skip.has(f.name)) walkSrc(path.join(dir, f.name), depth + 1);
    else if (f.isFile() && /\.(ts|tsx|js|jsx|mdx|mjs)$/.test(f.name)) scanFile(path.join(dir, f.name));
  }
}

['lib', 'app', 'components', 'content', 'scripts'].forEach(d => walkSrc(path.join(root, d)));

// ── 2. Expand dynamic gallery() calls from lib/products.ts + lib/applications.ts ──
//
// The gallery() helper generates paths like:
//   /images/products/{dir}/{slug}-{nn}.{ext}    (products.ts)
//   /images/applications/{dir}/{slug}-{nn}.{ext} (applications.ts)
//
// The static scanner cannot see template literals with ${...} inside,
// so we expand all known calls here manually.

function expandGallery(base, slug, dir, count, ext = 'jpg', pngOverrides = []) {
  const pngSet = new Set(pngOverrides);
  const source = `[expanded gallery: ${base}/${dir}/${slug}]`;
  for (let i = 1; i <= count; i++) {
    const resolvedExt = pngSet.has(i) ? 'png' : ext;
    const n = String(i).padStart(2, '0');
    addRef(`/images/${base}/${dir}/${slug}-${n}.${resolvedExt}`, source);
  }
}

function expandIndexArray(base, dir, slug, indices, ext = 'jpg', pngOverrideSet = new Set()) {
  const source = `[expanded inline: ${base}/${dir}/${slug}]`;
  for (const n of indices) {
    const resolvedExt = pngOverrideSet.has(n) ? 'png' : ext;
    addRef(`/images/${base}/${dir}/${slug}-${String(n).padStart(2, '0')}.${resolvedExt}`, source);
  }
}

// ── Products: gallery() calls ──────────────────────────────────────────────
expandGallery('products', 'traffic-patterns',   'traffic-patterns',   86, 'jpg', [65, 69]);
expandGallery('products', 'decomark',            'decomark',           78);
expandGallery('products', 'mmax',                'mmax',               33);
expandGallery('products', 'duratherm',           'duratherm',          36);
expandGallery('products', 'durashield',          'durashield',         10);
expandGallery('products', 'airmark',             'airmark',            22);
expandGallery('products', 'premark',             'premark',            11);

// ── Products: inline .map() arrays ────────────────────────────────────────
// traffic-patterns-xd: [1,2,4,7,10,...,143]
expandIndexArray('products', 'traffic-patterns-xd', 'traffic-patterns-xd',
  [1,2,4,7,10,13,16,19,22,25,28,31,34,37,40,43,46,49,52,55,58,61,64,67,70,73,76,79,82,85,88,91,94,97,100,103,106,109,112,115,118,121,124,127,129,130,133,136,139,143]);

// streetbond: explicit list
for (const n of [1, 2, 4, 6]) {
  addRef(`/images/products/streetbond/streetbond-0${n}.png`, '[expanded inline: products/streetbond]');
}
for (const n of [9,12,15,18,21,24,27,30,33,36,40,45,50,55]) {
  addRef(`/images/products/streetbond/streetbond-${String(n).padStart(2,'0')}.jpg`, '[expanded inline: products/streetbond]');
}
for (const n of [80,81,82,83,84,85,86,87,88,89,90,91,92,93,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112]) {
  addRef(`/images/products/streetbond/streetbond-${n}.jpg`, '[expanded inline: products/streetbond]');
}

// streetprint: [1,3,5,7,9,10,11,13,15,17,...,91] with png overrides [57,63]
expandIndexArray('products', 'streetprint', 'streetprint',
  [1,3,5,7,9,10,11,13,15,17,19,21,23,25,27,29,31,32,33,35,37,39,41,43,45,47,49,51,53,55,56,57,59,61,63,65,67,69,71,73,75,77,79,80,81,83,85,87,89,91],
  'jpg', new Set([57, 63]));

// streetbondsr: explicit small list
for (const p of [
  '/images/products/streetbondsr/streetbondsr-01.png',
  '/images/products/streetbondsr/streetbondsr-02.jpg',
  '/images/products/streetbondsr/streetbondsr-05.jpg',
  '/images/products/streetbondsr/streetbondsr-07.jpg',
  '/images/products/streetbondsr/streetbondsr-08.jpg',
]) addRef(p, '[expanded inline: products/streetbondsr]');

// chipfill + aggrefill: explicit small lists (static strings already caught, but adding for safety)
for (const p of [
  '/images/products/chipfill/chipfill-aggrefill-bags.jpg',
  '/images/products/chipfill/chipfill-application.jpg',
  '/images/products/chipfill/chipfill-road-repair.webp',
  '/images/products/aggrefill/aggrefill-application.webp',
  '/images/products/chipfill/chipfill-01.jpg',
  '/images/products/chipfill/chipfill-02.jpg',
  '/images/products/aggrefill/aggrefill-application.webp',
  '/images/products/aggrefill/aggrefill-chipfill-bags.jpg',
  '/images/products/chipfill/chipfill-application.jpg',
  '/images/products/chipfill/chipfill-road-repair.webp',
  '/images/products/aggrefill/aggrefill-01.jpg',
  '/images/products/aggrefill/aggrefill-02.jpg',
  '/images/products/fast-patch/fastpatch-repaired.jpg',
  '/images/products/fast-patch/fastpatch-bucket.jpg',
  '/images/products/fast-patch/fast-patch-01.png',
]) addRef(p, '[expanded inline: products/repair]');

// ── Applications: gallery() calls ─────────────────────────────────────────
expandGallery('applications', 'bike-lanes',           'bike-lanes',           38, 'jpg', [32]);
expandGallery('applications', 'bus-lanes',             'bus-lanes',            40, 'jpg', [37, 38, 39, 40]);
expandGallery('applications', 'community-branding',   'community-branding',   14);
expandGallery('applications', 'residential-driveways','residential-driveways',44);
expandGallery('applications', 'sport-courts',         'sport-courts',         21, 'jpg', [19]);
expandGallery('applications', 'splash-pads',          'splash-pads',          19, 'jpg', [11]);
expandGallery('applications', 'leed-urban-heat-island','leed-urban-heat-island', 2);
expandGallery('applications', 'airports',             'airports',             28, 'jpg', [20]);
expandGallery('applications', 'townhomes',            'townhomes',            18, 'jpg', [4, 5, 6, 18]);

// ── Applications: inline .map() arrays ────────────────────────────────────
// crosswalks + pedestrian-safety (same array, after fix: 41→42, 112→116)
expandIndexArray('applications', 'crosswalks', 'crosswalks',
  [1,3,6,8,11,13,16,18,21,23,26,28,31,33,36,38,42,43,45,48,50,53,55,58,60,63,65,68,70,73,75,78,80,83,85,87,90,92,95,97,100,102,105,107,110,116,115,117,120,122],
  'jpg', new Set([115]));

// parking-lots: [1,2,3,4,5,7,8,9,10,11,13,14,15,16,17,19,20,21,22,23,25,26,27,28,29,31,32,33,34,35,37,38,39,40,41,43,44,45,46,47,49,50,51,52,53,55,56,57,58,59]
expandIndexArray('applications', 'parking-lots', 'parking-lots',
  [1,2,3,4,5,7,8,9,10,11,13,14,15,16,17,19,20,21,22,23,25,26,27,28,29,31,32,33,34,35,37,38,39,40,41,43,44,45,46,47,49,50,51,52,53,55,56,57,58,59]);

// parks-paths: after fix (97→95)
expandIndexArray('applications', 'parks-paths', 'parks-paths',
  [1,4,7,10,13,16,19,22,25,28,31,34,37,40,43,46,49,52,55,58,61,64,67,70,73,76,79,82,85,88,91,94,95,100,103,106,109,112,115,118,121,124,127,130,133,136,139,142,143,144],
  'jpg', new Set([100, 103]));

// playgrounds: [1..35 except 18,36, then 37..52 except 51]
expandIndexArray('applications', 'playgrounds', 'playgrounds',
  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52]);

// public-spaces: [1,2,3,5,6,7,9,10,11,13,...,65,66] with png overrides [9..38]
expandIndexArray('applications', 'public-spaces', 'public-spaces',
  [1,2,3,5,6,7,9,10,11,13,14,15,17,18,19,21,22,23,25,26,27,29,30,31,33,34,35,37,38,39,41,42,43,45,46,47,49,50,51,53,54,55,57,58,59,61,62,63,65,66],
  'jpg', new Set([9,10,11,13,14,15,17,18,19,21,22,23,25,26,27,29,30,31,33,34,35,37,38]));

// commercial-spaces: [1,3,5,8,10,12,15,17,19,22,24,26,29,31,33,36,38,40,43,45,47,50,52,54,57,59,61,64,66,68,71,73,75,78,80,82,85,87,89,92,94,96,99,101,103,106,108,110,113,115] with png [110]
expandIndexArray('applications', 'commercial-spaces', 'commercial-spaces',
  [1,3,5,8,10,12,15,17,19,22,24,26,29,31,33,36,38,40,43,45,47,50,52,54,57,59,61,64,66,68,71,73,75,78,80,82,85,87,89,92,94,96,99,101,103,106,108,110,113,115],
  'jpg', new Set([110]));

// traffic-calming + regulatory-markings (same array): [1..9,11..19,21..29,31..39,41..49,51..55] with png [43]
expandIndexArray('applications', 'traffic-calming', 'traffic-calming',
  [1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,31,32,33,34,35,36,37,38,39,41,42,43,44,45,46,47,48,49,51,52,53,54,55],
  'jpg', new Set([43]));

// ── 3. Remove any spurious template-literal fragments caught by static scan ──
// The regex can capture partial template literals like `/images/foo/${n}.jpg`.
// Filter those out — they are not real paths.
for (const key of referenced.keys()) {
  if (key.includes('${')) referenced.delete(key);
}

// ── 4. Check existence of each referenced path ───────────────────────────────
const broken = [];
const valid  = [];

for (const [imgPath, sources] of referenced) {
  const fullPath = path.join(publicRoot, imgPath.replace(/\//g, path.sep));
  const exists = fs.existsSync(fullPath);
  const entry = { path: imgPath, sources: [...sources].sort() };
  if (exists) valid.push(entry);
  else broken.push(entry);
}

// ── 5. Find orphan files (in /public/images/ but never referenced) ───────────
const allPublicImages = [];
function walkPub(dir) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) walkPub(full);
    else if (/\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(f.name)) {
      allPublicImages.push('/' + path.relative(publicRoot, full).replace(/\\/g, '/'));
    }
  }
}
walkPub(path.join(publicRoot, 'images'));

const orphans = allPublicImages.filter(p => !referenced.has(p));

// ── 6. Multi-referenced (used by 3+ source files) ────────────────────────────
const multiRef = valid.filter(e => e.sources.length >= 3);

// ── 7. Output ─────────────────────────────────────────────────────────────────
const result = {
  summary: {
    totalReferenced: referenced.size,
    validPaths: valid.length,
    brokenPaths: broken.length,
    orphanFiles: orphans.length,
    multiReferenced: multiRef.length,
  },
  broken,
  orphans,
  multiReferenced: multiRef,
  valid,
};

fs.writeFileSync(path.join(root, 'scripts', 'image-audit-data.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result.summary, null, 2));
console.log('\nBroken paths:');
broken.forEach(b => console.log('  MISSING:', b.path, '| used by:', b.sources.slice(0,2).join(', ')));
console.log('\nOrphan sample (first 20):');
orphans.slice(0, 20).forEach(o => console.log('  ORPHAN:', o));
