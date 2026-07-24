// Layout lint: replays code.js against a recording mock and flags geometry
// bugs — text/rects out of the 450x450 frame, NaN coords, and overlapping
// text blocks in the same column. Text heights are estimated with the same
// Inter metrics the generator uses (node.height is meaningless in a mock).
const fs = require("fs");
const vm = require("vm");
const path = require("path");
const CODE = path.resolve(__dirname, "../catalog-print-build/figma-plugin/code.js");
const src = fs.readFileSync(CODE, "utf8");

function estLines(text, size, bold, maxW) {
  const str = String(text || "");
  if (!str) return 0;
  const cw = size * (bold ? 0.545 : 0.52);
  const perLine = Math.max(4, Math.floor(maxW / cw));
  let lines = 1, len = 0;
  for (const w of str.split(/\s+/)) {
    const add = w.length + (len ? 1 : 0);
    if (len + add > perLine) { lines++; len = w.length; } else len += add;
  }
  return lines;
}

let frames = [];
function node(kind) {
  const store = { type: kind || "NODE", children: [], x: 0, y: 0, w: 0, h: 0,
                  fontName: { family: "Inter", style: "Regular" }, fontSize: 12, _maxW: null };
  const px = new Proxy(function () {}, {
    get(_t, k) {
      if (k === "then") return undefined;
      if (k === "__store") return store;
      if (k in store) return store[k];
      if (k === "appendChild") return (c) => { store.children.push(c); return c; };
      if (k === "resize" || k === "resizeWithoutConstraints") return (w, h) => { store.w = w; store.h = h; if (store.type === "TEXT") store._maxW = w; };
      return () => node();
    },
    set(_t, k, v) { store[k] = v; return true; },
    apply() { return node(); },
  });
  return px;
}
const figma = {
  mixed: Symbol("mixed"),
  loadFontAsync: async () => {},
  createFrame: () => { const f = node("FRAME"); return f; },
  createText: () => node("TEXT"),
  createRectangle: () => node("RECTANGLE"),
  createEllipse: () => node("ELLIPSE"),
  createComponent: () => node("COMPONENT"),
  createPage: () => node("PAGE"),
  createImage: () => ({ hash: "x" }),
  createImageAsync: async () => ({ hash: "x" }),
  createPaintStyle: () => node("PAINTSTYLE"),
  createTextStyle: () => node("TEXTSTYLE"),
  getLocalTextStyles: () => [],
  getLocalPaintStyles: () => [],
  currentPage: { appendChild: (f) => { frames.push(f.__store); }, children: [], selection: [] },
  root: { children: [] },
  viewport: { scrollAndZoomIntoView: () => {} },
  notify: () => {},
  closePlugin: () => {},
  showUI: () => {},
  ui: { postMessage: () => {}, set onmessage(fn) { this._f = fn; }, get onmessage() { return this._f; } },
};
const sandbox = { figma, __html__: "<html></html>", console: { log: () => {}, warn: () => {}, error: () => {} },
  setTimeout, clearTimeout, Promise, Symbol, Math, JSON, String, Number, Array, Object };
vm.createContext(sandbox);
vm.runInContext(src, sandbox);

(async () => {
  await figma.ui.onmessage({ type: "build", section: "all" });
  const issues = [];
  for (const f of frames) {
    const name = String(f.name || "?");
    const texts = [];
    const walk = (n) => {
      const s = n.__store || n;
      if (!s || !s.type) return;
      if (s.type === "TEXT") {
        const size = s.fontSize || 12;
        const bold = s.fontName && /Bold/.test(s.fontName.style || "");
        const maxW = s._maxW || 394;
        const lines = estLines(s.characters, size, bold, maxW);
        const lh = (s.lineHeight && s.lineHeight.value) || Math.round(size * (size < 11 ? 1.55 : 1.08));
        let ex = s.x, ew = maxW;
        const nch = String(s.characters || "").length;
        if (s.textAlignHorizontal === "CENTER") {
          const tw = Math.min(maxW, nch * size * (bold ? 0.545 : 0.52));
          ex = s.x + (maxW - tw) / 2; ew = tw;
        } else if (s.textAlignHorizontal === "RIGHT") {
          const tw = Math.min(maxW, nch * size * (bold ? 0.545 : 0.52));
          ex = s.x + maxW - tw; ew = tw;
        }
        texts.push({ name: s.name || "(text)", x: ex, y: s.y, w: ew, h: lines * lh, chars: String(s.characters || "").slice(0, 40) });
      }
      (s.children || []).forEach(walk);
    };
    (f.children || []).forEach(walk);
    for (const t of texts) {
      if (!isFinite(t.x) || !isFinite(t.y)) issues.push(`${name} :: NaN coords on "${t.name}"`);
      else {
        if (t.y + t.h > 452) issues.push(`${name} :: "${t.name}" bottom ${Math.round(t.y + t.h)} > 450 ("${t.chars}")`);
        if (t.x + Math.min(t.w, 394) > 453) issues.push(`${name} :: "${t.name}" right edge ${Math.round(t.x + t.w)} > 450`);
        if (t.y < 0) issues.push(`${name} :: "${t.name}" y ${t.y} < 0`);
      }
    }
    // overlap: same-column left-aligned text pairs
    for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
      const a = texts[i], b = texts[j];
      if (!isFinite(a.y) || !isFinite(b.y)) continue;
      const xov = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      if (xov > 6) {
        const top = Math.max(a.y, b.y), bot = Math.min(a.y + a.h, b.y + b.h);
        const ov = bot - top;
        if (ov > 4) issues.push(`${name} :: OVERLAP ${Math.round(ov)}px "${a.name}"(${Math.round(a.y)}-${Math.round(a.y + a.h)}) vs "${b.name}"(${Math.round(b.y)}-${Math.round(b.y + b.h)})`);
      }
    }
  }
  console.log("frames:", frames.length, " issues:", issues.length);
  issues.forEach((x) => console.log("  " + x));
})().catch((e) => { console.error("LINT CRASH:", e); process.exit(1); });
