"""Build a single-file curator HTML at _reorg/curator/index.html.

Embeds inventory_scored.json (slim fields only) so the curator is fully
self-contained — Vernon can open it in any browser, pick Keep/Skip on each
image, and download picks.json.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REPORTS = ROOT / "_reorg" / "reports"
CURATOR = ROOT / "_reorg" / "curator"
CURATOR.mkdir(parents=True, exist_ok=True)

inv = json.loads((REPORTS / "inventory_scored.json").read_text(encoding="utf-8"))
slim = []
for r in inv["images"]:
    slim.append({
        "path": r["path"],
        "name": r["name"],
        "size_kb": round(r["size_bytes"] / 1024),
        "w": r["width"],
        "h": r["height"],
        "ext": r["ext"],
        "cat": r["category"],
        "slug": r["category_slug"],
        "b": r["bucket"],
        "q": r["quality_score"],
        "dup": r["dup_count"],
        "ref": r["is_referenced"],
    })

# Sort by category, slug, then quality desc, then path
slim.sort(key=lambda r: (r["cat"], r["slug"] or "", -r["q"], r["path"]))

data_js = json.dumps(slim, separators=(",", ":"))

html = """<!doctype html>
<html lang=en>
<head>
<meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>HUBSS Image Curator</title>
<style>
* {box-sizing:border-box; margin:0; padding:0}
body {font:14px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif; background:#0a0a0a; color:#e5e5e5; min-height:100vh}
header {position:sticky; top:0; z-index:50; background:#000; border-bottom:1px solid #1f1f1f; padding:12px 16px; display:grid; grid-template-columns:auto 1fr auto; gap:16px; align-items:center}
header h1 {font:600 15px/1.2 inherit; color:#fff; letter-spacing:0.02em}
header h1 b {color:#F97316}
.controls {display:flex; gap:8px; flex-wrap:wrap; align-items:center}
.controls select, .controls input, .controls button {background:#161616; color:#e5e5e5; border:1px solid #2a2a2a; padding:6px 10px; border-radius:6px; font:inherit}
.controls input[type=search] {min-width:160px}
.controls button {cursor:pointer; transition:background .12s}
.controls button:hover {background:#1f1f1f}
.controls button.primary {background:#F97316; border-color:#F97316; color:#000; font-weight:600}
.controls button.primary:hover {background:#fb8a3f}
.stats {color:#a1a1a1; font-size:12px; text-align:right; line-height:1.35}
.stats b {color:#F97316}
main {padding:16px}
.grid {display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:10px}
.card {background:#111; border:2px solid #1f1f1f; border-radius:8px; overflow:hidden; transition:border-color .12s, transform .08s; position:relative; cursor:pointer; user-select:none}
.card:hover {border-color:#333}
.card.keep {border-color:#16a34a}
.card.skip {border-color:#dc2626; opacity:0.45}
.card .thumb {aspect-ratio:1/1; background:#000; overflow:hidden; display:flex; align-items:center; justify-content:center}
.card img {width:100%; height:100%; object-fit:cover; display:block}
.card .meta {padding:8px 10px; font-size:11px; line-height:1.35}
.card .name {color:#fff; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:2px}
.card .info {color:#737373; display:flex; gap:6px; flex-wrap:wrap}
.card .info span {white-space:nowrap}
.badge {position:absolute; top:6px; left:6px; padding:2px 6px; border-radius:3px; font:600 10px/1 inherit; letter-spacing:0.04em; background:#000a; color:#fff}
.badge.A {background:#F97316; color:#000}
.badge.B {background:#0a84ff}
.badge.C {background:#525252}
.badge.D {background:#404040; color:#a1a1a1}
.dupbadge {position:absolute; top:6px; right:6px; padding:2px 6px; border-radius:3px; font:600 10px/1 inherit; background:#dc2626a0; color:#fff}
.refbadge {position:absolute; bottom:0; left:0; right:0; padding:3px 6px; font:600 10px/1.2 inherit; background:#16a34acc; color:#000; text-align:center; letter-spacing:0.04em}
.actions {position:absolute; top:50%; left:0; right:0; transform:translateY(-50%); display:flex; gap:6px; justify-content:center; opacity:0; transition:opacity .12s; pointer-events:none}
.card:hover .actions, .card.focused .actions {opacity:1}
.actions button {pointer-events:auto; background:#0008; color:#fff; border:1px solid #fff4; border-radius:4px; padding:6px 12px; cursor:pointer; font:600 11px/1 inherit; backdrop-filter:blur(4px)}
.actions button.keep {background:#16a34acc; border-color:#16a34a}
.actions button.skip {background:#dc2626cc; border-color:#dc2626}
.empty {color:#737373; text-align:center; padding:60px 16px}
.help {position:fixed; bottom:12px; right:12px; background:#000d; border:1px solid #2a2a2a; border-radius:8px; padding:10px 14px; font-size:11px; color:#a1a1a1; line-height:1.5; max-width:240px}
.help kbd {background:#1f1f1f; color:#e5e5e5; padding:1px 5px; border-radius:3px; border:1px solid #333; font-family:inherit; font-size:10px}
.help b {color:#F97316}
@media (max-width:640px) {
  .grid {grid-template-columns:repeat(2,1fr)}
  header {grid-template-columns:1fr; gap:8px}
  .help {display:none}
}
</style>
</head>
<body>
<header>
  <h1>HUBSS <b>Image Curator</b></h1>
  <div class=controls>
    <select id=fcat><option value="">All categories</option></select>
    <select id=fslug><option value="">All sub</option></select>
    <select id=fbucket>
      <option value="">All buckets</option>
      <option value=A>A only</option>
      <option value=B>B only</option>
      <option value=C>C only</option>
      <option value=D>D only</option>
      <option value=AB>A + B</option>
    </select>
    <select id=fpicks>
      <option value="">All picks</option>
      <option value=keep>Kept</option>
      <option value=skip>Skipped</option>
      <option value=unset>Undecided</option>
    </select>
    <input type=search id=fsearch placeholder="filename / path...">
    <button id=bka>Keep all A</button>
    <button id=bsd>Skip all D</button>
    <button id=breset>Reset</button>
    <button id=bexport class=primary>Export picks.json</button>
  </div>
  <div class=stats id=stats></div>
</header>
<main>
  <div class=grid id=grid></div>
  <div class=empty id=empty hidden>No images match those filters.</div>
</main>
<div class=help>
  <b>Keyboard:</b> click a card then use<br>
  <kbd>K</kbd> Keep &middot; <kbd>S</kbd> Skip &middot; <kbd>U</kbd> Undo<br>
  <kbd>&larr;</kbd>/<kbd>&rarr;</kbd> Move between cards
</div>
<script>
const DATA = __DATA__;
const STORE_KEY = "hubss-curator-picks-v1";
let picks = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
let focusedIdx = -1;

const $ = s => document.querySelector(s);
const grid = $("#grid");
const empty = $("#empty");
const stats = $("#stats");

// Populate filters
const cats = [...new Set(DATA.map(r => r.cat))].sort();
const fcat = $("#fcat");
cats.forEach(c => fcat.add(new Option(c, c)));

function refreshSlugs() {
  const cat = fcat.value;
  const slugs = [...new Set(DATA.filter(r => !cat || r.cat === cat).map(r => r.slug).filter(Boolean))].sort();
  const fslug = $("#fslug");
  fslug.innerHTML = '<option value="">All sub</option>';
  slugs.forEach(s => fslug.add(new Option(s, s)));
}
refreshSlugs();
fcat.addEventListener("change", () => { refreshSlugs(); render(); });

function imgSrc(p) { return "../../" + p; }

let filtered = [];
function applyFilters() {
  const cat = fcat.value;
  const slug = $("#fslug").value;
  const buc = $("#fbucket").value;
  const pf = $("#fpicks").value;
  const q = $("#fsearch").value.trim().toLowerCase();
  filtered = DATA.filter(r => {
    if (cat && r.cat !== cat) return false;
    if (slug && r.slug !== slug) return false;
    if (buc) {
      if (buc === "AB") { if (r.b !== "A" && r.b !== "B") return false; }
      else if (r.b !== buc) return false;
    }
    if (pf) {
      const v = picks[r.path];
      if (pf === "unset" && v) return false;
      if (pf === "keep" && v !== "keep") return false;
      if (pf === "skip" && v !== "skip") return false;
    }
    if (q && !r.path.toLowerCase().includes(q)) return false;
    return true;
  });
}

function render() {
  applyFilters();
  empty.hidden = filtered.length > 0;
  // Limit DOM to 600 cards at a time for perf; show note if truncated
  const slice = filtered.slice(0, 600);
  grid.innerHTML = slice.map((r, i) => {
    const v = picks[r.path];
    const cls = v ? ` ${v}` : "";
    const dup = r.dup === undefined ? r.dup : (typeof r.dup === "number" ? r.dup : 1);
    const dupBadge = (dup && dup > 1) ? `<div class=dupbadge>x${dup}</div>` : "";
    const refBadge = r.ref ? `<div class=refbadge>IN USE</div>` : "";
    return `<div class="card${cls}" data-idx="${i}" data-path="${r.path}">
      <div class=thumb><img loading=lazy src="${imgSrc(r.path)}" alt=""></div>
      <div class=meta>
        <div class=name>${r.name}</div>
        <div class=info>
          <span>${r.cat}${r.slug ? "/" + r.slug : ""}</span>
          <span>${r.w}&times;${r.h}</span>
          <span>${r.size_kb}KB</span>
          <span>q${r.q}</span>
        </div>
      </div>
      <div class="badge ${r.b}">${r.b}</div>
      ${dupBadge}
      ${refBadge}
      <div class=actions>
        <button class=keep data-act=keep>Keep</button>
        <button class=skip data-act=skip>Skip</button>
      </div>
    </div>`;
  }).join("");
  updateStats(slice.length, filtered.length);
}

function updateStats(shown, total) {
  const totalN = DATA.length;
  const kept = Object.values(picks).filter(v => v === "keep").length;
  const skipped = Object.values(picks).filter(v => v === "skip").length;
  const undecided = totalN - kept - skipped;
  const trunc = shown < total ? ` (showing first ${shown})` : "";
  stats.innerHTML = `<div><b>${total}</b> match${trunc}</div><div>${kept} kept &middot; ${skipped} skip &middot; ${undecided} undecided</div>`;
}

function setPick(path, val) {
  if (val === null) delete picks[path];
  else picks[path] = val;
  localStorage.setItem(STORE_KEY, JSON.stringify(picks));
}

grid.addEventListener("click", e => {
  const card = e.target.closest(".card");
  if (!card) return;
  const path = card.dataset.path;
  const act = e.target.dataset.act;
  if (act === "keep") { setPick(path, "keep"); card.classList.remove("skip"); card.classList.add("keep"); }
  else if (act === "skip") { setPick(path, "skip"); card.classList.remove("keep"); card.classList.add("skip"); }
  else {
    document.querySelectorAll(".card.focused").forEach(c => c.classList.remove("focused"));
    card.classList.add("focused");
    focusedIdx = parseInt(card.dataset.idx, 10);
  }
  updateStats(document.querySelectorAll(".card").length, filtered.length);
});

document.addEventListener("keydown", e => {
  if (e.target.matches("input,select")) return;
  if (focusedIdx < 0) return;
  const cards = [...document.querySelectorAll(".card")];
  let card = cards[focusedIdx];
  if (!card) return;
  const path = card.dataset.path;
  if (e.key === "k" || e.key === "K") { setPick(path, "keep"); card.classList.remove("skip"); card.classList.add("keep"); }
  else if (e.key === "s" || e.key === "S") { setPick(path, "skip"); card.classList.remove("keep"); card.classList.add("skip"); }
  else if (e.key === "u" || e.key === "U") { setPick(path, null); card.classList.remove("keep","skip"); }
  else if (e.key === "ArrowRight") { focusedIdx = Math.min(cards.length - 1, focusedIdx + 1); cards[focusedIdx].classList.add("focused"); card.classList.remove("focused"); cards[focusedIdx].scrollIntoView({block:"nearest"}); }
  else if (e.key === "ArrowLeft") { focusedIdx = Math.max(0, focusedIdx - 1); cards[focusedIdx].classList.add("focused"); card.classList.remove("focused"); cards[focusedIdx].scrollIntoView({block:"nearest"}); }
  updateStats(cards.length, filtered.length);
});

["fslug", "fbucket", "fpicks"].forEach(id => $("#"+id).addEventListener("change", render));
$("#fsearch").addEventListener("input", render);

$("#bka").addEventListener("click", () => {
  let n = 0;
  filtered.filter(r => r.b === "A").forEach(r => { if (picks[r.path] !== "keep") { setPick(r.path, "keep"); n++; } });
  render();
  alert(`Kept ${n} A-bucket images`);
});
$("#bsd").addEventListener("click", () => {
  let n = 0;
  filtered.filter(r => r.b === "D").forEach(r => { if (picks[r.path] !== "skip") { setPick(r.path, "skip"); n++; } });
  render();
  alert(`Skipped ${n} D-bucket images`);
});
$("#breset").addEventListener("click", () => {
  if (!confirm("Reset all picks?")) return;
  picks = {}; localStorage.removeItem(STORE_KEY); render();
});

$("#bexport").addEventListener("click", () => {
  const out = {
    generated_at: new Date().toISOString(),
    total: DATA.length,
    kept: Object.entries(picks).filter(([,v]) => v === "keep").map(([k]) => k),
    skipped: Object.entries(picks).filter(([,v]) => v === "skip").map(([k]) => k),
  };
  const blob = new Blob([JSON.stringify(out, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "picks.json"; a.click();
  URL.revokeObjectURL(url);
});

render();
</script>
</body>
</html>"""

html = html.replace("__DATA__", data_js)
(CURATOR / "index.html").write_text(html, encoding="utf-8")
print(f"Wrote {CURATOR / 'index.html'} ({len(html)/1024:.0f} KB, {len(slim)} images)")
