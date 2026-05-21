import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const publicRoot = path.join(root, 'public');

// ── 1. Collect all /images/... references from source files ─────────────────
const imgRegex = /['"`](\/images\/[^'"`\s\)>]+)['"`]/g;
const referenced = new Map(); // path -> Set<sourceFile>

function scanFile(filePath) {
  const rel = filePath.replace(root + path.sep, '').replace(/\\/g, '/');
  let content;
  try { content = fs.readFileSync(filePath, 'utf8'); } catch { return; }
  let m;
  const re = new RegExp(imgRegex.source, 'g');
  while ((m = re.exec(content)) !== null) {
    const imgPath = m[1].split('?')[0].split('#')[0];
    if (!imgPath.match(/\.(jpg|jpeg|png|webp|gif|svg|avif|ico|pdf)$/i)) continue;
    if (!referenced.has(imgPath)) referenced.set(imgPath, new Set());
    referenced.get(imgPath).add(rel);
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

// ── 2. Check existence of each referenced path ───────────────────────────────
const broken = [];
const valid  = [];

for (const [imgPath, sources] of referenced) {
  const fullPath = path.join(publicRoot, imgPath.replace(/\//g, path.sep));
  const exists = fs.existsSync(fullPath);
  const entry = { path: imgPath, sources: [...sources].sort() };
  if (exists) valid.push(entry);
  else broken.push(entry);
}

// ── 3. Find orphan files (in /public/images/ but never referenced) ───────────
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

// ── 4. Multi-referenced (used by 3+ source files) ────────────────────────────
const multiRef = valid.filter(e => e.sources.length >= 3);

// ── 5. Output ─────────────────────────────────────────────────────────────────
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
console.log('\nTop broken paths:');
broken.slice(0, 20).forEach(b => console.log('  MISSING:', b.path, '| used by:', b.sources.slice(0,2).join(', ')));
console.log('\nOrphan sample (first 10):');
orphans.slice(0, 10).forEach(o => console.log('  ORPHAN:', o));
